// Presentation-only translation of the current application's rendered chrome.
// Dataset values, IDs, names, descriptions, and authored labels stay in their
// original language. The English source remains the fallback for new copy.
const ja = new Map(Object.entries({
  'Get Started':'はじめる','Compare E2R Entities across Dimensions.':'E2Rのエンティティを評価軸で比較します。',
  'Continue Editing':'編集を続ける','New Dataset':'新しいデータセット','Open E2R Dataset':'E2Rデータセットを開く',
  'Open Sample Dataset · The Ashen Crown':'サンプルデータセットを開く · 灰冠の王国',
  'E2R comparison editor':'E2R比較エディター','Credits':'クレジット','Close':'閉じる',
  'Application: ParameterPlotter':'アプリケーション: ParameterPlotter','Creator: sukoyaka-dopeness':'作成者: sukoyaka-dopeness',
  'With gratitude to all the AI systems that contributed to this project.':'このプロジェクトに貢献したすべてのAIシステムに感謝します。',
  'ParameterPlotter repository':'ParameterPlotterリポジトリ','E2R specification repository':'E2R仕様リポジトリ',
  'Credits links':'クレジット関連リンク','Home':'ホーム','Entities':'エンティティ','Dimensions':'評価軸','More':'その他',
  'More workspace actions':'その他の操作','Dataset actions':'データセットの操作','Export E2R JSON':'E2R JSONを書き出す',
  'Profile':'プロファイル','Radar':'レーダー','Quadrant':'四象限','Matrix':'マトリクス','View':'表示',
  'Views':'表示','Entity Pool':'エンティティ一覧','Dimension Pool':'評価軸一覧','Add Entity':'エンティティを追加',
  'Edit Entity':'エンティティを編集','New Entity':'新しいエンティティ',
  'Edit Dimension':'評価軸を編集','New Dimension':'新しい評価軸',
  'Filter by name, labels, range, or unit':'名前・端点ラベル・範囲・単位で絞り込む',
  'Name (optional)':'名前（任意）','Description (optional)':'説明（任意）','Optional Entity name':'エンティティ名（任意）',
  'Add dimension':'評価軸を追加','Add Dimension':'評価軸を追加','Save Dimension':'評価軸を保存',
  'Save Entity':'エンティティを保存','Create Entity':'エンティティを作成','Cancel':'キャンセル',
  'Edit':'編集','Delete':'削除','No matches':'一致する項目はありません','No matching Dimensions':'一致する評価軸はありません',
  'No Dimensions yet.':'評価軸はまだありません。',
  'Entity profile':'エンティティのプロファイル','Edit this Entity’s Dataset Assessments.':'このエンティティのデータセット内の値を編集します。',
  'No Entity description':'エンティティの説明はありません','Describe this Entity':'エンティティの説明を入力','Fill blanks':'未設定の値をランダム入力',
  'Create a Dimension':'評価軸を作成','Define a numeric MIN/MAX range and optional endpoint labels.':'数値のMIN/MAX範囲と、任意の端点ラベルを設定します。',
  'Manage Dimensions':'評価軸一覧を開く','Manage dimensions':'評価軸一覧を開く',
  'Two-axis comparison':'2軸の比較','Multi-axis comparison':'多軸の比較','Values across Entities':'エンティティの値を比較',
  'Add spoke':'軸を追加','Secondary Entity':'比較するエンティティ','Primary Entity':'主エンティティ',
  'Primary':'主','Secondary':'比較','Range':'範囲','Unit':'単位','Values':'値','Hint':'補助設定',
  'Not specified':'未設定','Integer values only':'整数のみ','Decimals allowed':'小数を許可',
  'Choose dimension…':'評価軸を選択…','Choose Entity':'エンティティを選択','Choose…':'選択…',
  'Selected Radar dimensions':'レーダーで選択した評価軸','Waiting Entity drop area':'未配置のエンティティを置く場所',
  'Dimension window':'評価軸の表示範囲','Dimension window position':'評価軸の表示位置',
  'Entity':'エンティティ','Dataset':'データセット','Temporary':'一時的','Plotted':'配置済み','Selected':'選択中',
  'No dimensions':'評価軸はありません','No dimensions yet':'評価軸はまだありません',
  'Start with an E2R Dataset':'E2Rデータセットから始める','Open Entity Pool':'エンティティ一覧を開く',
  'Review Assessment rescale':'値の再計算を確認','Apply reviewed rescale':'再計算を適用',
  'Back to Dimension edit':'評価軸の編集に戻る','Clear plotted Assessments?':'配置した値を消去しますか？',
  'Clear Assessments':'値を消去','Delete Dimension?':'評価軸を削除しますか？',
  'Delete Dimension':'評価軸を削除',
  'Delete Entity':'エンティティを削除','Create a new Dataset?':'新しいデータセットを作成しますか？',
  'Open sample Dataset?':'サンプルデータセットを開きますか？','Open another Dataset?':'別のデータセットを開きますか？',
  'Open linked Dataset?':'リンクされたデータセットを開きますか？','Retrieving the linked Dataset…':'リンクされたデータセットを取得しています…',
  'The Dataset handoff link is invalid. Check its datasetUrl and try again.':'データセット引き継ぎリンクが無効です。datasetUrlを確認して再試行してください。',
  'Could not retrieve the Dataset from this handoff link. The current workspace was not replaced.':'リンクからデータセットを取得できませんでした。現在のワークスペースは置き換えていません。',
  'The Dataset from this handoff link is not valid JSON. The current workspace was not replaced.':'リンク先のデータセットは有効なJSONではありません。現在のワークスペースは置き換えていません。',
  'The Dataset from this handoff link could not be opened. The current workspace was not replaced.':'リンク先のデータセットを開けませんでした。現在のワークスペースは置き換えていません。',
  'Incoming:':'読み込み先:','A new empty E2R Dataset.':'新しい空のE2Rデータセット。',
  'Dataset from the Hub handoff.':'Hubから引き継いだデータセット。','Discard and Open Linked Dataset':'破棄してリンク先のデータセットを開く',
  'The Ashen Crown sample Dataset.':'The Ashen Crownのサンプルデータセット。',
  'E2R Dataset.':'E2Rデータセット。','Discard and Create Dataset':'破棄してデータセットを作成',
  'Discard and Open Sample':'破棄してサンプルを開く','Discard and Open Dataset':'破棄してデータセットを開く',
  'Workspace saved in this browser':'ブラウザー内に作業状態を保存しました',
  'Browser-local workspace degraded / unsaved':'ブラウザー内の作業状態を保存できていません',
  'Saved locally':'ブラウザー内に保存済み','Saving locally…':'ブラウザー内に保存中…','Degraded / unsaved':'ブラウザー内の作業状態を保存できていません',
  'Saving browser-local workspace…':'ブラウザー内の作業状態を保存しています…','Waiting for browser-local save confirmation.':'ブラウザー内の保存結果を確認しています。',
  'Changes not exported':'変更は未書き出し','Matches last Export baseline':'最後の書き出し内容と一致',
  'To save an E2R Dataset file, use Export E2R JSON.':'E2Rデータセットのファイル保存は、別途「E2R JSONを書き出す」から行います。',
  'Unapplied authoring changes are not in the saved browser workspace. Apply or cancel this draft before leaving.':'未適用の編集はブラウザー内の作業状態に保存されていません。移動する前に適用またはキャンセルしてください。',
  'Close panel':'パネルを閉じる','Search Entities':'エンティティを検索','Search dimensions':'評価軸を検索',
  'Search Entity list':'エンティティ一覧を検索','Search Dimension list':'評価軸一覧を検索',
  'Filter by name':'名前で絞り込む','Open Profile':'プロファイルを開く','Return to waiting':'未配置に戻す',
  'Actions for':'操作:','Move up':'上へ移動','Move down':'下へ移動',
  'Include both endpoint labels':'両方の端点ラベルを含める','Include unit text':'単位の文字列を含める',
  'Low label':'下限ラベル','High label':'上限ラベル','MIN':'MIN','MAX':'MAX'
}));
for(const [english,japanese] of Object.entries({
  'PROFILE':'プロファイル','RADAR':'レーダー','QUADRANT':'四象限','MATRIX':'マトリクス',
  'Name':'名前','Description':'説明','Save dimension':'評価軸を保存','Save Dataset Dimension':'評価軸を保存',
  'Unit (optional free text)':'単位（任意の文字列）',
  'Application-local input limit: 240 characters. No conversion or parsing.':'このアプリでの入力上限は240文字です。単位の換算や解析は行いません。',
  'Enter finite numeric bounds with MIN < MAX. Endpoint labels and unit are optional text. Integer-only Dimensions need at least one integer in range. Assessments that would become invalid require a reviewed Rescale before this change is applied.':'有限の数値でMIN < MAXとなる範囲を入力してください。端点ラベルと単位は任意です。整数のみの評価軸には範囲内に少なくとも1つの整数が必要です。既存の値が無効になる変更には、確認済みの再計算が必要です。',
  'Assessment values must remain valid for this Dimension. Existing records are never silently rounded or removed.':'値はこの評価軸の制約を満たす必要があります。既存の記録値を黙って丸めたり削除したりしません。',
  'Choose Primary Entity':'主エンティティを選択','Choose Primary Entity · ID':'主エンティティを選択 · ID',
  'Dataset':'データセット','No Entity description':'エンティティの説明はありません',
  'Fill unassessed Dimensions only':'未設定の評価軸にのみランダムな値を入力します',
  'Select Entity':'エンティティを選択','Clear selected Entity’s X/Y Assessments':'選択中のエンティティのX/Yの値を消去',
  'No matching dimensions':'一致する評価軸はありません','No dimensions yet':'評価軸はまだありません',
  'Primary value; Arrow keys edit':'主エンティティの値。矢印キーで編集',
  'Dimension for column':'列の評価軸','Dimension page':'評価軸ページ',
  'Comparison values are Dataset Assessments':'比較する値はデータセットに記録した値です。',
  'Add Entity':'エンティティを追加',
  'Search Entity list':'エンティティ一覧を検索'
}))ja.set(english,japanese);
for(const [english,japanese] of Object.entries({
  'X axis':'X軸','Y axis':'Y軸','X axis information':'X軸の情報','Y axis information':'Y軸の情報',
  'X axis annotations':'X軸の注記','Y axis annotations':'Y軸の注記',
  'Choose dimension':'評価軸を選択','Choose unplotted Entity':'未配置のエンティティを選択',
  'Choose Entity':'エンティティを選択','1 remaining':'残り1件',
  'No Dataset Entities available':'データセットにエンティティはありません'
}))ja.set(english,japanese);
for(const [english,japanese] of Object.entries({
  'Entity deletion unavailable':'エンティティを削除できません',
  'Resolve these Relations in a Relation-owning application before deleting the Entity. ParameterPlotter does not delete or edit Relations.':'エンティティを削除する前に、リレーションを編集できるアプリでこれらのつながりを解決してください。ParameterPlotterはリレーションを削除・編集しません。',
  'Diagnostic read-only inspection':'診断のための読み取り専用表示',
  'Validator warnings':'Validatorの警告',
  'This Dataset has Validator errors. Authoring and E2R export are unavailable. No repair or normalization was applied.':'このデータセットにはValidatorエラーがあります。編集とE2Rの書き出しはできません。修復や正規化は行っていません。',
  'Warnings do not by themselves block supported authoring or export. Unsupported content is preserved; operations that cannot be checked safely are unavailable.':'警告だけでは対応済みの編集や書き出しを止めません。未対応の内容は保持します。安全に検証できない操作は利用できません。',
  'Dimension Assessment version is unsupported here; its payload remains opaque and unchanged.':'このDimension Assessmentのバージョンには対応していません。内容は解釈せず、そのまま保持します。',
  'No matching Dataset Entities.':'一致するデータセットのエンティティはありません。',
  'Edit Entity':'エンティティを編集','Delete':'削除','Delete Entity?':'エンティティを削除しますか？',
  'Entities are edited directly in this Dataset. Dimensions and values are saved in the Dataset and included in exports.':'エンティティはこのDataset内で直接編集します。評価軸と値はDatasetに保存され、書き出しにも含まれます。',
  'No value changed.':'値は変更されませんでした。',
  'No safely generated integer candidate in range; review this Dimension\'s bounds.':'この範囲では安全に生成できる整数がありません。評価軸の範囲を確認してください。',
  'Stored value violates this Dimension policy; enter an allowed replacement':'記録値がこの評価軸の制約に反しています。許容される値に変更してください。'
}))ja.set(english,japanese);

