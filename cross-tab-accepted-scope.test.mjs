import test from 'node:test';
import assert from 'node:assert/strict';
import { homeMarkup, homePeerWorkNotice } from './home-screen.js';
import { workspaceSaveFailureMessage } from './workspace-save-feedback.js';
import { translateUiText } from './ui-localize.js';

test('peer-work refusal renders the accepted Retry and Cancel controls in the Home markup', () => {
  const markup = homeMarkup({
    peerWorkStatus: { kind: 'work' },
    replacementFeedback: { kind: 'peer-work', reason: 'peer work' },
    locale: 'en'
  });
  assert.match(markup, /role="alert"/);
  assert.match(markup, /data-retry-replacement/);
  assert.match(markup, /data-cancel-replacement-feedback/);
  assert.doesNotMatch(markup, /cross-tab-work-warning/);
});

test('active peer-work warning is localized and describes current work', () => {
  const en = homePeerWorkNotice({ kind: 'work' }, 'en');
  const ja = homePeerWorkNotice({ kind: 'work' }, 'ja');
  assert.match(en, /unapplied work/);
  assert.match(en, /Apply or cancel/);
  assert.match(ja, /\u672a\u9069\u7528\u306e\u4f5c\u696d/);
  assert.match(ja, /E2R JSON\u3068\u3057\u3066\u66f8\u304d\u51fa\u3057/);
  assert.doesNotMatch(ja, /Export/);
});

test('current peer refusal removes a duplicate ordinary peer warning from the Home markup', () => {
  const markup = homeMarkup({
    notice: 'Another ParameterPlotter tab has work that needs protection.',
    peerWorkStatus: { kind: 'work' },
    replacementFeedback: { kind: 'peer-work', reason: 'peer work' },
    locale: 'en'
  });
  assert.equal((markup.match(/Another ParameterPlotter tab has work that needs protection/g) || []).length, 1);
  assert.doesNotMatch(markup, /cross-tab-work-warning/);
});

test('latched peer save refusal remains after current peer work clears', () => {
  const markup = homeMarkup({ peerWorkStatus: { kind: 'clear' }, peerWorkSaveStopped: true, locale: 'en' });
  assert.doesNotMatch(markup, /cross-tab-work-warning/);
  assert.match(markup, /previous Workspace save was refused/);
  assert.match(markup, /paused until reload/);
  assert.match(markup, /current Dataset remains in memory/);
});

test('prior peer refusal does not duplicate the ordinary persistence alert', () => {
  const markup = homeMarkup({
    notice: 'A previous Workspace save was refused during cross-tab safety checks.',
    peerWorkStatus: { kind: 'clear' },
    peerWorkSaveStopped: true,
    replacementFeedback: { kind: 'prior-save-refusal', canRetry: false },
    locale: 'en'
  });
  assert.equal((markup.match(/role="alert"/g) || []).length, 1);
  assert.equal((markup.match(/earlier safety refusal/g) || []).length, 1);
  assert.doesNotMatch(markup, /A previous Workspace save was refused during cross-tab safety checks/);
  assert.doesNotMatch(markup, /data-retry-replacement/);
  assert.match(markup, /data-cancel-replacement-feedback/);
});

test('peer-work save refusal wording distinguishes a past cause from active peer work in both locales', () => {
  const refusal = { ok: false, blockedByPeer: true, reason: 'peer work at refusal' };
  const currentEn = workspaceSaveFailureMessage(refusal, '', 'en');
  const priorEn = workspaceSaveFailureMessage(refusal, '', 'en', { priorRefusal: true });
  const priorJa = workspaceSaveFailureMessage(refusal, '', 'ja', { priorRefusal: true });
  assert.match(currentEn, /Another ParameterPlotter tab has work that needs protection/);
  assert.match(priorEn, /when the earlier save was refused/);
  assert.doesNotMatch(priorEn, /another ParameterPlotter tab has work/);
  assert.match(priorJa, /\u524d\u56de\u306e\u4fdd\u5b58\u6642\u306b/);
  assert.doesNotMatch(priorJa, /別のタブに作業があります/);
});

test('cross-tab peer-work translations use the accepted Japanese wording', () => {
  const source = 'Another ParameterPlotter tab has work that needs protection. Apply or cancel its open input, and export any Dataset changes you need to keep before opening a replacement Dataset.';
  const translated = translateUiText(source);
  assert.match(translated, /\u672a\u9069\u7528\u306e\u4f5c\u696d/);
  assert.match(translated, /E2R JSON\u3068\u3057\u3066\u66f8\u304d\u51fa\u3057/);
  assert.doesNotMatch(translated, /Export/);
});
