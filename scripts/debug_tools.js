import fs from 'fs';
import path from 'path';

const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const tools = new Function(`return ${safeToolsText};`)();

console.log('Total length of tools array:', tools.length);
const undefinedIndices = [];
for (let i = 0; i < tools.length; i++) {
  if (!tools[i]) {
    undefinedIndices.push(i);
  }
}
console.log('Undefined slots in tools array:', undefinedIndices);
if (undefinedIndices.length > 0) {
  // Find where in safeToolsText this occurs
  console.log('Around undefined index 0:');
  const validBefore = tools[undefinedIndices[0] - 1];
  console.log('Valid before:', validBefore);
}
