import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('dist/index.html', 'utf8');

const virtualConsole = new (await import('jsdom')).VirtualConsole();
const errors = [];
const logs = [];

virtualConsole.on('error', (err) => {
  errors.push(err);
  console.error('[BROWSER ERROR]:', err);
});
virtualConsole.on('jsdomError', (err) => {
  errors.push(err);
  console.error('[JSDOM ERROR]:', err);
});
virtualConsole.on('log', (msg) => {
  logs.push(msg);
  console.log('[BROWSER LOG]:', msg);
});

const dom = new JSDOM(html, {
  url: 'https://vimztools-app.netlify.app/',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole,
  beforeParse(window) {
    // MatchMedia mock
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
    // ScrollTo mock
    window.scrollTo = () => {};
    // Intercept script loading to read from dist/
    const originalFetch = window.fetch;
    window.fetch = async (url, opts) => {
      return {
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({})
      };
    };
  }
});

// Since external ESM scripts are loaded relative to URL, let's load the main bundle directly
setTimeout(async () => {
  try {
    const match = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
    if (!match) throw new Error('No script bundle found');
    const jsPath = path.resolve('dist/assets', match[1]);
    const bundleCode = fs.readFileSync(jsPath, 'utf8');
    
    // Evaluate in dom window
    console.log('Evaluating bundle in DOM window...');
    dom.window.eval(bundleCode);
    
    // Wait for React to render
    setTimeout(() => {
      const rootHtml = dom.window.document.getElementById('root').innerHTML;
      console.log('--- ROOT RENDER LENGTH ---', rootHtml.length);
      console.log('--- ROOT RENDER PREVIEW ---', rootHtml.slice(0, 300));
      if (errors.length) {
        console.log('Total errors caught:', errors.length);
      }
      process.exit(0);
    }, 1000);
  } catch (e) {
    console.error('Execution failure:', e);
    process.exit(1);
  }
}, 500);