for(const [english,japanese] of Object.entries({
  'Upgrade to Candidate 0.2.0 to add optional Dimension descriptions. Existing Dimensions and Assessments will be preserved.':'Candidate 0.2.0にアップグレードすると、評価軸の説明を追加できます。既存の評価軸と値は保持されます。',
  'Upgrade to 0.2.0':'0.2.0にアップグレード','Describe this Dimension':'評価軸の説明を入力',
  'Plain text included in the Dataset. Line breaks are preserved.':'プレーンテキストでDatasetに保存されます。改行はそのまま保持されます。',
  'Enter a description with at least one non-whitespace character, or leave it blank.':'説明を入力する場合は、空白以外の文字を1文字以上入力してください。空欄にもできます。',
  'Upgrade Dimension Assessment?':'Dimension Assessmentをアップグレードしますか？',
  "Upgrade this Dataset's Dimension Assessment payload from 0.1.0 to 0.2.0. Existing Dimensions, Assessments, IDs, values, and other Dataset content will be preserved. No descriptions will be generated.":'このDatasetのDimension Assessmentを0.1.0から0.2.0へアップグレードします。既存の評価軸、値、ID、その他のDataset内容は保持されます。説明は自動作成されません。',
  'Dimension Assessment upgraded to Candidate 0.2.0. Existing Dataset values were preserved.':'Dimension AssessmentをCandidate 0.2.0にアップグレードしました。既存のDataset値は保持されています。'
}))ja.set(english,japanese);

