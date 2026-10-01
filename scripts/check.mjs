import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const basePath=(process.env.BASE_PATH || '').replace(/\/+$/, '');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const pages=walk(dist).filter(f=>f.endsWith('.html'));
const errors=[];
for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  if(!html.includes('<html lang="zh-CN">')||!html.includes('<meta name="viewport"'))errors.push(`Missing language or viewport: ${file}`);
  if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(`Expected one primary heading: ${file}`);
  for(const match of html.matchAll(/\b(?:href|src|poster)="([^"]*)"/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(!value||/^(data:|https?:|mailto:)/.test(value))continue;
    const url=new URL(value,'http://local'+basePath+'/'+path.relative(dist,file).replaceAll('\\','/').replace(/index\.html$/,''));
    const pathname=decodeURIComponent(url.pathname);
    if(basePath && !(pathname===basePath || pathname.startsWith(basePath+'/'))){errors.push(`Missing deployment prefix: ${value}`);continue;}
    let target=path.join(dist,pathname.slice(basePath.length));
    if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    if(!fs.existsSync(target)){errors.push(`Missing target ${value} from ${path.relative(dist,file)}`);continue;}
    if(url.hash&&target.endsWith('.html')){
      const targetHtml=fs.readFileSync(target,'utf8');
      if(!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))errors.push(`Missing anchor ${value}`);
    }
  }
}
for(const file of ['assets/site.js','scripts/build.mjs']){
  const r=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});if(r.status!==0)errors.push(r.stderr);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Passed: ${pages.length} pages; internal routes, fragments, local assets, primary headings and JavaScript syntax.`);
