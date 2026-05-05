import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const assets = [
  {
    src: 'node_modules/@matbee/libreoffice-converter/wasm',
    dest: 'public/wasm',
    isDir: true
  },
  {
    src: 'node_modules/@matbee/libreoffice-converter/dist/browser.worker.global.js',
    dest: 'public/wasm/browser.worker.js'
  },
  {
    src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
    dest: 'public/pdfjs/pdf.worker.min.mjs'
  }
];

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

assets.forEach(asset => {
  const srcPath = path.join(__dirname, asset.src);
  const destPath = path.join(__dirname, asset.dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source path does not exist: ${srcPath}`);
    return;
  }

  if (asset.isDir) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    copyRecursive(srcPath, destPath);
  } else {
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
  }
  console.log(`Copied ${asset.src} to ${asset.dest}`);
});