const phrases = [
  ['Choose X/Y, then drag an unassessed Entity or tap the plot to author in-range Assessments.','X/Yを選び、値が未設定のエンティティをドラッグするか、図をタップして範囲内の値を記録します。'],
  ['Drag Primary vertices; Secondary is comparison only.','主エンティティの頂点をドラッグします。比較するエンティティは表示専用です。'],
  ['Compare and directly edit values; use row and column handles to reorder this Matrix.','値を比較・編集できます。行と列のハンドルでマトリクス内の順序を変更できます。'],
  ['Values are recorded in each Dimension’s range. Radar and Quadrant positions are derived from that range. Blank means unassessed, not zero.','値は各評価軸の範囲内に記録されます。レーダーと四象限の位置はその範囲から算出されます。空欄は未設定で、ゼロではありません。'],
  ['Plot midpoint is derived from each selected MIN/MAX range; it does not assert a zero value. Missing Assessments are absent.','図の中点は選択したMIN/MAX範囲から算出され、ゼロを意味しません。未設定の値は表示されません。'],
  ['Recorded values are retained. Edit a value in Profile or Matrix to replace it with a value allowed by that Dimension.','記録済みの値は保持されます。プロファイルかマトリクスで、その評価軸が許す値に変更してください。'],
  ['Select a Primary vertex on the chart, then use Arrow keys to edit the recorded value. Each press moves about 10% of that Dimension range (integer steps for integer-only Dimensions). Positions use each Dimension’s MIN/MAX. Missing values remain unassessed; existing values violating range or integer-only constraints are retained without a chart position.','図の主Entityの評価軸を選び、矢印キーで記録値を編集できます。1回の操作で範囲の約10%を移動します（整数のみの評価軸では整数刻み）。位置は各評価軸のMIN/MAXから算出します。未設定値は未評価のままです。範囲または整数制約に反する既存値は保持され、図には配置されません。'],
  ['Open a Dataset or create a Dataset Entity. No Assessment is inferred.','データセットを開くか、エンティティを作成してください。値は推測して追加されません。'],
  ['Entities are edited directly in this Dataset. Dimensions and values are saved in the Dataset and included in exports.','エンティティはこのDataset内で直接編集します。評価軸と値はDatasetに保存され、書き出しにも含まれます。'],
  ['Changing these bounds makes existing Assessments invalid. Review this linear rescale; nothing changes in the Dataset until you approve it.','この範囲変更により既存の値が無効になります。線形の再計算を確認してください。承認するまでデータセットは変更されません。'],
  ['Opening this Dataset replaces the active Dataset and its comparison workspace. Any Dataset changes or unapplied authoring in the current workspace will be discarded.','このデータセットを開くと、現在のデータセットと比較用の作業状態が置き換わります。現在の変更や未適用の編集は破棄されます。'],
  ['Creating this Dataset replaces the active Dataset and its comparison workspace. Any Dataset changes or unapplied authoring in the current workspace will be discarded.','新しいデータセットを作成すると、現在のデータセットと比較用の作業状態が置き換わります。現在の変更や未適用の編集は破棄されます。'],
  ['Dataset:','データセット:'],['Browser workspace:','ブラウザー内の作業状態:'],
  ['Changes not exported','変更は未書き出し'],['Matches last Export baseline','最後の書き出し内容と一致'],
  ['Saved locally','ブラウザー内に保存済み'],['Saving locally…','ブラウザー内に保存中…'],['Degraded / unsaved','ブラウザー内の作業状態を保存できていません'],
  ['Stored values violating selected Dimension policies · not plotted','選択した評価軸の制約に反する記録値 · 図には表示しません'],
  ['Stored values violating selected Quadrant Dimension policies','四象限で選択した評価軸の制約に反する記録値'],
  ['No assessment · move the slider to assign','値は未設定 · スライダーで設定できます'],
  ['No assessment','値は未設定'],['No value','値はありません'],
  ['Fill unassessed Dimensions only','未設定の評価軸にのみランダムな値を入力します'],
  ['Clear assessment','値を消去'],['Previous Entity','前のエンティティ'],['Next Entity','次のエンティティ'],
  ['Previous dimensions','前の評価軸'],['Next dimensions','次の評価軸'],
  ['Previous unplotted Entity','前の未配置エンティティ'],['Next unplotted Entity','次の未配置エンティティ'],
  ['Radar chart derived from each Dimension’s MIN/MAX','各評価軸のMIN/MAXから算出したレーダー図'],
  ['Drag to reorder Matrix columns. Keyboard: Alt+Left/Right','ドラッグしてマトリクスの列順を変更。キーボード: Alt+左右キー'],
  ['Drag to reorder Matrix rows. Keyboard: Alt+Up/Down','ドラッグしてマトリクスの行順を変更。キーボード: Alt+上下キー'],
  ['Include both endpoint labels','両方の端点ラベルを含める'],['Include unit text','単位の文字列を含める']
];

