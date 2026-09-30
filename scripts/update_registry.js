import fs from 'fs';
import path from 'path';

const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Parse imports section
const catStartIndex = regContent.indexOf('export const categories = [');
const importsText = regContent.substring(0, catStartIndex);

// Parse categories section
const catEndIndex = regContent.indexOf('\nexport const tools = [', catStartIndex);
const catText = regContent.substring(catStartIndex + 'export const categories = '.length, catEndIndex).trim();
const categories = new Function(`return ${catText};`)();

// Parse tools section
const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const rawTools = new Function(`return ${safeToolsText};`)();
const tools = rawTools.filter(Boolean);

// Parse trailing code
const trailingText = regContent.substring(toolsEndIndex);

// Load new subcategories and tool mapping
const newSubcats = JSON.parse(fs.readFileSync('scripts/new_subcategories.json', 'utf8'));
const finalToolMap = JSON.parse(fs.readFileSync('scripts/final_tool_mapping.json', 'utf8'));

// 1. Update categories array with new subcategories for the 41 categories
const updatedCategories = categories.map(c => {
  if (newSubcats[c.slug]) {
    return {
      ...c,
      subcategories: newSubcats[c.slug]
    };
  }
  return c;
});

// 2. Update tools array with subcat and subcatName
const updatedTools = tools.map(t => {
  if (finalToolMap[t.slug]) {
    return {
      ...t,
      subcat: finalToolMap[t.slug].subcat,
      subcatName: finalToolMap[t.slug].subcatName
    };
  }
  return t;
});

console.log('Categories count:', updatedCategories.length);
console.log('Tools count:', updatedTools.length);

// Generate new registry.js code
let newReg = importsText;

newReg += 'export const categories = ' + JSON.stringify(updatedCategories, null, 2) + '\n\n';

newReg += 'export const tools = [\n';
updatedTools.forEach((t, idx) => {
  const isLast = idx === updatedTools.length - 1;
  
  // Format each tool object nicely preserving raw Component identifier
  const toolObj = {
    cat: t.cat,
    ...(t.subcat ? { subcat: t.subcat, subcatName: t.subcatName } : {}),
    slug: t.slug,
    name: t.name,
    icon: t.icon,
    ...(t.popular ? { popular: true } : {}),
    Component: `__COMP__${t.Component}__COMP__`,
    desc: t.desc,
    why: t.why,
    ...(t.steps ? { steps: t.steps } : {}),
    ...(t.keywords ? { keywords: t.keywords } : {})
  };

  let str = '  ' + JSON.stringify(toolObj);
  // Replace "__COMP__ComponentName__COMP__" with ComponentName
  str = str.replace(/"__COMP__([A-Za-z0-9_]+)__COMP__"/, '$1');
  
  newReg += str + (isLast ? '\n' : ',\n');
});
newReg += ']\n' + trailingText;

fs.writeFileSync('src/data/registry.js', newReg, 'utf8');
console.log('Successfully wrote updated src/data/registry.js!');
