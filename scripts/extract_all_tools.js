import fs from 'fs';
import path from 'path';

// 1. Read existing registry.js
const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Parse tools
const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const rawTools = new Function(`return ${safeToolsText};`)();
const tools = rawTools.filter(Boolean);

const newSubcats = JSON.parse(fs.readFileSync('scripts/new_subcategories.json', 'utf8'));

// Group tools by their cat slug for all 41 categories
const toolsByCat = {};
for (const catSlug of Object.keys(newSubcats)) {
  toolsByCat[catSlug] = tools.filter(t => t.cat === catSlug);
}

fs.writeFileSync('scripts/all_tools_for_41_cats.json', JSON.stringify(toolsByCat, null, 2));
console.log('Saved all_tools_for_41_cats.json');
