import test from 'node:test';
import assert from 'node:assert/strict';
import {requestedLocale, resolveLocale, localeFragment, chooseSavedLocale, readSavedLocale, chooseTemporaryLocale, readTemporaryLocale} from './locale-preference.js';
import {localeControlMarkup} from './locale-shell.js';

function storage(){const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
test('locale startup uses exact requests, saved preference, and browser fallback',()=>{
  assert.deepEqual(resolveLocale({requested:requestedLocale('#locale=ja'),saved:'en'}),{locale:'en',conflict:true});
  assert.deepEqual(resolveLocale({requested:requestedLocale('#locale=ja'),browserLanguage:'en-US'}),{locale:'ja',conflict:false});
  assert.deepEqual(resolveLocale({requested:requestedLocale('#locale=ja&locale=en'),browserLanguage:'ja-JP'}),{locale:'ja',conflict:false});
  assert.equal(requestedLocale('#locale=%E0%A4%A').kind,'invalid');
  assert.deepEqual(resolveLocale({requested:requestedLocale(''),browserLanguage:'en-US'}),{locale:'en',conflict:false});
});
test('temporary resolution is separate from explicit recipient preference',()=>{
  const local=storage(),session=storage();chooseSavedLocale(local,'en',session);
  chooseTemporaryLocale(session,'ja','ja');
  assert.equal(readSavedLocale(local),'en');
  assert.deepEqual(resolveLocale({requested:requestedLocale('#locale=ja'),saved:readSavedLocale(local),temporary:readTemporaryLocale(session)}),{locale:'ja',conflict:false});
  chooseSavedLocale(local,'ja',session);
  assert.equal(readTemporaryLocale(session),null);
});
test('explicit selector replaces only locale fragment',()=>{
  assert.equal(localeFragment('#datasetUrl=https%3A%2F%2Fexample.com%2Fa&locale=en&x=1','ja'),'#datasetUrl=https%3A%2F%2Fexample.com%2Fa&x=1&locale=ja');
});
test('shell offers only the opposite locale',()=>{
  assert.match(localeControlMarkup('en'),/data-select-locale="ja"[^>]*>日本語<\/button>/);
  assert.doesNotMatch(localeControlMarkup('en'),/data-select-locale="en"/);
  assert.match(localeControlMarkup('ja'),/data-select-locale="en"[^>]*>English<\/button>/);
  assert.doesNotMatch(localeControlMarkup('ja'),/data-select-locale="ja"/);
});
