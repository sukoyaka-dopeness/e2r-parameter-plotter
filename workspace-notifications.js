// Presentation only: a successful Dataset operation does not imply a save or download.
const successes = new Map([
  ['Dataset title applied. E2R JSON Export is a separate step.', ['Title applied.', 'タイトルを適用しました。']],
  ['Dataset Entity change applied. It is part of the Dataset and is not exported until E2R JSON Export.', ['Entity changes applied.', 'Entityの変更を適用しました。']],
  ['Dimension change applied to the Dataset. E2R JSON Export is a separate step.', ['Dimension changes applied.', 'Dimensionの変更を適用しました。']],
  ['Dimension and its dependent Assessments were removed in one Dataset change.', ['Dimension removed.', 'Dimensionを削除しました。']],
  ['Dimension Assessment upgraded to Candidate 0.2.0. Existing Dataset values were preserved.', ['Dimension Assessment upgraded.', 'Dimension Assessmentを更新しました。']],
]);

export function workspaceNotificationPresentation({persistence, lifecycleNotice='', locale='en'}) {
  const success = successes.get(lifecycleNotice);
  return {
    showPersistenceWarning: persistence?.status === 'degraded',
    operation: success ? success[locale === 'ja' ? 1 : 0] : '',
    notice: success ? '' : lifecycleNotice,
    // Export guidance is informative, but must remain visible until the next action.
    noticeRole: lifecycleNotice.startsWith('The browser was asked to download the E2R JSON.') || lifecycleNotice.startsWith('E2R JSONのダウンロードをブラウザーに依頼しました。') ? 'status' : 'alert',
  };
}
