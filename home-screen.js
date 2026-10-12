const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function homePeerWorkNotice(status, locale='en') {
  if(status?.kind==='work')return locale==='ja'
    ? '別のParameterPlotterタブに未適用の作業があります。置換を再試行する前に、そのタブの入力を適用または取り消してください。残したいDatasetの変更は、そのタブからE2R JSONとして書き出してください。'
    : 'Another ParameterPlotter tab has unapplied work. Apply or cancel its open input before retrying replacement. Export any Dataset changes you need to keep from that tab.';
  if(status?.kind==='unknown')return locale==='ja'
    ? '他のParameterPlotterタブの作業状態を安全に確認できませんでした。保護が必要な作業があるとは断定できません。安全確認ができるまでDatasetの置換は進みません。'
    : 'The work state of other ParameterPlotter tabs could not be checked safely. This does not confirm that another tab has work needing protection. Dataset replacement will remain guarded until safety can be verified.';
  return '';
}

export function homeMarkup({canContinue=false,notice='',sampleError='',handoffStatus='',handoffError='',peerWorkStatus=null,peerWorkSaveStopped=false,replacementFeedback=null,locale='en'}={}) {
  const peerNotice=replacementFeedback?.kind==='peer-work'?'':homePeerWorkNotice(peerWorkStatus,locale);
  const ja=locale==='ja';
  const duplicatePersistenceNotice=(replacementFeedback?.kind==='peer-work'&&peerWorkStatus?.kind==='work')||(replacementFeedback?.kind==='prior-save-refusal'&&peerWorkSaveStopped);
  const persistenceNotice=duplicatePersistenceNotice?'':peerWorkSaveStopped
    ? ja?'前回のWorkspace保存はクロスタブの安全確認で拒否され、このタブからの保存は再読み込みまで停止しています。現在のDatasetはこのタブのメモリに保持され、保存済みWorkspaceは置き換わっていません。このタブに残したい変更をE2R JSONとして書き出し、ダウンロードを確認してください。':'A previous Workspace save was refused during cross-tab safety checks, so saving from this tab remains paused until reload. Its current Dataset remains in memory, and the saved Workspace was not replaced. Export any changes you need to keep from this tab and verify the download.'
    :notice;
  const feedbackCopy=replacementFeedback?.kind==='peer-work'
    ? ja?'別のParameterPlotterタブに保護が必要な作業があるため、Datasetの置換を拒否しました。保存済みWorkspaceは変更されていません。別タブの入力を適用または取り消し、必要なDatasetの変更をE2R JSONとして書き出してから再試行してください。':'Another ParameterPlotter tab has work that needs protection. This replacement was refused and the saved workspace was not changed. Apply or cancel that tab’s open input, and export any Dataset changes you need to keep before retrying.'
    :replacementFeedback?.kind==='prior-save-refusal' && peerWorkSaveStopped
      ? ja?'前回の安全上の拒否により、このタブからのWorkspace保存は停止中です。必要なDatasetをE2R JSONとして書き出してダウンロードを確認し、再読み込みして保存済みWorkspaceを開いてください。':'Workspace saving in this tab remains paused after an earlier safety refusal. Export any Dataset work you need as E2R JSON and check the download, then reload and open the saved Workspace.'
    :replacementFeedback?.kind==='prior-save-refusal'
      ? ja?'以前のWorkspace保存が安全確認で拒否されたため、このタブからの保存はReloadまで停止しています。必要なDatasetをE2R JSONとしてExportし、ダウンロードを確認してからReloadし、保存済みWorkspaceを開いてください。':'Workspace saving in this tab remains paused after an earlier safety refusal. Export any Dataset work you need as E2R JSON and check the download, then reload and open the saved Workspace.'
    :replacementFeedback?.kind==='stale-revision'
      ? ja?'別のタブで保存済みWorkspaceが更新されたため、置換を停止しました。このタブの変更はメモリに保持されています。残したい作業をE2R JSONへExportし、ダウンロードを確認してから、このタブを再読み込みし、「Continue Editing」を選んで最新の保存状態を開いてください。':'Another tab changed the saved workspace revision, so replacement stopped. Your current changes remain in memory. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.'
      :replacementFeedback?.kind==='write-unverified'
        ? ja?'Workspaceへの書き込み後、その保存状態を安全に確認できませんでした。状態を推測せず、このタブを再読み込みして確認してください。':'A workspace write may have occurred, but its saved state could not be verified. Do not assume either Dataset is current; reload this tab to inspect the saved state.'
        :ja?'クロスタブの安全性を確認できなかったため、置換は実行されませんでした。安全性を確認できてから再試行するか、この候補を取り消してください。':'Cross-tab safety could not be verified, so replacement was not accepted. Retry after safety can be checked, or cancel this candidate.';
  const feedbackTitle=ja?'Datasetの置換は完了しませんでした':'Dataset replacement was not completed';
  const detailsLabel=ja?'詳細':'Details';
  const retryLabel=replacementFeedback?.checking?(ja?'安全確認中…':'Checking workspace safety...'):(ja?'置換を再試行':'Retry replacement');
  const cancelLabel=(replacementFeedback?.kind==='write-unverified'||replacementFeedback?.kind==='stale-revision'||replacementFeedback?.kind==='prior-save-refusal')?(ja?'通知を閉じる':'Close notice'):(ja?'置換を取り消す':'Cancel replacement');
  const showFeedbackReason=replacementFeedback?.reason&&!['peer-work','stale-revision'].includes(replacementFeedback.kind);
  const feedback=replacementFeedback?`<section class="home-notice home-replacement-feedback" role="${replacementFeedback.checking?'status':'alert'}" aria-live="polite"><h2>${feedbackTitle}</h2><p>${escapeHtml(feedbackCopy)}</p>${showFeedbackReason?`<p class="replacement-feedback-reason"><strong>${detailsLabel}:</strong> ${escapeHtml(replacementFeedback.reason)}</p>`:''}<div class="home-replacement-feedback-actions">${replacementFeedback.canRetry===false?'':`<button data-retry-replacement ${replacementFeedback.checking?'disabled':''}>${retryLabel}</button>`}<button data-cancel-replacement-feedback>${cancelLabel}</button></div></section>` : '';
  return `<header class="app-header home-header"><a class="app-brand" href="#home">ParameterPlotter</a></header>
  <main class="home-main" aria-labelledby="home-title">
    <h1 id="home-title">Get Started</h1>
    <p class="home-intro">Compare E2R Entities across Dimensions.</p>
    ${feedback}
    ${peerNotice?`<p class="home-notice cross-tab-work-warning${peerWorkStatus?.kind==='unknown'?' is-uncertain':''}" role="status" aria-live="polite">${escapeHtml(peerNotice)}</p>`:''}
    ${persistenceNotice?`<p class="home-notice" role="alert">${escapeHtml(persistenceNotice)}</p>`:''}
    ${sampleError?`<p class="home-notice" role="alert">${escapeHtml(sampleError)}</p>`:''}
    ${handoffStatus?`<p class="home-notice" role="status">${escapeHtml(handoffStatus)}</p>`:''}
    ${handoffError?`<p class="home-notice" role="alert">${escapeHtml(handoffError)}</p>`:''}
    <div class="home-actions">
      ${canContinue?'<button data-home-action="continue">Continue Editing</button>':''}
      <button data-home-action="new">New Dataset</button>
      <button data-home-action="open">Open E2R Dataset</button>
      <div class="sample-action"><button data-home-action="sample">Open Sample Dataset · The Ashen Crown</button></div>
    </div>
    <input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden>
  </main>`;
}
