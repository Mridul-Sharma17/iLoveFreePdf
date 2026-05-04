import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

async function parse() {
  const dataBuffer = fs.readFileSync('extracted-test.pdf');
  const data = await pdf(dataBuffer);
  console.log(data.text);
}
parse();