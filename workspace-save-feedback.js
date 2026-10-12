export function workspaceSaveFailureMessage(result, currentMessage = '', locale = 'en', {priorRefusal=false} = {}) {
  if (priorRefusal && result?.blockedByPeer) return locale === 'ja'
    ? '前回の保存時に別のParameterPlotterタブに保護が必要な作業があったため、このタブからの保存は再読み込みまで停止しています。現在のDatasetはこのタブのメモリに保持され、保存済みWorkspaceは置き換わっていません。必要なDatasetをE2R JSONとして書き出し、ダウンロードを確認してから、このタブを再読み込みして保存済みWorkspaceを開いてください。'
    : 'Saving from this tab remains paused until reload because another ParameterPlotter tab had work that needed protection when the earlier save was refused. This tab’s current Dataset remains in memory, and the saved workspace was not replaced. Export any Dataset work you need as E2R JSON, verify the download, then reload this tab and open the saved Workspace.';
  if (priorRefusal) return locale === 'ja'
    ? '以前のWorkspace保存が安全確認で拒否されたため、このタブからの保存はReloadまで停止しています。必要なDatasetをE2R JSONとしてExportし、ダウンロードを確認してからReloadし、保存済みWorkspaceを開いてください。'
    : 'A previous Workspace save was refused for safety, so saving from this tab is paused until reload. Export any Dataset work you need as E2R JSON and check that the download completed, then reload and open the saved Workspace.';
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
