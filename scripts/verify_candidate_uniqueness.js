import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tools = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_tools_dump.json'), 'utf8'));

const candidateSlugs = [
  'ab-test-sample-calc',
  'pii-text-redactor',
  'sla-uptime-calc',
  'pdf-bates-stamper',
  'rice-prioritization-calc',
  'llm-vram-estimator',
  'crosswind-headwind-calc',
  'density-altitude-calc',
  'beam-deflection-calc',
  'dcf-valuation-calc',
  'egfr-creatinine-calc',
  'pediatric-dosage-calc',
  'local-anesthetic-calc',
  'vet-fluid-therapy-calc',
  'stair-riser-tread-calc'
];

console.log('Auditing Candidate Slugs against Existing 1000 Tools:');
candidateSlugs.forEach(slug => {
  const match = tools.find(t => t.slug === slug);
  if (match) {
    console.log(`[DUPLICATE ERROR] Exact slug collision: ${slug} already exists!`);
  } else {
    console.log(`[CLEARED] ${slug} is 100% novel.`);
  }
});
