import fs from 'fs';

const dump = JSON.parse(fs.readFileSync('scripts/cat_tools_dump.json', 'utf8'));
const totalInDump = dump.targetCategories.reduce((sum, c) => sum + c.tools.length, 0);
console.log('Total tools in target categories:', totalInDump);
console.log('Categories in dump:', dump.targetCategories.length);

// List category names and their tool counts
dump.targetCategories.forEach(c => {
  console.log(`${c.slug} (${c.name}): ${c.tools.length} tools`);
});
