const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function homePeerWorkNotice(status, locale='en') {
  if(status?.kind==='checking')return locale==='ja'
    ? '別のParameterPlotterタブの作業状態を確認しています。確認が終わるまでDatasetの取得・置換はできません。'
    : 'Checking whether another ParameterPlotter tab has work to protect. Dataset acquisition and replacement are unavailable until the safety check finishes.';
  if(status?.kind==='work')return locale==='ja'
    ? '別のParameterPlotterタブに未適用の作業があります。置換を再試行する前に、そのタブの入力を適用または取り消してください。残したいDatasetの変更は、そのタブからE2R JSONとして書き出してください。'
    : 'Another ParameterPlotter tab has unapplied work. Apply or cancel its open input before retrying replacement. Export any Dataset changes you need to keep from that tab.';
  if(status?.kind==='unknown')return locale==='ja'
    ? '別のParameterPlotterタブの作業状態を安全に確認できませんでした。別タブに保護が必要な作業があると確認されたわけではありません。安全を確認できるまでDatasetの置換を停止します。「他のタブを再確認」からもう一度確認できます。'
    : 'The work state of other ParameterPlotter tabs could not be checked safely. This does not confirm that another tab has work needing protection. Dataset replacement will remain guarded until safety can be verified. Choose Check other tabs again to retry the check.';
  return '';
}

export function homePeerWorkPresentation({peerWorkStatus={kind:'checking'},replacementFeedback=null,locale='en'}={}){
  const safePeerStatus=['clear','work','checking','unknown'].includes(peerWorkStatus?.kind)?peerWorkStatus:{kind:'unknown'};
  const acquisitionUnavailable=safePeerStatus.kind!=='clear';
  const peerNotice=safePeerStatus.kind==='checking'||(replacementFeedback?.kind==='peer-work'&&safePeerStatus.kind==='work')?'':homePeerWorkNotice(safePeerStatus,locale);
  const checkingNotice=safePeerStatus.kind==='checking'?homePeerWorkNotice(safePeerStatus,locale):'';
  const ja=locale==='ja';
  const recheckButton=['work','unknown'].includes(safePeerStatus.kind)?`<button class="home-peer-work-recheck" data-home-action="recheck-peer-work">${ja?'他のタブを再確認':'Check other tabs again'}</button>`:'';
  const checkingMarkup=checkingNotice?`<p id="home-acquisition-status" class="home-peer-work-checking-visually-hidden" role="status" aria-live="polite">${escapeHtml(checkingNotice)}</p>`:'';
  const html=`${peerNotice?`<p${acquisitionUnavailable?` id="home-acquisition-status"`:''} class="home-notice cross-tab-work-warning${safePeerStatus.kind==='unknown'?' is-uncertain':''}" role="status" aria-live="polite">${escapeHtml(peerNotice)}</p>`:''}${checkingMarkup}${recheckButton}`;
  return {html,acquisitionUnavailable,feedbackStatusId:acquisitionUnavailable&&!peerNotice&&!checkingNotice&&replacementFeedback?.kind==='peer-work'};
}

export function updateHomePeerWorkStatus(root,options={}){
  const presentation=homePeerWorkPresentation(options);
  const statusRegion=root.querySelector('[data-home-peer-status]');
  if(statusRegion)statusRegion.innerHTML=presentation.html;
  for(const action of ['new','open','sample']){
    const button=root.querySelector(`[data-home-action="${action}"]`);
    if(!button)continue;
    if(presentation.acquisitionUnavailable){button.setAttribute('aria-disabled','true');button.setAttribute('aria-describedby','home-acquisition-status');}
    else{button.removeAttribute('aria-disabled');button.removeAttribute('aria-describedby');}
  }
  const feedbackCopy=root.querySelector('[data-home-peer-feedback-copy]');
  if(feedbackCopy){if(presentation.feedbackStatusId)feedbackCopy.setAttribute('id','home-acquisition-status');else feedbackCopy.removeAttribute('id');}
}

export function homeAcquisitionBlocked(action,peerStatus){
  return ['new','open','sample'].includes(action)&&peerStatus!=='clear';
}

