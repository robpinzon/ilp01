import fs from 'fs';

const css = fs.readFileSync('src/styles/main.css', 'utf8');
let dataJs = fs.readFileSync('src/data/pampanga-data.js', 'utf8');
let mainJs = fs.readFileSync('src/main.js', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');
const logoSvg = fs.readFileSync('public/logo-arayat.svg', 'utf8');
const faviconSvg = fs.readFileSync('public/favicon.svg', 'utf8');

// Strip exports and imports
dataJs = dataJs.replace(/export const /g, 'const ');
mainJs = mainJs.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/, '// Data bundled inline above');

// Encode favicon as base64 data URI
const faviconDataUri = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`;

// Replace external CSS link with inline <style> if present
if (html.includes('<link rel="stylesheet" href="/src/styles/main.css">')) {
  html = html.replace(
    '<link rel="stylesheet" href="/src/styles/main.css">',
    `<style>\n${css}\n</style>`
  );
}

// Replace favicon with data URI if external href present
if (html.includes('<link rel="icon" type="image/svg+xml" href="/favicon.svg">')) {
  html = html.replace(
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
    `<link rel="icon" type="image/svg+xml" href="${faviconDataUri}">`
  );
}

// Replace script tag with inline script containing dataJs and mainJs
const inlineScriptRegex = /<script>\s*\/\* --- PAMPANGA VERIFIED DATA --- \*\/[\s\S]*?<\/script>/;
if (inlineScriptRegex.test(html)) {
  html = html.replace(inlineScriptRegex, `<script>\n/* --- PAMPANGA VERIFIED DATA --- */\n${dataJs}\n\n/* --- APPLICATION CONTROLLER --- */\n${mainJs}\n</script>`);
} else {
  html = html.replace(
    '<script type="module" src="/src/main.js"></script>',
    `<script>\n/* --- PAMPANGA VERIFIED DATA --- */\n${dataJs}\n\n/* --- APPLICATION CONTROLLER --- */\n${mainJs}\n</script>`
  );
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated 100% self-contained standalone index.html!');
console.log('Final index.html size:', (fs.statSync('index.html').size / 1024).toFixed(1), 'KB');
