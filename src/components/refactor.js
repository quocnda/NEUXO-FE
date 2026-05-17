const fs = require('fs');
const path = require('path');

const targetDirs = [
  'Company',
  'Contact',
  'Campaign',
  'Email',
  'Event',
  'Watchlist'
].map(d => path.join('/home/quocnda/.neuxo/fe_new/NEUXO-FE/src/components/Modal', d));

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

const hStackRegex = /<HStack\s+pos=\{['"](?:center|apart|right)['"]\}\s*[^>]*>([\s\S]*?)<\/HStack>/g;

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  walkDir(dir, filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We only want to replace HStack with DialogFooter if it contains a button for Cancel/Save etc. at the bottom.
    // Instead of risking a generic regex, let's inject DialogFooter import if needed, and manually replace.
    // Let's actually just replace `<HStack pos={'center'} spacing={12} noWrap>` and similar 
    // with `<DialogFooter>` and change `</HStack>` to `</DialogFooter>` where it looks like a footer.

    // This is a bit too risky. Let's do it file by file using sed or simple replace where we know the structure.
  });
});
