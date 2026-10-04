import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const files=(await readdir(root,{withFileTypes:true}))
  .filter(entry=>entry.isFile()&&entry.name.endsWith('.js'))
  .map(entry=>entry.name)
  .sort();

for(const file of files){
  const result=spawnSync(process.execPath,['--check',join(root,file)],{encoding:'utf8'});
  if(result.status!==0){
    process.stderr.write(result.stderr||result.stdout);
    process.exit(result.status||1);
  }
}

console.log(`Syntax checked ${files.length} application modules.`);
