import fs from 'fs';
import path from 'path';

const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Parse imports
const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
const componentToFile = {};
let match;
while ((match = importRegex.exec(regContent)) !== null) {
  componentToFile[match[1]] = match[2];
}

// Parse categories
const catStartIndex = regContent.indexOf('export const categories = [');
const catEndIndex = regContent.indexOf('\nexport const tools = [', catStartIndex);
const catText = regContent.substring(catStartIndex + 'export const categories = '.length, catEndIndex).trim();
const categories = new Function(`return ${catText};`)();

// Parse tools
const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const rawTools = new Function(`return ${safeToolsText};`)();

// Filter out undefined hole at index 252 (line 2684 duplicate comma in file)
const tools = rawTools.filter(Boolean);

// Scan files on disk
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const toolFilesOnDisk = getFiles(path.resolve('src/tools'));

// Scan empty dirs
function getDirs(dir, dirList = []) {
  if (!fs.existsSync(dir)) return dirList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      dirList.push(filePath);
      getDirs(filePath, dirList);
    }
  }
  return dirList;
}
const allToolDirs = getDirs(path.resolve('src/tools'));
const emptyDirs = allToolDirs.filter(d => fs.readdirSync(d).length === 0);

// Check unregistered files
const registeredFilePaths = new Set(
  Object.values(componentToFile).map(rel => path.normalize(path.resolve('src/data', rel)))
);
const unregisteredFiles = toolFilesOnDisk.filter(f => !registeredFilePaths.has(path.normalize(f)));

// Check duplicate tool names
const nameCount = {};
for (const t of tools) {
  nameCount[t.name] = (nameCount[t.name] || 0) + 1;
}
const duplicateNames = Object.entries(nameCount)
  .filter(([_, count]) => count > 1)
  .map(([name, count]) => ({
    name,
    count,
    occurrences: tools.filter(t => t.name === name).map(t => ({ cat: t.cat, slug: t.slug, subcat: t.subcat }))
  }));

// Check duplicate routes (/cat/slug)
const routeCount = {};
for (const t of tools) {
  const route = `/${t.cat}/${t.slug}`;
  routeCount[route] = (routeCount[route] || 0) + 1;
}
const duplicateRoutes = Object.entries(routeCount)
  .filter(([_, count]) => count > 1)
  .map(([route, count]) => ({ route, count }));

// Check duplicate slugs across all tools regardless of category
const slugCount = {};
for (const t of tools) {
  slugCount[t.slug] = (slugCount[t.slug] || 0) + 1;
}
const duplicateSlugs = Object.entries(slugCount)
  .filter(([_, count]) => count > 1)
  .map(([slug, count]) => ({
    slug,
    count,
    occurrences: tools.filter(t => t.slug === slug).map(t => ({ name: t.name, cat: t.cat }))
  }));

// Check broken imports
const brokenImports = [];
for (const [comp, relPath] of Object.entries(componentToFile)) {
  const fullPath = path.resolve('src/data', relPath);
  if (!fs.existsSync(fullPath)) {
    brokenImports.push({ comp, relPath, fullPath: path.relative(path.resolve('.'), fullPath).replace(/\\/g, '/') });
  }
}

// Check tools missing component
const toolsMissingComponent = tools.filter(t => !componentToFile[t.Component]).map(t => ({
  name: t.name,
  slug: t.slug,
  Component: t.Component
}));

// Check functionality of each tool
const toolStatus = [];
for (const t of tools) {
  const relPath = componentToFile[t.Component];
  if (!relPath) {
    toolStatus.push({ ...t, isFunctional: false, status: 'Missing Component Import', filePath: null });
    continue;
  }
  const fullPath = path.resolve('src/data', relPath);
  if (!fs.existsSync(fullPath)) {
    toolStatus.push({ ...t, isFunctional: false, status: 'File Not Found', filePath: path.relative(path.resolve('.'), fullPath).replace(/\\/g, '/') });
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const isPlaceholder = 
    content.includes('Under Construction') || 
    content.includes('Coming Soon') || 
    content.includes('Placeholder') || 
    (content.length < 350 && !content.includes('useState') && !content.includes('input') && !content.includes('button'));
  
  toolStatus.push({
    name: t.name,
    cat: t.cat,
    subcat: t.subcat || null,
    subcatName: t.subcatName || null,
    slug: t.slug,
    route: `/${t.cat}/${t.slug}`,
    Component: t.Component,
    filePath: path.relative(path.resolve('.'), fullPath).replace(/\\/g, '/'),
    isFunctional: !isPlaceholder,
    status: isPlaceholder ? 'Placeholder / Incomplete' : 'Functional',
    fileLength: content.length
  });
}

// Overlapping tools by normalized functional core
const funcGroups = {};
for (const t of tools) {
  const clean = t.name.toLowerCase()
    .replace(/calculator|generator|converter|checker|tool|estimator|counter|planner|analyzer|builder|tracker|finder|scaler|timer/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  if (clean.length > 2) {
    if (!funcGroups[clean]) funcGroups[clean] = [];
    funcGroups[clean].push(t);
  }
}
const overlappingPairs = Object.entries(funcGroups)
  .filter(([_, group]) => group.length > 1)
  .map(([concept, group]) => ({
    concept,
    tools: group.map(g => ({ name: g.name, cat: g.cat, slug: g.slug }))
  }));

const auditSummary = {
  totalCategories: categories.length,
  totalSubcategories: categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0),
  totalRegisteredTools: tools.length,
  rawToolsArrayLength: rawTools.length,
  toolsWithUndefinedHole: rawTools.length - tools.length,
  functionalToolsCount: toolStatus.filter(t => t.isFunctional).length,
  placeholderToolsCount: toolStatus.filter(t => !t.isFunctional).length,
  duplicateNamesCount: duplicateNames.length,
  duplicateNames,
  duplicateRoutesCount: duplicateRoutes.length,
  duplicateRoutes,
  duplicateSlugsCount: duplicateSlugs.length,
  duplicateSlugs,
  brokenImportsCount: brokenImports.length,
  brokenImports,
  toolsMissingComponentCount: toolsMissingComponent.length,
  toolsMissingComponent,
  emptyDirsCount: emptyDirs.length,
  emptyDirs: emptyDirs.map(d => path.relative(path.resolve('.'), d).replace(/\\/g, '/')),
  unregisteredFilesCount: unregisteredFiles.length,
  unregisteredFiles: unregisteredFiles.map(f => path.relative(path.resolve('.'), f).replace(/\\/g, '/')),
  overlappingPairsCount: overlappingPairs.length,
  overlappingPairs
};

fs.writeFileSync('audit_full_summary.json', JSON.stringify(auditSummary, null, 2));
fs.writeFileSync('audit_all_tools_status.json', JSON.stringify(toolStatus, null, 2));
console.log('Successfully generated full audit JSON datasets');