phrases.push(
  ['Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.','別のParameterPlotterタブで保存済みWorkspaceが更新されました。このタブから上書きはしていません。残したい作業をE2R JSONへExportし、ダウンロードを確認してからこのタブを再読み込みし、「Continue Editing」を選んで最新の保存済みWorkspaceを開いてください。'],
  ['Another ParameterPlotter tab has work that needs protection. Apply or cancel its open input, and export any Dataset changes you need to keep before changing this shared workspace.','別のParameterPlotterタブに未適用の作業があります。共有Workspaceを変更する前に、そのタブの入力を適用または取り消してください。必要なDatasetの変更はE2R JSONとして書き出してください。'],
  ['Another ParameterPlotter tab has work that needs protection. Apply or cancel its open input, and export any Dataset changes you need to keep before opening a replacement Dataset.','別のParameterPlotterタブに未適用の作業があります。置換Datasetを開く前に、そのタブの入力を適用または取り消してください。必要なDatasetの変更はE2R JSONとして書き出してください。'],
  ['The browser was asked to download the E2R JSON. This app cannot confirm that the download completed, so check that the file is available before relying on it. Saving the browser-local Workspace is a separate operation.','E2R JSONのダウンロードをブラウザーに依頼しました。このアプリでは完了を確認できないため、ファイルがダウンロードされたことを確認してから利用してください。ブラウザー内Workspaceへの保存は別の処理です。'],
  ['E2R Dataset Export is unavailable during diagnostic read-only inspection.','診断のための読み取り専用表示中はE2Rデータセットを書き出せません。'],
  ['Export blocked: Validator errors remain. No repair or normalization was applied.','Validatorエラーがあるため書き出せません。修復や正規化は行っていません。'],
  ['The Dataset was opened in memory, but the browser-local copy was not replaced. It remains unsaved and may be lost on reload or browser close.','データセットはメモリー上で開きましたが、ブラウザー内のコピーは更新されませんでした。作業状態は未保存で、再読み込みやブラウザーを閉じると失われる可能性があります。'],
  ['Dataset Entity change applied. It is part of the Dataset and is not exported until E2R JSON Export.','データセットのエンティティの変更を適用しました。E2R JSONを書き出すまでファイルには反映されません。'],
  ['Dimension change applied to the Dataset. E2R JSON Export is a separate step.','評価軸の変更をデータセットに適用しました。E2R JSONの書き出しは別の操作です。'],
  ['Dimension and its dependent Assessments were removed in one Dataset change.','評価軸と関連する値を、1回のデータセット変更で削除しました。'],
  ['Rescale cannot produce valid Assessments for this range. Nothing changed.','この範囲では有効な値に再計算できません。変更はありません。'],
  ['Enter finite numeric MIN and MAX values with MIN < MAX.','有限の数値でMIN < MAXとなる値を入力してください。'],
  ['This integer-only range has no valid integer candidate.','整数のみの範囲内に有効な整数がありません。']
);

