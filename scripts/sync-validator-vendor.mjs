import {copyFile, mkdir, readdir, readFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const appRoot=dirname(dirname(fileURLToPath(import.meta.url)));
const sourceRoot=resolve(appRoot,'..','e2r-validator','src');
const targetRoot=join(appRoot,'vendor','e2r-validator');
const check=process.argv.includes('--check');
const files=(await readdir(sourceRoot,{withFileTypes:true}))
  .filter(entry=>entry.isFile()&&entry.name.endsWith('.js')&&entry.name!=='cli.js')
  .map(entry=>entry.name).sort();

await mkdir(targetRoot,{recursive:true});
const differences=[];
for(const file of files){
  const source=join(sourceRoot,file),target=join(targetRoot,file);
  let same=false;
  try{same=(await readFile(source)).equals(await readFile(target));}catch{}
  if(same)continue;
  differences.push(file);
  if(!check)await copyFile(source,target);
}
if(check&&differences.length){
  console.error(`Validator browser snapshot differs: ${differences.join(', ')}`);
  process.exitCode=1;
}else if(check){
  console.log(`Validator browser snapshot matches ${files.length} canonical modules.`);
}else{
  console.log(`Synchronized ${differences.length} changed Validator modules (${files.length} total).`);
}
