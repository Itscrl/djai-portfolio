import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function parseCSV(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}if(quoted)throw Error('Unclosed CSV quote');if(cell||row.length){row.push(cell);rows.push(row);}return rows;}
export function build({release=false,mapPath=path.join(root,'media-url-map.csv'),outDir}={}){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'reference/artwork-data.json'),'utf8'));
 const [header,...rows]=parseCSV(fs.readFileSync(mapPath,'utf8').replace(/^\uFEFF/,''));
 if(header?.join(',')!=='filename,public_url')throw Error('Keep CSV header: filename,public_url');
 const urls=new Map;for(const row of rows){if(row.length!==2)throw Error('Each CSV row needs exactly two columns');const[file,url]=row.map(x=>x.trim());if(urls.has(file))throw Error('Duplicate filename: '+file);if(!manifest.some(a=>a.file===file))throw Error('Unknown filename: '+file);if(url){let parsed;try{parsed=new URL(url);}catch{throw Error('Invalid public URL for '+file);}if(parsed.protocol!=='https:'||parsed.username||parsed.password||/[<>"\s]/.test(url))throw Error('Use a public HTTPS image URL for '+file);if(parsed.hostname==='localhost'||parsed.hostname==='127.0.0.1'||parsed.hostname.endsWith('.example'))throw Error('Use real uploaded image URLs for '+file);}urls.set(file,url);}
 if(urls.size!==10)throw Error('CSV must have exactly the ten image filenames');
 const missing=manifest.filter(a=>!urls.get(a.file));if(release&&missing.length)throw Error(`Cannot build release: ${missing.length} image URLs missing. Fill media-url-map.csv first. Existing release files were not changed.`);
 let body=fs.readFileSync(path.join(root,'source/body.html'),'utf8');
 for(const a of manifest){const url=urls.get(a.file);if(url)body=body.replaceAll('images/'+a.file,url.replaceAll('&','&amp;'));}
 const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');const script=fs.readFileSync(path.join(root,'script.js'),'utf8');const head=fs.readFileSync(path.join(root,'source/head.html'),'utf8');
 const target=outDir||path.join(root,'gohighlevel',release?'ready':'preview');fs.mkdirSync(target,{recursive:true});
 const files={'01-HOME-CUSTOM-HTML.html':body,'02-HOME-CUSTOM-CSS.css':css,'03-HOME-HEADER-TRACKING.html':head,'04-HOME-FOOTER-TRACKING.html':`<script>\n${script}\n</script>`};
 for(const[file,content]of Object.entries(files))fs.writeFileSync(path.join(target,file),content);
 const preview=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Djai — GHL wrapper simulation</title>${head}<style>${css}</style></head><body><div class="c-section" style="max-width:900px;margin:auto;padding:40px"><div class="inner"><div class="c-row" style="padding:30px"><div class="c-column"><div class="c-custom-code">${body}</div></div></div></div></div><script>${script}</script></body></html>`;
 // Base href is deliberately local and exists only in the simulation, never paste files.
 fs.writeFileSync(path.join(root,'gohighlevel-simulation.html'),preview.replace('<head>','<head><base href="/">'));
 fs.writeFileSync(path.join(target,'BUILD_STATUS.txt'),`${release?'RELEASE — all ten URL rows supplied. Verify every link opens the correct public image before publishing.':'LOCAL PREVIEW ONLY — do not paste these files into GoHighLevel. Missing image URLs: '+missing.length}\nGenerated ${new Date().toISOString()}\nCopy only 01/02/03/04 into their matching Home fields; see GOHIGHLEVEL_DEPLOYMENT.md.\n`);
 console.log(`${release?'Release':'Preview'} written: ${target}`);return{target,files,missing:missing.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{build({release:process.argv.includes('--release')});}catch(error){console.error(error.message);process.exitCode=1;}
