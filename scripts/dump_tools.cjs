const fs = require('fs');
const path = require('path');

// Read registry.js as text and inspect tools
const regPath = path.join(__dirname, '../src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

// Extract CATEGORIES and TOOLS
const evalScope = {};
const fn = new Function('module', 'exports', regContent);
const moduleObj = { exports: {} };
fn(moduleObj, moduleObj.exports);

const { CATEGORIES, TOOLS } = moduleObj.exports;
console.log('Categories count:', CATEGORIES.length);
console.log('Tools count:', TOOLS.length);

const dumpPath = path.join(__dirname, 'all_tools_dump.json');
fs.writeFileSync(dumpPath, JSON.stringify(TOOLS.map(t => ({
  id: t.id,
  name: t.name,
  slug: t.slug,
  cat: t.cat,
  subcat: t.subcat,
  desc: t.desc
})), null, 2));

console.log('Dumped to all_tools_dump.json');