export function homeMarkup({canContinue=false,canReturnToWorkspace=false,notice='',sampleError='',handoffStatus='',handoffError='',peerWorkStatus={kind:'checking'},peerWorkSaveStopped=false,replacementFeedback=null,locale='en'}={}) {
  const peerPresentation=homePeerWorkPresentation({peerWorkStatus,replacementFeedback,locale});
  const acquisitionUnavailable=peerPresentation.acquisitionUnavailable;
  const acquisitionAttrs=acquisitionUnavailable?' aria-disabled="true" aria-describedby="home-acquisition-status"':'';
  const ja=locale==='ja';
  const workspaceAction=canReturnToWorkspace
    ? `<button data-home-action="return-workspace">${ja?'Workspaceに戻る':'Return to Workspace'}</button>`
    : canContinue?'<button data-home-action="continue">Continue Editing</button>':'';
  const duplicatePersistenceNotice=(replacementFeedback?.kind==='peer-work'&&peerWorkStatus?.kind==='work')||(replacementFeedback?.kind==='prior-save-refusal'&&peerWorkSaveStopped);
  const persistenceNotice=duplicatePersistenceNotice?'':peerWorkSaveStopped
    ? ja?'前回のWorkspace保存はクロスタブの安全確認で拒否され、このタブからの保存は再読み込みまで停止しています。現在のDatasetはこのタブのメモリに保持され、保存済みWorkspaceは置き換わっていません。このタブに残したい変更をE2R JSONとして書き出し、ダウンロードを確認してください。':'A previous Workspace save was refused during cross-tab safety checks, so saving from this tab remains paused until reload. Its current Dataset remains in memory, and the saved Workspace was not replaced. Export any changes you need to keep from this tab and verify the download.'
    :notice;
  const feedbackCopy=replacementFeedback?.kind==='peer-work'
    ? ja?'別のParameterPlotterタブに保護が必要な作業があるため、Datasetの置換を拒否しました。保存済みWorkspaceは変更されていません。別タブの入力を適用または取り消し、必要なDatasetの変更をE2R JSONとして書き出してから再試行してください。':'Another ParameterPlotter tab has work that needs protection. This replacement was refused and the saved workspace was not changed. Apply or cancel that tab’s open input, and export any Dataset changes you need to keep before retrying.'
    :replacementFeedback?.kind==='prior-save-refusal'
      ? ja?'前回の安全上の拒否により、このタブからのWorkspace保存は停止中です。必要なDatasetをE2R JSONとして書き出してダウンロードを確認し、再読み込みして保存済みWorkspaceを開いてください。':'Workspace saving in this tab remains paused after an earlier safety refusal. Export any Dataset work you need as E2R JSON and check the download, then reload and open the saved Workspace.'
    :replacementFeedback?.kind==='stale-revision'
      ? ja?'別のタブで保存済みWorkspaceが更新されたため、Datasetの置換を拒否しました。現在の変更はメモリに保持され、保存済みWorkspaceは上書きされていません。必要な作業をE2R JSONとして書き出してダウンロードを確認し、このタブを再読み込みして「編集を続ける」を選び、最新のWorkspaceを開いてください。':'Another tab changed the saved workspace revision, so replacement stopped. Your current changes remain in memory and the saved workspace was not overwritten. Export any work you need to keep as E2R JSON and verify the download, then reload this tab and choose Continue Editing to open the latest saved workspace.'
      :replacementFeedback?.kind==='write-unverified'
        ? ja?'Workspaceへの書き込み後、保存状態を確認できませんでした。どちらのDatasetが保存済みか判断しないでください。このタブに残したい作業をE2R JSONとして書き出し、ダウンロードを確認してから再読み込みし、保存状態を確認してください。':'A workspace write may have occurred, but its saved state could not be verified. Do not assume either Dataset is current. Export any work you need to keep as E2R JSON and verify the download before reloading this tab to inspect the saved state.'
        :ja?'クロスタブの安全性を確認できなかったため、置換を受け付けませんでした。安全を確認してから再試行するか、この候補を取り消してください。':'Cross-tab safety could not be verified, so replacement was not accepted. Retry after safety can be checked, or cancel this candidate.';
  const feedbackTitle=ja?'Datasetを置き換えられませんでした':'Dataset replacement was not completed';
  const detailsLabel=ja?'詳細':'Details';
  const retryLabel=replacementFeedback?.checking?(ja?'Workspaceの安全性を確認中…':'Checking workspace safety...'):(ja?'置換を再試行':'Retry replacement');
  const cancelLabel=(replacementFeedback?.kind==='write-unverified'||replacementFeedback?.kind==='stale-revision'||replacementFeedback?.kind==='prior-save-refusal')?(ja?'通知を閉じる':'Close notice'):(ja?'置換を取り消す':'Cancel replacement');
  const showFeedbackReason=replacementFeedback?.reason&&!['peer-work','stale-revision'].includes(replacementFeedback.kind);
  const feedback=replacementFeedback?`<section class="home-notice home-replacement-feedback" role="${replacementFeedback.checking?'status':'alert'}" aria-live="polite"><h2>${feedbackTitle}</h2><p${peerPresentation.feedbackStatusId?' id="home-acquisition-status"':''} data-home-peer-feedback-copy>${escapeHtml(feedbackCopy)}</p>${showFeedbackReason?`<p class="replacement-feedback-reason"><strong>${detailsLabel}:</strong> ${escapeHtml(replacementFeedback.reason)}</p>`:''}<div class="home-replacement-feedback-actions">${replacementFeedback.canRetry===false?'':`<button data-retry-replacement ${replacementFeedback.checking?'disabled':''}>${retryLabel}</button>`}<button data-cancel-replacement-feedback>${cancelLabel}</button></div></section>` : '';
  return `<header class="app-header home-header"><a class="app-brand" href="#home">ParameterPlotter</a></header>
  <main class="home-main" aria-labelledby="home-title">
    <h1 id="home-title">Get Started</h1>
    <p class="home-intro">Compare E2R Entities across Dimensions.</p>
    ${feedback}
    ${persistenceNotice?`<p class="home-notice" role="alert">${escapeHtml(persistenceNotice)}</p>`:''}
    ${sampleError?`<p class="home-notice" role="alert">${escapeHtml(sampleError)}</p>`:''}
    ${handoffStatus?`<p class="home-notice" role="status">${escapeHtml(handoffStatus)}</p>`:''}
    ${handoffError?`<p class="home-notice" role="alert">${escapeHtml(handoffError)}</p>`:''}
    <div class="home-peer-status-slot" data-home-peer-status>${peerPresentation.html}</div>
    <div class="home-actions">
      ${workspaceAction}
      <button data-home-action="new"${acquisitionAttrs}>New Dataset</button>
      <button data-home-action="open"${acquisitionAttrs}>Open E2R Dataset</button>
      <div class="sample-action"><button data-home-action="sample"${acquisitionAttrs}>Open Sample Dataset · The Ashen Crown</button></div>
    </div>
    <input id="dataset-file" type="file" accept=".json,.e2r.json,application/json" hidden>
  </main>`;
}
