const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Error: Please provide a file path.');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

if (!filePath.endsWith('.vue')) {
  console.error('Error: File must have a .vue extension.');
  process.exit(1);
}

if (!content.includes('<script setup')) {
  console.error('Error: Component must use <script setup>.');
  process.exit(1);
}

if (!content.includes('lang="ts"')) {
  console.warn('Warning: Component is not using TypeScript (lang="ts").');
}

console.log(`Success: Component ${path.basename(filePath)} is valid.`);
