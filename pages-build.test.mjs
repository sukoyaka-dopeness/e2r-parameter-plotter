import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, readdir, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

test('Pages build emits a relative-path app, imports, and both bundled samples', async () => {
  const root = fileURLToPath(new URL('.', import.meta.url));
  const temp = await mkdtemp(join(tmpdir(), 'parameterplotter-pages-test-'));
  try {
    const output = join(temp, 'dist');
    const result = spawnSync(process.execPath, ['scripts/build-pages.mjs'], {
      cwd: root,
      env: {...process.env, PARAMETER_PLOTTER_BUILD_OUTPUT: output},
      encoding: 'utf8'
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const files = await readdir(output);
    assert.ok(files.includes('index.html'));
    assert.ok(files.includes('.nojekyll'));
    const html = await readFile(join(output, 'index.html'), 'utf8');
    assert.match(html, /href="favicon\.svg"/);
    assert.match(html, /src="main\.js"/);
    assert.equal(await readFile(join(output, 'samples', 'ashen-crown.en.e2r.json'), 'utf8'),
      await readFile(new URL('./samples/ashen-crown.en.e2r.json', import.meta.url), 'utf8'));
    assert.equal(await readFile(join(output, 'samples', 'ashen-crown.ja.e2r.json'), 'utf8'),
      await readFile(new URL('./samples/ashen-crown.ja.e2r.json', import.meta.url), 'utf8'));
    assert.ok((await readFile(join(output, 'main.js'), 'utf8')).includes("from './model.js'"));
  } finally {
    await rm(temp, {recursive: true, force: true});
  }
});
