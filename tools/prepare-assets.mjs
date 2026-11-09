import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const body=fs.readFileSync(path.join(root,'source/body.html'),'utf8'),head=fs.readFileSync(path.join(root,'source/head.html'),'utf8');
const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Djai — Art for a more colourful everyday</title><meta name="description" content="Explore paintings, murals, wearable art and art objects by Djai, a visual artist from Albay, Philippines. Connect about your next art project.">'+head+'<link rel="stylesheet" href="styles.css"></head><body>'+body+'<script src="script.js"></script></body></html>';
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Rebuilt local index.html. This tool uses only files inside this final folder.');
