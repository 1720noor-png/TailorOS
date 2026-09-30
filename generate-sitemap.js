import fs from 'fs';

const BASE_URL = 'https://vimztools-app.netlify.app';

const content = fs.readFileSync('src/data/registry.js', 'utf8');

// Get categories
const catStart = content.indexOf('export const categories = [');
const catEnd = content.indexOf('export const tools = [');
const catSection = content.substring(catStart, catEnd);
const catMatches = [...catSection.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)].map(m => m[1]);

// Get tools
const toolsStart = content.indexOf('export const tools = [');
const toolsEnd = content.lastIndexOf('export const related =');
const toolsSection = content.substring(toolsStart, toolsEnd);

const toolRegex = /cat:\s*['"`]([^'"`]+)['"`],\s*(?:subcat:[^,]+,\s*(?:subcatName:[^,]+,\s*)?)?slug:\s*['"`]([^'"`]+)['"`]/g;
let m;
const toolEntries = [];
while ((m = toolRegex.exec(toolsSection)) !== null) {
  toolEntries.push({ cat: m[1], slug: m[2] });
}

console.log('Categories for sitemap:', catMatches.length);
console.log('Tools for sitemap:', toolEntries.length);

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tools</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/categories</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/feedback</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/disclaimer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

// Categories
catMatches.forEach(catSlug => {
  xml += `  <url>
    <loc>${BASE_URL}/${catSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Tools
toolEntries.forEach(t => {
  xml += `  <url>
    <loc>${BASE_URL}/${t.cat}/${t.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log('Successfully wrote public/sitemap.xml');