const protectedContent = '.dataset-title,.replacement-incoming-dataset,.entity-row-title strong,.entity-content .profile-intro h3,.entity-content .profile-intro p,.dimension-description,.dimension-card .card-head strong,.point-label,.plot-item,.quadrant-keyboard-help,.quadrant-keyboard-status,.matrix-row-name,.matrix-identity span,.pager-current strong,.list-row strong,.quadrant-axis-name span,.credits-metadata a';
ja.set('Dataset title','Datasetタイトル');
ja.set('Apply','適用');
ja.set('Workspace actions','作業操作');
ja.set('Dataset title applied. E2R JSON Export is a separate step.','データセットのタイトルを適用しました。E2R JSONの書き出しは別の操作です。');
ja.set('Create dimensions to populate the Matrix.','評価軸を作成するとマトリクスに表示されます。');
ja.set('Symbol or descriptive phrase','記号または説明文');
ja.set('X Low','X軸の下限');
ja.set('X High','X軸の上限');
ja.set('Y Low','Y軸の下限');
ja.set('Y High','Y軸の上限');
export function translateUiText(value) {
  const trimmed=value.trim();
  if(!trimmed)return value;
  const translated=ja.get(trimmed);
  if(translated!==undefined)return value.replace(trimmed,translated);
  let result=value;
  for(const [english,japanese] of phrases)result=result.replaceAll(english,japanese);
  result=result.replace(/^(\s*)(\d+) Dataset Entit(?:y|ies) · (\d+) Dimensions? · (\d+) Assessments?(\s*)$/,
    (_,before,entities,dimensions,assessments,after)=>`${before}${entities}件のエンティティ · ${dimensions}件の評価軸 · ${assessments}件の値${after}`);
  result=result.replace(/^(\s*)(\d+) plotted(\s*)$/,(_,before,count,after)=>`${before}${count}件を配置${after}`);
  result=result.replace(/^(\s*)(\d+) remaining(\s*)$/,(_,before,count,after)=>`${before}残り${count}件${after}`);
  result=result.replace(/^(\s*)(\d+)–(\d+) of (\d+)(\s*)$/,(_,before,start,end,total,after)=>`${before}${total}件中 ${start}〜${end}件${after}`);
  result=result.replace(/^(\s*)Dimension page (\d+)(\s*)$/,(_,before,page,after)=>`${before}評価軸ページ ${page}${after}`);
  result=result.replace(/^(\s*)Dimension for column (\d+)(\s*)$/,(_,before,column,after)=>`${before}${column}列目の評価軸${after}`);
  result=result.replace(/^(\s*)Recorded assessment ([-+\d.]+)(\s*)$/,(_,before,number,after)=>`${before}記録済みの値 ${number}${after}`);
  result=result.replace(/^(\s*)Randomize (.+?)(\s*)$/,(_,before,name,after)=>`${before}${name}の未設定値をランダム入力${after}`);
  result=result.replace(/^(\s*)Clear selected Entity’s X\/Y Assessments(\s*)$/,(_,before,after)=>`${before}選択中のエンティティのX/Yの値を消去${after}`);
  result=result.replace(/^(\s*)Add (\d+) more dimensions? to draw a Radar chart\.(\s*)$/,(_,before,count,after)=>`${before}レーダー図を描くには評価軸をあと${count}件追加してください。${after}`);
  result=result.replace(/^(\s*)(\d+) spokes(\s*)$/,(_,before,count,after)=>`${before}${count}軸${after}`);
  result=result.replace(/^(\s*)Dataset: (.+) · Browser workspace: (.+)(\s*)$/,(_,before,dataset,workspace,after)=>`${before}データセット: ${dataset} · ブラウザー内の作業状態: ${workspace}${after}`);
  result=result.replace(/^(\s*)(\d+) Dataset Entit(?:y|ies) available · (\d+) Dimensions?(\s*)$/,(_,before,entities,dimensions,after)=>`${before}${entities}件のエンティティ · ${dimensions}件の評価軸${after}`);
  result=result.replace(/^(\s*)(-?\d+(?:\.\d+)?) to (-?\d+(?:\.\d+)?)(\s*)$/,
    (_,before,min,max,after)=>`${before}${min}〜${max}${after}`);
  result=result.replace(/^(.+) selected · Arrow keys adjust Primary by (1|0\.05)\. Secondary stays comparison-only\.$/,
    (_,name,step)=>`${name}を選択しました · 矢印キーで主エンティティの値を${step}刻みで調整できます。比較エンティティは表示専用です。`);
  result=result.replace(/^Value unchanged · this Dimension accepts (integers from )?([-+\d.]+) to ([-+\d.]+)\. The recorded value remains in session data\.$/,
    (_,integer,min,max)=>`値は変更されませんでした · この評価軸では${min}〜${max}の${integer?'整数':'値'}を入力できます。記録済みの値は保持されます。`);
  return result;
}
export function localizeUi(root,locale) {
  if(locale!=='ja')return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(node.parentElement?.matches('.temp-badge')&&node.nodeValue.trim()==='Dataset')continue;
    if(node.parentElement?.closest(protectedContent)){
      if(node.parentElement?.matches('.temp-badge,[data-ui-empty-description]')||node.parentElement?.matches('.pager-current strong')&&node.nodeValue.trim()==='Choose Entity'||node.parentElement?.matches('.quadrant-axis-name span')&&node.nodeValue.trim()==='Choose dimension')node.nodeValue=translateUiText(node.nodeValue);
      continue;
    }
    if(node.parentElement?.closest('[data-matrix-empty]')&&node.nodeValue.startsWith('Selected Entity: ')){
      node.nodeValue=node.nodeValue.replace(/^Selected Entity: /,'選択中のエンティティ: ');
      continue;
    }
    const option=node.parentElement?.closest('option');
    if(option&&option.closest('select')?.id!=='view-select'&&option.value)continue;
    if(node.parentElement?.matches('.dimension-unit,.matrix-unit')&&node.nodeValue.startsWith('Unit: ')){
      node.nodeValue=`単位: ${node.nodeValue.slice(6)}`;
      continue;
    }
    if(node.parentElement?.matches('[data-radar-value]')){
      node.nodeValue=node.nodeValue.replace(/^Primary /,'主 ').replace(' · Secondary ',' · 比較 ');
      continue;
    }
    if(node.parentElement?.matches('title')&&node.parentElement.closest('[data-vertex]')&&node.nodeValue.includes('Unit: ')){
      node.nodeValue=node.nodeValue.replace('Unit: ','単位: ');
      continue;
    }
    node.nodeValue=translateUiText(node.nodeValue);
  }
  for(const element of root.querySelectorAll('[aria-label],[title],[placeholder]')){
    if(element.matches('.dimension-unit,.matrix-unit')){
      const title=element.getAttribute('title');
      if(title?.startsWith('Unit: '))element.setAttribute('title',`単位: ${title.slice(6)}`);
      continue;
    }
    if(element.matches('[data-radar-move],[data-radar-remove]')){
      const label=element.getAttribute('aria-label');
      const match=label?.match(/^(Move|Remove) (.+?)( up| down)?$/);
      if(match)element.setAttribute('aria-label',match[1]==='Remove'?`${match[2]}を削除`:`${match[2]}を${match[3]===' up'?'上':'下'}へ移動`);
      continue;
    }
    if(element.matches('[data-vertex]')){
      const label=element.getAttribute('aria-label');
      if(label?.endsWith(' Primary value; Arrow keys edit'))element.setAttribute('aria-label',label.replace(' Primary value; Arrow keys edit',' 主エンティティの値。矢印キーで編集'));
      for(const attribute of ['aria-valuetext','title']){
        const value=element.getAttribute(attribute);
        if(value?.includes('Unit: '))element.setAttribute(attribute,value.replace('Unit: ','単位: '));
      }
      continue;
    }
    if(element.matches('[data-drag-dimension],[data-matrix-row-handle]')){
      const label=element.getAttribute('aria-label');
      if(element.matches('[data-drag-dimension]')&&label?.startsWith('Reorder '))element.setAttribute('aria-label',label.replace(/^Reorder /,'列順を変更: ').replace('; drag or use Alt plus Arrow keys','。ドラッグまたはAlt+左右キー'));
      if(element.matches('[data-matrix-row-handle]')&&label?.startsWith('Reorder '))element.setAttribute('aria-label',label.replace(/^Reorder /,'行順を変更: ').replace('; drag or use Alt plus Up/Down','。ドラッグまたはAlt+上下キー'));
      const title=element.getAttribute('title');
      if(title)element.setAttribute('title',translateUiText(title));
      continue;
    }
    if(element.matches('th[data-drop-column]')){
      const title=element.getAttribute('title');
      if(title?.includes('Unit: '))element.setAttribute('title',title.replace('Unit: ','単位: '));
    }
    if(element.matches('[data-random]:not([data-random="card"])')){
      const label=element.getAttribute('aria-label');
      if(label?.startsWith('Randomize '))element.setAttribute('aria-label',`未設定の値をランダム入力: ${label.slice(10)}`);
      if(element.hasAttribute('title'))element.setAttribute('title','この評価軸の未設定値をランダム入力します');
      continue;
    }
    if(element.matches('input[type="number"][data-value],input[type="range"][data-value]')){
      const label=element.getAttribute('aria-label');
      if(label?.endsWith(' value'))element.setAttribute('aria-label',`${label.slice(0,-6)}の値`);
      if(label?.endsWith(' slider'))element.setAttribute('aria-label',`${label.slice(0,-7)}のスライダー`);
    }
    if(element.matches('.pager-current')){
      const label=element.getAttribute('aria-label');
      if(label?.startsWith('Choose Primary Entity'))element.setAttribute('aria-label',label.replace('Choose Primary Entity','主エンティティを選択'));
      if(label?.startsWith('Choose unplotted Entity'))element.setAttribute('aria-label',label.replace('Choose unplotted Entity','未配置のエンティティを選択'));
      const title=element.getAttribute('title');
      if(title?.includes(' · Open Entity Pool'))element.setAttribute('title',title.replace(/^Choose Entity/,'エンティティを選択').replace(' · Open Entity Pool',' · エンティティ一覧を開く').replace('; drag to place','。ドラッグして配置'));
      continue;
    }
    if(element.matches('[data-entity-menu]')){
      const label=element.getAttribute('aria-label');
      if(label?.startsWith('Actions for '))element.setAttribute('aria-label',`操作: ${label.slice('Actions for '.length)}`);
      continue;
    }
    if(element.matches(protectedContent)||element.closest('.plot-item,.matrix-row-identity')||element.matches('[data-entity-menu],[data-choose-entity],[data-matrix-row-handle],[data-vertex],[data-random]:not([data-random="card"]),.pager-current,.matrix-grip'))continue;
    for(const attribute of ['aria-label','title','placeholder'])if(element.hasAttribute(attribute))element.setAttribute(attribute,translateUiText(element.getAttribute(attribute)));
  }
}
