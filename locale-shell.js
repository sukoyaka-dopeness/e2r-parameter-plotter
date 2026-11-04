export function localeControlMarkup(locale) {
  return `<div class="locale-control"><button type="button" data-select-locale="${locale==='ja'?'en':'ja'}" aria-label="${locale==='ja'?'Switch to English':'日本語に切り替える'}">${locale==='ja'?'English':'日本語'}</button></div>`;
}
export function localeConflictMarkup(locale,requested) {
  return `<div class="confirm-scrim locale-conflict-scrim" data-locale-backdrop><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="locale-conflict-title" aria-describedby="locale-conflict-detail"><h2 id="locale-conflict-title"><span lang="en">Which language would you like to use?</span><span lang="ja">どちらの言語で表示しますか？</span></h2><p id="locale-conflict-detail" class="locale-conflict-help"><span lang="en">Your choice applies to this visit only. Your saved language will not change.</span><span lang="ja">この選択は今回の表示にのみ適用されます。保存済みの言語は変更されません。</span></p><div class="actions">${['en','ja'].map(language=>`<button type="button" lang="${language}" data-resolve-locale="${language===requested&&language!==locale?'requested':'saved'}">${language==='en'?'English':'日本語'}</button>`).join('')}</div></section></div>`;
}
