const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredPageExtensions = ['.js', '.json', '.wxml', '.wxss'];
const requiredComponentExtensions = ['.js', '.json', '.wxml', '.wxss'];
const errors = [];

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return {};
  }
}

function ensureFiles(basePath, extensions) {
  extensions.forEach((extension) => {
    const relativePath = `${basePath}${extension}`;
    if (!fs.existsSync(path.join(root, relativePath))) {
      errors.push(`Missing ${relativePath}`);
    }
  });
}

function loadDefinition(relativePath, globalName) {
  let definition;
  const previous = global[globalName];
  global[globalName] = (value) => {
    definition = value;
  };

  try {
    const resolved = require.resolve(path.join(root, relativePath));
    delete require.cache[resolved];
    require(resolved);
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
  } finally {
    if (previous === undefined) delete global[globalName];
    else global[globalName] = previous;
  }

  return definition || {};
}

function validateHandlers(pagePath) {
  const wxmlPath = `${pagePath}.wxml`;
  const markup = fs.readFileSync(path.join(root, wxmlPath), 'utf8');
  const handlerNames = new Set(
    [...markup.matchAll(/(?:bind|catch)(?:tap|input|change)="([A-Za-z0-9_]+)"/g)]
      .map((match) => match[1])
  );
  const definition = loadDefinition(`${pagePath}.js`, 'Page');

  handlerNames.forEach((handlerName) => {
    if (typeof definition[handlerName] !== 'function') {
      errors.push(`${wxmlPath}: missing Page handler ${handlerName}`);
    }
  });
}

function validateMarkup(relativePath) {
  const markup = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const stack = [];
  const tagPattern = /<\/?([A-Za-z][A-Za-z0-9-]*)\b[^>]*>/g;

  for (const match of markup.matchAll(tagPattern)) {
    const token = match[0];
    const tagName = match[1];
    if (token.startsWith('</')) {
      const openTag = stack.pop();
      if (openTag !== tagName) {
        errors.push(`${relativePath}: expected </${openTag || 'none'}> before </${tagName}>`);
        return;
      }
    } else if (!token.endsWith('/>')) {
      stack.push(tagName);
    }
  }

  if (stack.length) {
    errors.push(`${relativePath}: unclosed <${stack[stack.length - 1]}>`);
  }
}

const appConfig = readJson('app.json');
readJson('project.config.json');
readJson('sitemap.json');
loadDefinition('app.js', 'App');

(appConfig.pages || []).forEach((pagePath) => {
  ensureFiles(pagePath, requiredPageExtensions);
  const pageConfig = readJson(`${pagePath}.json`);
  validateHandlers(pagePath);
  validateMarkup(`${pagePath}.wxml`);

  Object.values(pageConfig.usingComponents || {}).forEach((componentPath) => {
    const normalized = componentPath.replace(/^\//, '');
    ensureFiles(normalized, requiredComponentExtensions);
  });
});

['components/stage-poster/index', 'components/actor-art/index'].forEach((componentPath) => {
  ensureFiles(componentPath, requiredComponentExtensions);
  validateMarkup(`${componentPath}.wxml`);
  loadDefinition(`${componentPath}.js`, 'Component');
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${appConfig.pages.length} pages and 2 shared components.`);
