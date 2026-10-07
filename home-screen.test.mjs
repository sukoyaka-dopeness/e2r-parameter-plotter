import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeMarkup} from './home-screen.js';
import {creditsMarkup, footerMarkup} from './application-shell.js';
import {validateDataset} from './model.js';

test('Home uses the Human-selected start copy and presents primary Dataset acquisition',()=>{
  const html=homeMarkup();
  assert.match(html,/<h1 id="home-title">Get Started<\/h1>/);
  assert.match(html,/<p class="home-intro">Compare E2R Entities across Dimensions\.<\/p>/);
  assert.doesNotMatch(html,/Continue Editing/);
  assert.match(html,/New Dataset[\s\S]*Open E2R Dataset[\s\S]*Open Sample Dataset · The Ashen Crown/);
  assert.doesNotMatch(html,/Choose a workspace|Browser-local recovery keeps work available|Export E2R JSON when you need a portable Dataset file|home-footnote/);
  assert.match(html,/<button data-home-action="open">Open E2R Dataset<\/button>[\s\S]*<div class="sample-action"><button data-home-action="sample">/);
  assert.doesNotMatch(html,/home-panel|class="primary"/);
  assert.match(html,/app-header home-header/);
});

test('Home offers Continue Editing only when caller confirms recoverable local work',()=>{
  const html=homeMarkup({canContinue:true});
  assert.match(html,/<h1 id="home-title">Get Started<\/h1>/);
  assert.match(html,/<p class="home-intro">Compare E2R Entities across Dimensions\.<\/p>/);
  assert.match(html,/Continue Editing[\s\S]*New Dataset/);
  assert.doesNotMatch(html,/Browser-local recovery keeps work available|Export E2R JSON when you need a portable Dataset file|home-footnote/);
});

test('Application shell provides a shared Footer and a bounded Credits dialog',async()=>{
  const footer=footerMarkup(),dialog=creditsMarkup();
  assert.match(footer,/E2R Entity comparison[\s\S]*data-open-credits/);
  assert.match(dialog,/role="dialog" aria-modal="true"/);
  assert.match(dialog,/Application: ParameterPlotter/);
  assert.match(dialog,/Creator: sukoyaka-dopeness/);
  assert.match(dialog,/With gratitude to all the AI systems that contributed to this project\./);
  assert.doesNotMatch(dialog,/working name/);
  assert.doesNotMatch(dialog,/First release|Updated|acknowledg/i);
  assert.doesNotMatch(dialog,/<dl|<dt|<dd/);
  assert.match(dialog,/sukoyaka-dopeness/);
  assert.match(dialog,/data-close-credits/);
  assert.match(dialog,/data-credits-backdrop/);
  assert.match(dialog,/e2r-parameter-plotter/);
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/if\(creditsOpen\)[\s\S]*data-close-credits/);
  assert.match(source,/if\(event.key==='Escape'\)[\s\S]*creditsOpen=false/);
  assert.match(source,/const items=\[\.\.\.root.querySelectorAll\('\.credits-dialog/);
  assert.match(source,/toggleAttribute\('inert',creditsOpen\)|forEach\(element=>element.inert=true\)/);
});

test('Home uses the white application surface while the workspace remains distinct',async()=>{
  const css=await readFile(new URL('./home-screen.css',import.meta.url),'utf8');
  const base=await readFile(new URL('./style.css',import.meta.url),'utf8');
  assert.match(css,/\.home-page\s*\{\s*background:\s*#fff;?\s*\}/);
  assert.match(css,/\.workspace-page\s*\{\s*background:\s*#f5f6f8;?\s*\}/);
  assert.match(base,/:root\{font:18px\/145%/);
  assert.match(css,/\.app-footer\s*\{[^}]*font-size:\s*18px;[^}]*line-height:\s*145%/s);
  assert.match(css,/\.app-footer small\s*\{[^}]*font-size:\s*15px;[^}]*line-height:\s*inherit/s);
  assert.match(css,/\.app-footer \.credits-button,[\s\S]*\.credits-actions button\s*\{[^}]*min-height:\s*36px;[^}]*padding:\s*5px 9px;[^}]*border-radius:\s*4px;[^}]*font-size:\s*15px;[^}]*line-height:\s*120%/);
  assert.match(css,/\.home-actions button\s*\{[^}]*min-height:\s*40px;[^}]*font-size:\s*16px/);
  assert.match(css,/\.credits-dialog\s*\{[^}]*width:\s*min\(100%, 28rem\);[^}]*padding:\s*16px;[^}]*border-radius:\s*6px/);
  assert.match(css,/\.credits-metadata p\s*\{\s*margin:\s*0;?\s*\}/);
  assert.match(css,/@media \(max-width: 600px\)[\s\S]*\.app-footer \.credits-button \{ min-height: 40px; padding: 8px 12px/);
  assert.match(css,/@media \(max-width: 1024px\) \{ :root \{ font-size: 16px; \} \}/);
});

test('bundled Ashen Crown sample remains an unmodified, valid Dataset artifact',async()=>{
  const dataset=JSON.parse(await readFile(new URL('./samples/ashen-crown.en.e2r.json',import.meta.url),'utf8'));
  assert.equal(dataset.extensions.metadata.title,'The Ashen Crown');
  assert.equal(dataset.entities.length,10);
  assert.equal(validateDataset(dataset).valid,true);
});

test('Home entry uses native Dataset file acquisition and a bundled sample path',async()=>{
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/let surface = 'home'/);
  assert.match(source,/fetch\('\.\/samples\/ashen-crown\.en\.e2r\.json'\)/);
  assert.match(source,/data-home-action="\$\{request\.returnFocus\}"/);
  assert.match(source,/data-go-home/);
  assert.match(source,/else if\(action==='open'\)openDatasetFilePicker\(\)/);
});
