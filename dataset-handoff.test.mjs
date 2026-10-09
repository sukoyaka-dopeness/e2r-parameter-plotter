import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fetchDatasetHandoff, isLoopbackHost, parseDatasetHandoffFragment, parseHandoffJson, removeDatasetUrlFromHash} from './dataset-handoff.js';
import {homeMarkup} from './home-screen.js';
import {replacementMarkup} from './replacement-safety.js';

test('Dataset Handoff parser distinguishes absent, valid, and malformed instructions', () => {
  assert.deepEqual(parseDatasetHandoffFragment('#locale=ja'), {kind: 'none'});
  assert.deepEqual(parseDatasetHandoffFragment('#datasetUrl=https%3A%2F%2Fexample.test%2Fa.json&locale=ja'), {
    kind: 'valid', datasetUrl: 'https://example.test/a.json',
  });
  for (const hash of [
    '#datasetUrl=',
    '#datasetUrl=https%3A%2F%2Fexample.test%2Fa&datasetUrl=https%3A%2F%2Fexample.test%2Fb',
    '#datasetUrl=%2Frelative.json',
    '#datasetUrl=http%3A%2F%2Fexample.test%2Fa.json',
    '#datasetUrl=javascript%3Aalert(1)',
    '#datasetUrl=https%3A%2F%2Fuser%3Asecret%40example.test%2Fa.json',
  ]) assert.equal(parseDatasetHandoffFragment(hash).kind, 'invalid', hash);
});

test('plain HTTP loopback Dataset URLs are development-only', () => {
  assert.equal(isLoopbackHost('localhost'), true);
  assert.equal(isLoopbackHost('127.0.0.1'), true);
  assert.equal(isLoopbackHost('[::1]'), true);
  assert.equal(isLoopbackHost('localhost.attacker.test'), false);
  assert.equal(parseDatasetHandoffFragment('#datasetUrl=http%3A%2F%2Flocalhost%3A4186%2Fsample.json').kind, 'invalid');
  assert.equal(parseDatasetHandoffFragment('#datasetUrl=http%3A%2F%2Flocalhost%3A4186%2Fsample.json', {allowLocalhost: true}).kind, 'valid');
  assert.equal(parseDatasetHandoffFragment('#datasetUrl=http%3A%2F%2Fexample.test%2Fsample.json', {allowLocalhost: true}).kind, 'invalid');
});

test('Handoff fetch omits credentials and returns the response body', async () => {
  let request;
  const result = await fetchDatasetHandoff('https://example.test/sample.json', {
    fetcher: async (url, options) => {
      request = {url, options};
      return {ok: true, url: 'https://example.test/sample.json', text: async () => '{"version":"1.0"}'};
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.source, '{"version":"1.0"}');
  assert.equal(request.url, 'https://example.test/sample.json');
  assert.equal(request.options.credentials, 'omit');
});

test('Handoff fetch reports HTTP, network, redirect-target, and abort failures', async () => {
  assert.deepEqual(await fetchDatasetHandoff('https://example.test/missing', {
    fetcher: async () => ({ok: false, status: 404}),
  }), {ok: false, reason: 'fetch-failed'});
  assert.deepEqual(await fetchDatasetHandoff('https://example.test/offline', {
    fetcher: async () => { throw new Error('offline'); },
  }), {ok: false, reason: 'fetch-failed'});
  assert.deepEqual(await fetchDatasetHandoff('https://example.test/redirect', {
    fetcher: async () => ({ok: true, url: 'http://example.test/downgrade', text: async () => '{}'}),
  }), {ok: false, reason: 'fetch-failed'});
  const controller = new AbortController();
  controller.abort();
  assert.deepEqual(await fetchDatasetHandoff('https://example.test/cancel', {
    signal: controller.signal,
    fetcher: async () => { throw new Error('aborted'); },
  }), {ok: false, reason: 'aborted'});
});

test('removing a consumed or replaced Handoff preserves locale and unrelated fragment segments', () => {
  assert.equal(removeDatasetUrlFromHash('#datasetUrl=https%3A%2F%2Fexample.test%2Fa&locale=ja&x=%2F'), '#locale=ja&x=%2F');
  assert.equal(removeDatasetUrlFromHash('#locale=en'), '#locale=en');
  assert.equal(removeDatasetUrlFromHash(''), '');
});

test('Handoff JSON parsing rejects malformed JSON without fabricating data', () => {
  assert.deepEqual(parseHandoffJson('{"version":"1.0"}'), {ok: true, dataset: {version: '1.0'}});
  assert.deepEqual(parseHandoffJson('{'), {ok: false, reason: 'invalid-json'});
});

test('Handoff loading and replacement reuse the existing Home and loss-confirmation surfaces', async () => {
  const home=homeMarkup({handoffStatus:'Retrieving the linked Dataset…',handoffError:'Could not retrieve the Dataset from this handoff link.'});
  assert.match(home,/role="status"/);
  assert.match(home,/role="alert"/);
  const replacement=replacementMarkup({kind:'handoff-dataset',datasetTitle:'Cedar Observatory: An Open Night'});
  assert.match(replacement,/Open linked Dataset\?/);
  assert.match(replacement,/Cedar Observatory: An Open Night/);
  assert.match(replacement,/data-cancel-replacement/);
  assert.match(replacement,/data-confirm-replacement/);
  const source=await readFile(new URL('./main.js',import.meta.url),'utf8');
  assert.match(source,/if\(!localeConflict\)void startStartupHandoff\(\)/);
  assert.match(source,/receiveDataset\('handoff-dataset',parsed\.dataset\)/);
  assert.match(source,/request\.kind!=='handoff-dataset'\)clearDatasetHandoffFragment\(\)/);
  assert.match(source,/function clearDatasetHandoffFragment\(\)/);
  assert.match(source,/hasLossSensitiveWork\(s\)\)startReplacement\(kind,incoming\)/);
});
