import {footerMarkup} from './application-shell.js';
export function editorSessionMarkup({kind='checking',locale='en'}={}){
  const ja=locale==='ja';
  const heading=kind==='blocked'
    ?ja?'別のタブでParameterPlotterを使用しています':'ParameterPlotter is open in another tab'
    :kind==='ended'
      ?ja?'この編集セッションは終了しました':'This editing session has ended'
      :kind==='checking'
        ?ja?'編集セッションを確認しています':'Checking the editing session'
        :ja?'編集セッションを安全に開始できません':'The editing session could not be started safely';
  const detail=kind==='blocked'
    ?ja?'元のタブに戻り、このタブを閉じてください。元のタブが終了した後に再開する場合は、このページを再読み込みするか、ParameterPlotterを開き直してください。':'Return to the original tab and close this tab. After the original tab has closed, reload this page or reopen ParameterPlotter to resume.'
    :kind==='ended'
      ?ja?'再開するには、このページを再読み込みするか、ParameterPlotterを開き直してください。最後に正常保存されたWorkspaceから再開します。未適用の入力は保存済みWorkspaceには含まれません。':'Reload this page or reopen ParameterPlotter to resume from the last successfully saved Workspace. Unapplied input is not included in the saved Workspace.'
      :kind==='checking'
        ?ja?'このタブで安全にParameterPlotterを使用できるか確認しています。':'Checking whether ParameterPlotter can be used safely in this tab.'
        :ja?'タブ間の排他的な編集権限を確認できないため、編集を開始していません。保存済みWorkspaceは変更していません。ブラウザーの協調機能が利用できる環境で、ページを再読み込みするか開き直してください。':'Editing has not started because exclusive access across tabs could not be established. The saved Workspace has not been changed. Reload or reopen the page in a browser environment that supports tab coordination.';
  return `<header class="app-header"><h1 class="app-brand">ParameterPlotter</h1></header><main class="home-main editor-session-main"><section role="status" aria-live="polite" aria-labelledby="editor-session-title"><h2 id="editor-session-title">${heading}</h2><p>${detail}</p></section></main>${footerMarkup()}`;
}
