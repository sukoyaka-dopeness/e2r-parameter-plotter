import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.env.PARAMETER_PLOTTER_BUILD_OUTPUT || join(root, 'dist'));
const entry = 'main.js';
const modulePattern = /(?:import|export)\s+(?:[^'";]*?\s+from\s*)?['"](\.\.?\/[^'"]+)['"]/g;
const modules = new Set();
const pending = [entry];

while (pending.length) {
  const modulePath = pending.pop();
  if (modules.has(modulePath)) continue;
  modules.add(modulePath);
  const source = await readFile(resolve(root, modulePath), 'utf8');
  for (const match of source.matchAll(modulePattern)) {
    const dependency = resolve(dirname(resolve(root, modulePath)), match[1]);
    const relativeDependency = relative(root, dependency);
    if (relativeDependency.startsWith(`..${sep}`) || relativeDependency === '..') {
      throw new Error(`Module import escapes the project: ${modulePath} -> ${match[1]}`);
    }
    pending.push(relativeDependency.split(sep).join('/'));
  }
}

const assets = [
  'index.html',
  'favicon.svg',
  'style.css',
  'second-pass.css',
  'first-slice.css',
  'home-screen.css',
  ...modules,
  'samples/ashen-crown.en.e2r.json',
  'samples/ashen-crown.ja.e2r.json'
];

await mkdir(output, {recursive: true});
for (const asset of assets) {
  const destination = resolve(output, asset);
  if (!destination.startsWith(`${output}${sep}`)) throw new Error(`Invalid build path: ${asset}`);
  await mkdir(dirname(destination), {recursive: true});
  await copyFile(resolve(root, asset), destination);
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Built ${assets.length + 1} static Pages files into dist/.`);
