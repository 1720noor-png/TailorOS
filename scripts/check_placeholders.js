import fs from 'fs';

const status = JSON.parse(fs.readFileSync('audit_all_tools_status.json', 'utf8'));
const placeholders = status.filter(t => !t.isFunctional);
console.log('Placeholders count:', placeholders.length);
for (const p of placeholders) {
  console.log(JSON.stringify(p, null, 2));
}
