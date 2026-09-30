import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tools = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_tools_dump.json'), 'utf8'));
const cats = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_cats_dump.json'), 'utf8'));

console.log(`Loaded ${tools.length} tools across ${cats.length} categories.`);

export function findExistingTool(keyword) {
  const kw = keyword.toLowerCase();
  return tools.filter(t => 
    (t.name && t.name.toLowerCase().includes(kw)) || 
    (t.slug && t.slug.toLowerCase().includes(kw)) ||
    (t.desc && t.desc.toLowerCase().includes(kw)) ||
    (t.keywords && t.keywords.toLowerCase().includes(kw))
  );
}

// Quick check of our categories
console.log('Categories list:');
cats.forEach(c => console.log(`- ${c.name} (${c.slug}) -> subcats: ${c.subcategories.map(s => s.slug).join(', ')}`));
