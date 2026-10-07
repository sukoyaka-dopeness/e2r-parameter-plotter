export const LOCALE_KEY = 'parameterplotter.locale';
export const TEMPORARY_LOCALE_KEY = 'parameterplotter.localeTemporaryResolution';
const isLocale = value => value === 'en' || value === 'ja';
const decode = value => { try { return decodeURIComponent(value.replace(/\+/g, ' ')); } catch { return null; } };

export function requestedLocale(hash) {
  const values = []; let malformed = false;
  for (const pair of (hash.startsWith('#') ? hash.slice(1) : hash).split('&')) {
    if (!pair) continue;
    const at = pair.indexOf('=');
    if (decode(at < 0 ? pair : pair.slice(0, at)) !== 'locale') continue;
    const value = decode(at < 0 ? '' : pair.slice(at + 1));
    if (value === null) malformed = true; else values.push(value);
  }
  return malformed || values.length > 1 || values.length === 1 && !isLocale(values[0])
    ? {kind:'invalid'} : values.length ? {kind:'valid', locale:values[0]} : {kind:'none'};
}

export function readSavedLocale(storage) {
  try { const value = storage.getItem(LOCALE_KEY); return isLocale(value) ? value : null; }
  catch { return null; }
}
export function readTemporaryLocale(storage) {
  try { const value = JSON.parse(storage.getItem(TEMPORARY_LOCALE_KEY));
    return isLocale(value?.requestedLocale) && isLocale(value?.effectiveLocale) ? value : null;
  } catch { return null; }
}
export function resolveLocale({requested,saved,temporary,browserLanguage}) {
  if (requested.kind === 'valid') {
    if (temporary?.requestedLocale === requested.locale) return {locale:temporary.effectiveLocale, conflict:false};
    if (saved && saved !== requested.locale) return {locale:saved, conflict:true};
    return {locale:requested.locale, conflict:false};
  }
  return {locale:saved || (browserLanguage?.toLowerCase().startsWith('ja') ? 'ja' : 'en'), conflict:false};
}
export function chooseTemporaryLocale(storage, requested, effective) {
  try { storage.setItem(TEMPORARY_LOCALE_KEY,JSON.stringify({requestedLocale:requested,effectiveLocale:effective})); } catch {}
}
export function chooseSavedLocale(storage, locale, sessionStorage) {
  try { storage.setItem(LOCALE_KEY,locale); } catch {}
  try { sessionStorage.removeItem(TEMPORARY_LOCALE_KEY); } catch {}
}
export function localeFragment(hash,locale) {
  const kept=(hash.startsWith('#')?hash.slice(1):hash).split('&').filter(pair=>{
    if (!pair) return false;
    const at=pair.indexOf('=');return decode(at<0?pair:pair.slice(0,at)) !== 'locale';
  });
  return '#'+[...kept,`locale=${locale}`].join('&');
}
