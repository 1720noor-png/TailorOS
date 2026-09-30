import fs from 'fs';
import path from 'path';

// 1. Read registry.js
const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Parse imports
const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
const componentToFile = {};
let match;
while ((match = importRegex.exec(regContent)) !== null) {
  componentToFile[match[1]] = match[2];
}

console.log('Total import statements found in registry.js:', Object.keys(componentToFile).length);

// Scan all files in src/tools
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
console.log('Total tool files found on disk under src/tools:', toolFilesOnDisk.length);

// Scan all directories under src/tools
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

// Check for empty directories
const emptyDirs = allToolDirs.filter(d => fs.readdirSync(d).length === 0);
console.log('Empty directories count:', emptyDirs.length);

// Parse categories
const catStartIndex = regContent.indexOf('export const categories = [');
const catEndIndex = regContent.indexOf('\nexport const tools = [', catStartIndex);
const catText = regContent.substring(catStartIndex + 'export const categories = '.length, catEndIndex).trim();

const parseArray = new Function(`return ${catText};`);
const categories = parseArray();
console.log('Successfully parsed categories count:', categories.length);

// Parse tools
const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();

// Replace Component: <Identifier> with Component: "<Identifier>"
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const parseTools = new Function(`return ${safeToolsText};`);
const tools = parseTools();

console.log('Successfully parsed tools count:', tools.length);

// Now analyze each tool file on disk to determine if it is functional or placeholder
// We can read each file content and check if it has state, inputs, calculations, or is just a placeholder return
const toolQualityMap = {};
for (const file of toolFilesOnDisk) {
  const content = fs.readFileSync(file, 'utf8');
  const isPlaceholder = 
    content.includes('Under Construction') || 
    content.includes('Coming Soon') || 
    content.includes('Placeholder') || 
    (content.length < 350 && !content.includes('useState') && !content.includes('input') && !content.includes('button'));
  
  toolQualityMap[file] = {
    isPlaceholder,
    length: content.length,
    hasState: content.includes('useState'),
    hasInput: content.includes('<input') || content.includes('<textarea') || content.includes('<select'),
    hasOutput: content.includes('setResult') || content.includes('setOutput') || content.includes('res')
  };
}

fs.writeFileSync('audit_full_analysis.json', JSON.stringify({
  categories,
  toolsCount: tools.length,
  emptyDirs: emptyDirs.map(d => path.relative(path.resolve('.'), d)),
  componentToFile,
  toolQualityMapSummary: {
    totalFiles: Object.keys(toolQualityMap).length,
    placeholderFiles: Object.values(toolQualityMap).filter(q => q.isPlaceholder).length,
    functionalFiles: Object.values(toolQualityMap).filter(q => !q.isPlaceholder).length
  }
}, null, 2));

console.log('Saved audit_full_analysis.json');
