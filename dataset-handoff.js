const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

function fragmentParameters(hash) {
  return new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
}

function isLoopbackHost(hostname) {
  return loopbackHosts.has(hostname.toLowerCase());
}

function validateDatasetUrl(value, allowLocalhost) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return { kind: 'invalid', reason: 'invalid-url' };
  }

  if (url.username || url.password) return { kind: 'invalid', reason: 'embedded-credentials' };
  if (url.protocol !== 'https:' && !(allowLocalhost && url.protocol === 'http:' && isLoopbackHost(url.hostname))) {
    return { kind: 'invalid', reason: 'unsupported-scheme' };
  }

  return { kind: 'valid', datasetUrl: url.href };
}

export function parseDatasetHandoffFragment(hash, { allowLocalhost = false } = {}) {
  const values = fragmentParameters(hash).getAll('datasetUrl');
  if (values.length === 0) return { kind: 'none' };
  if (values.length > 1) return { kind: 'invalid', reason: 'duplicate-dataset-url' };
  if (values[0] === '') return { kind: 'invalid', reason: 'empty-dataset-url' };
  return validateDatasetUrl(values[0], allowLocalhost);
}

export function parseHandoffJson(source) {
  try { return { ok: true, dataset: JSON.parse(source) }; }
  catch { return { ok: false, reason: 'invalid-json' }; }
}

export async function fetchDatasetHandoff(datasetUrl, { fetcher = fetch, signal, allowLocalhost = false } = {}) {
  try {
    const response = await fetcher(datasetUrl, { credentials: 'omit', signal });
    if (!response.ok) return { ok: false, reason: 'fetch-failed' };
    if (response.url) {
      const finalUrl = validateDatasetUrl(response.url, allowLocalhost);
      if (finalUrl.kind !== 'valid') return { ok: false, reason: 'fetch-failed' };
    }
    return { ok: true, source: await response.text() };
  } catch (error) {
    return { ok: false, reason: signal?.aborted ? 'aborted' : 'fetch-failed' };
  }
}

export function removeDatasetUrlFromHash(hash) {
  if (!hash.startsWith('#')) return hash;
  const kept = [];
  let removed = false;
  for (const segment of hash.slice(1).split('&')) {
    const separator = segment.indexOf('=');
    const rawName = separator < 0 ? segment : segment.slice(0, separator);
    let name;
    try {
      name = decodeURIComponent(rawName.replace(/\+/g, ' '));
    } catch {
      kept.push(segment);
      continue;
    }
    if (name === 'datasetUrl') removed = true;
    else if (segment) kept.push(segment);
  }
  if (!removed) return hash;
  return kept.length ? `#${kept.join('&')}` : '';
}

export { isLoopbackHost };
