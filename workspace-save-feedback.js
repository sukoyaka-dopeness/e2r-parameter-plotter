export function workspaceSaveFailureMessage(result, currentMessage = '', locale = 'en') {
  if (result?.conflict && currentMessage) return currentMessage;
  if (result?.blockedByPeer) {
    return locale === 'ja'
      ? '別のParameterPlotterタブに未適用の作業があります。このタブの変更はメモリに保持され、保存済みWorkspaceは変更されていません。別タブの作業を解決してから続けてください。'
      : 'Another ParameterPlotter tab has unapplied work. This tab kept its changes in memory; the saved workspace was not replaced. Resolve the other tab’s work before continuing.';
  }
  return result?.reason || currentMessage || (locale === 'ja'
    ? 'クロスタブの安全性を確認できなかったため保存を停止しました。変更はメモリに保持されています。'
    : 'Workspace save was stopped because cross-tab safety could not be verified. This tab kept its changes in memory.');
}
