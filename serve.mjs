import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
const base=dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  const file=path==='/'?'index.html':path.slice(1);
  if(!/^[\w.-]+$/.test(file)){res.writeHead(404).end();return;}
  try { const body=await readFile(join(base,file));res.writeHead(200,{'Content-Type':types[file.slice(file.lastIndexOf('.'))]||'application/octet-stream','Cache-Control':'no-store'}).end(body); }
  catch {res.writeHead(404).end();}
}).listen(4180,'127.0.0.1',()=>console.log('ParameterPlotter (working name): http://localhost:4180'));
