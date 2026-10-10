import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('Workspace More keeps native disclosure and actions while using text-row presentation',async()=>{
  const [menu,baseCss,shellCss]=await Promise.all([
    readFile(new URL('./workspace-actions-menu.js',import.meta.url),'utf8'),
    readFile(new URL('./first-slice.css',import.meta.url),'utf8'),
    readFile(new URL('./home-screen.css',import.meta.url),'utf8'),
  ]);
  assert.match(menu,/<details class="workspace-more">[\s\S]*<summary[^>]*>More<\/summary>/);
  assert.match(menu,/data-import-trigger[\s\S]*data-successor-export-dataset/);
  assert.match(baseCss,/\.workspace-more-panel\s*\{[^}]*gap:\s*2px;[^}]*padding:\s*4px;/);
  assert.match(baseCss,/\.workspace-more-item\s*\{[^}]*min-height:\s*36px;[^}]*padding:\s*5px 9px;[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*font:\s*inherit;[^}]*font-size:\s*15px;[^}]*line-height:\s*120%;[^}]*text-align:\s*start;/);
  assert.match(shellCss,/\.workspace-action-bar \.workspace-more-panel\{[^}]*min-width:12rem;[^}]*max-width:calc\(100vw - 2rem\)/);
});

test('Quadrant point activation and pointer selection restore point focus without changing drag handling',async()=>{
  const [main,drag]=await Promise.all([
    readFile(new URL('./main.js',import.meta.url),'utf8'),
    readFile(new URL('./quadrant-drag.js',import.meta.url),'utf8'),
  ]);
  assert.match(main,/quadrantPointSelectionFromClick\(e\)/);
  assert.match(main,/s\.selected=keyboardPointId;update\(\);root\.querySelector\(`\[data-point="\$\{CSS\.escape\(keyboardPointId\)\}"\]`\)\?\.focus\(\{preventScroll:true\}\);restoreDocumentScroll\(scrollSnapshot\)/);
  assert.match(main,/onSelect:\(\)=>\{const pageScroll=captureDocumentScroll\(document\);quadrantKeyboardEntity=null;s\.selected=id;update\(\);root\.querySelector\(`\[data-point="\$\{CSS\.escape\(id\)\}"\]`\)\?\.focus\(\{preventScroll:true\}\);restoreDocumentScroll\(pageScroll\);\}/);
  assert.match(drag,/else if\(moved\)onPlace\(e\);\s*else onSelect\(\)/);
  assert.doesNotMatch(main,/data-point[^\n]*data-view|data-point[^\n]*data-context-action/);
});
