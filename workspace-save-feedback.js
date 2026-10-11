export function workspaceSaveFailureMessage(result, currentMessage = '', locale = 'en') {
  if (result?.conflict && currentMessage) return currentMessage;
  if (result?.blockedByPeer) {
    return locale === 'ja'
      ? '別のParameterPlotterタブに保護が必要な作業があります。このタブからの保存は停止しました。現在のDatasetはメモリに保持され、保存済みWorkspaceは置き換えられていません。別タブの入力を適用または取り消し、残したいDatasetの変更をExportしてから再試行してください。'
      : 'Another ParameterPlotter tab has work that needs protection. This tab’s save was stopped. Your current Dataset remains in memory, and the saved workspace was not replaced. Apply or cancel open input in the other tab, and export any Dataset changes you need to keep before retrying.';
  }
  return result?.reason || currentMessage || (locale === 'ja'
    ? 'クロスタブの安全性を確認できなかったため保存を停止しました。変更はメモリに保持されています。'
    : 'Workspace save was stopped because cross-tab safety could not be verified. This tab kept its changes in memory.');
}
