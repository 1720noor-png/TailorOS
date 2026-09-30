import fs from 'fs';

const html = fs.readFileSync('dist/index.html', 'utf8');
console.log('HTML contents:\n', html);

const match = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
if (match) {
  const jsFile = match[1];
  console.log('Found main bundle:', jsFile);
  const code = fs.readFileSync('dist/assets/' + jsFile, 'utf8');
  console.log('Main bundle size:', code.length, 'bytes');
  
  // Check if there are any obvious unhandled errors or imports
  console.log('First 200 chars of bundle:', code.slice(0, 200));
} else {
  console.log('Could not find main bundle script in HTML!');
}
