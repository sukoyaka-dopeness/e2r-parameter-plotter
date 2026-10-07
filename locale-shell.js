export function localeControlMarkup(locale) {
  return `<div class="locale-control"><button type="button" data-select-locale="${locale==='ja'?'en':'ja'}" aria-label="${locale==='ja'?'Switch to English':'日本語に切り替える'}">${locale==='ja'?'English':'日本語'}</button></div>`;
}
export function localeConflictMarkup(locale,requested) {
  const ja=locale==='ja';
  return `<div class="confirm-scrim locale-conflict-scrim" data-locale-backdrop><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="locale-conflict-title" aria-describedby="locale-conflict-detail"><h2 id="locale-conflict-title">${ja?'リンクで指定された言語を使いますか？':'Use the language requested by this link?'}</h2><p id="locale-conflict-detail">${ja?'このリンクは、保存済みの表示言語とは異なる言語を指定しています。':'This link requests a different display language from your saved preference.'}</p><div class="actions"><button data-resolve-locale="saved">${ja?'保存済みの言語を使う':'Use saved language'}</button><button data-resolve-locale="requested">${ja?'リンクで指定された言語を使う':'Use language requested by link'}</button></div></section></div>`;
}
