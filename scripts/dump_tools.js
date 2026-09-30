import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const regPath = path.join(__dirname, '../src/data/registry.js');
let regCode = fs.readFileSync(regPath, 'utf8');

const catStart = regCode.indexOf('export const categories = [');
const toolsStart = regCode.indexOf('export const tools = [');
const toolsEnd = regCode.indexOf('export const related =');

const catSlice = regCode.slice(catStart, toolsStart).replace('export const categories =', 'const categories =');
let toolsSlice = regCode.slice(toolsStart, toolsEnd !== -1 ? toolsEnd : regCode.length).replace('export const tools =', 'const tools =');

// Regex replace any Component: <Whatever>
toolsSlice = toolsSlice.replace(/"Component"\s*:\s*[^,}\]]+/g, '"Component": null');
toolsSlice = toolsSlice.replace(/Component\s*:\s*[^,}\]]+/g, 'Component: null');

const codeToEval = `
${catSlice}
${toolsSlice}
exports.categories = categories;
exports.tools = tools;
`;

const evalFn = new Function('exports', codeToEval);
const exports = {};
evalFn(exports);

const { categories, tools } = exports;

console.log('Categories count:', categories.length);
console.log('Tools count:', tools.length);

const dumpPath = path.join(__dirname, 'all_tools_dump.json');
fs.writeFileSync(dumpPath, JSON.stringify(tools.map(t => ({
  slug: t.slug,
  name: t.name,
  cat: t.cat,
  subcat: t.subcat,
  subcatName: t.subcatName,
  desc: t.desc,
  why: t.why,
  keywords: t.keywords
})), null, 2));

const catsDumpPath = path.join(__dirname, 'all_cats_dump.json');
fs.writeFileSync(catsDumpPath, JSON.stringify(categories, null, 2));

console.log('SUCCESS! Dump files created.');
