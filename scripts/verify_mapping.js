import fs from 'fs';
import path from 'path';

// 1. Read existing registry.js
const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

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

const newSubcats = JSON.parse(fs.readFileSync('scripts/new_subcategories.json', 'utf8'));
const toolMap = JSON.parse(fs.readFileSync('scripts/tool_subcat_mapping.json', 'utf8'));

// Verify that all tools in the 41 categories have a subcategory assignment
const unassigned = [];
for (const t of tools) {
  if (newSubcats[t.cat]) {
    const mapping = toolMap[t.slug];
    if (!mapping) {
      unassigned.push({ cat: t.cat, slug: t.slug, name: t.name });
    }
  }
}

console.log('Unassigned tools count in the 41 categories:', unassigned.length);
if (unassigned.length > 0) {
  console.log('Sample unassigned:', unassigned.slice(0, 10));
}
