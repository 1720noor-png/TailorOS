import fs from 'fs';
import path from 'path';

// 1. Read registry.js
const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Parse imports
const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
const imports = [];
let match;
while ((match = importRegex.exec(regContent)) !== null) {
  imports.push({ name: match[1], path: match[2] });
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
const tools = rawTools.filter(Boolean);

console.log('Categories count:', categories.length);
console.log('Tools count:', tools.length);

// Group tools by category
const toolsByCat = {};
for (const c of categories) {
  toolsByCat[c.slug] = tools.filter(t => t.cat === c.slug);
}

// Categorize 41 target categories
const targetCategories = categories.filter(c => !c.subcategories || c.subcategories.length === 0);
console.log('Target categories count (0 subcategories):', targetCategories.length);

fs.writeFileSync('scripts/cat_tools_dump.json', JSON.stringify({
  targetCategories: targetCategories.map(c => ({
    name: c.name,
    slug: c.slug,
    tools: toolsByCat[c.slug].map(t => ({ name: t.name, slug: t.slug, desc: t.desc, why: t.why }))
  }))
}, null, 2));

console.log('Dumped target categories to scripts/cat_tools_dump.json');
