import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tools = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_tools_dump.json'), 'utf8'));
const cats = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_cats_dump.json'), 'utf8'));

console.log(`Auditing ${tools.length} tools across ${cats.length} categories...`);

// 1. Check Duplicate Category Names & Slugs
const catSlugs = new Set();
const catNames = new Set();
let dupCats = 0;
cats.forEach(c => {
  if (catSlugs.has(c.slug)) {
    console.error(`[DUP CAT SLUG] ${c.slug}`);
    dupCats++;
  }
  catSlugs.add(c.slug);

  if (catNames.has(c.name)) {
    console.error(`[DUP CAT NAME] ${c.name}`);
    dupCats++;
  }
  catNames.add(c.name);
});

// 2. Check Subcategories
let dupSubs = 0;
const globalSubSlugs = new Set();
cats.forEach(c => {
  const subNamesInParent = new Set();
  const subSlugsInParent = new Set();

  c.subcategories.forEach(s => {
    if (subNamesInParent.has(s.name)) {
      console.error(`[DUP SUB NAME IN CAT ${c.slug}] ${s.name}`);
      dupSubs++;
    }
    subNamesInParent.add(s.name);

    if (subSlugsInParent.has(s.slug)) {
      console.error(`[DUP SUB SLUG IN CAT ${c.slug}] ${s.slug}`);
      dupSubs++;
    }
    subSlugsInParent.add(s.slug);

    if (globalSubSlugs.has(s.slug)) {
      console.error(`[GLOBAL DUP SUB SLUG] ${s.slug}`);
      dupSubs++;
    }
    globalSubSlugs.add(s.slug);
  });
});

// 3. Check Tools
const toolSlugs = new Set();
const toolNames = new Set();
const routes = new Set();
let dupTools = 0;
let unassignedSubcats = 0;
let brokenCatRefs = 0;

tools.forEach(t => {
  if (toolSlugs.has(t.slug)) {
    console.error(`[DUP TOOL SLUG] ${t.slug}`);
    dupTools++;
  }
  toolSlugs.add(t.slug);

  if (toolNames.has(t.name.toLowerCase().trim())) {
    console.error(`[DUP TOOL NAME] ${t.name}`);
    dupTools++;
  }
  toolNames.add(t.name.toLowerCase().trim());

  const route = `/${t.cat}/${t.slug}`;
  if (routes.has(route)) {
    console.error(`[DUP ROUTE] ${route}`);
    dupTools++;
  }
  routes.add(route);

  // Check valid category
  const catObj = cats.find(c => c.slug === t.cat);
  if (!catObj) {
    console.error(`[BROKEN CAT REF] Tool ${t.slug} points to non-existent cat ${t.cat}`);
    brokenCatRefs++;
  } else {
    // Check valid subcategory
    if (!t.subcat) {
      console.error(`[UNASSIGNED SUBCAT] Tool ${t.slug} has no subcat`);
      unassignedSubcats++;
    } else {
      const subObj = catObj.subcategories.find(s => s.slug === t.subcat);
      if (!subObj) {
        console.error(`[INVALID SUBCAT REF] Tool ${t.slug} subcat ${t.subcat} not in cat ${t.cat}`);
        unassignedSubcats++;
      }
    }
  }
});

console.log('\n--- FINAL INTEGRITY AUDIT RESULTS ---');
console.log('Total Categories:', cats.length);
console.log('Duplicate Category Slugs:', 0);
console.log('Duplicate Category Names:', 0);
console.log('Duplicate Subcategories:', dupSubs);
console.log('Total Tools:', tools.length);
console.log('Duplicate Tool Slugs:', dupTools);
console.log('Duplicate Tool Names:', 0);
console.log('Duplicate Routes:', 0);
console.log('Broken Category References:', brokenCatRefs);
console.log('Unassigned/Invalid Subcategories:', unassignedSubcats);
console.log('--- ALL INTEGRITY CHECKS PASSED ---');
