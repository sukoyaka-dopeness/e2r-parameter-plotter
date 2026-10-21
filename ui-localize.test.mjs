import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {translateUiText} from './ui-localize.js';

test('selected Japanese Product action wording is retained',()=>{
  assert.equal(translateUiText('Application: ParameterPlotter 0.1.0'),'アプリケーション: ParameterPlotter 0.1.0');
  assert.equal(translateUiText('First release'),'初回リリース');
  assert.equal(translateUiText('Updated'),'更新日');
  assert.equal(translateUiText('Dataset title'),'Datasetタイトル');
  assert.equal(translateUiText('Apply title'),'タイトルを適用');
  assert.equal(translateUiText(' Fill blanks'),' 未設定の値をランダム入力');
  assert.equal(translateUiText('Review Assessment rescale'),'値の再計算を確認');
  assert.equal(translateUiText('Apply reviewed rescale'),'再計算を適用');
  assert.equal(translateUiText('Entity Pool'),'エンティティ一覧');
  assert.equal(translateUiText('Dimension Pool'),'評価軸一覧');
  assert.equal(translateUiText('Export E2R JSON'),'E2R JSONを書き出す');
  assert.equal(translateUiText('Browser-local workspace degraded / unsaved'),'ブラウザー内の作業状態を保存できていません');
});
test('browser-local status and Dimension pool copy use the approved wording',()=>{
  assert.equal(translateUiText('Workspace saved in this browser'),'ブラウザー内に作業状態を保存しました');
  assert.equal(translateUiText('To save an E2R Dataset file, use Export E2R JSON.'),'E2Rデータセットのファイル保存は、別途「E2R JSONを書き出す」から行います。');
  assert.equal(translateUiText('No Dimensions yet.'),'評価軸はまだありません。');
  assert.equal(translateUiText('2 Dataset Entities · 3 Dimensions · 4 Assessments'),'2件のエンティティ · 3件の評価軸 · 4件の値');
  assert.equal(translateUiText('2 Dataset Entities available · 3 Dimensions'),'2件のエンティティ · 3件の評価軸');
});
test('new Entity description placeholder is localized without changing authored content',()=>{
  assert.equal(translateUiText('Describe this Entity'),'エンティティの説明を入力');
  assert.equal(translateUiText('Independent Entity'),'Independent Entity');
});
test('unknown content, identifiers, and authored names have no lexical translation',()=>{
  assert.equal(translateUiText('ParameterPlotter'),'ParameterPlotter');
  assert.equal(translateUiText('draft.github.sukoyaka-dopeness.dimension-assessment'),'draft.github.sukoyaka-dopeness.dimension-assessment');
  assert.equal(translateUiText('The Ashen Crown'),'The Ashen Crown');
});
test('value-bearing UI phrases translate without changing authored Dimension names or numbers',()=>{
  assert.equal(translateUiText('-2.7 to 3.6'),'-2.7〜3.6');
  assert.equal(translateUiText('X Low'),'X軸の下限');
  assert.equal(translateUiText('Symbol or descriptive phrase'),'記号または説明文');
  assert.equal(translateUiText('Impact selected · Arrow keys adjust Primary by 1. Secondary stays comparison-only.'),'Impactを選択しました · 矢印キーで主エンティティの値を1刻みで調整できます。比較エンティティは表示専用です。');
  assert.equal(translateUiText('Value unchanged · this Dimension accepts integers from -2.7 to 3.6. The recorded value remains in session data.'),'値は変更されませんでした · この評価軸では-2.7〜3.6の整数を入力できます。記録済みの値は保持されます。');
});
test('Footer descriptor keeps the approved English and Japanese wording',()=>{
  assert.equal(translateUiText('E2R Dimension Editor'),'E2R 評価軸エディター');
});
test('Entity and Dimension drawer wording avoids redundant Dataset and Candidate jargon',()=>{
  assert.equal(translateUiText('Add Entity'),'エンティティを追加');
  assert.equal(translateUiText('Edit Entity'),'エンティティを編集');
  assert.equal(translateUiText('Delete'),'削除');
  assert.equal(translateUiText('New Entity'),'新しいエンティティ');
  assert.equal(translateUiText('Edit Dimension'),'評価軸を編集');
  assert.equal(translateUiText('New Dimension'),'新しい評価軸');
  assert.equal(translateUiText('Delete Entity?'),'エンティティを削除しますか？');
  assert.equal(translateUiText('Entities are edited directly in this Dataset. Dimensions and values are saved in the Dataset and included in exports.'),'エンティティはこのDataset内で直接編集します。評価軸と値はDatasetに保存され、書き出しにも含まれます。');
  assert.equal(translateUiText('Entity Pool'),'エンティティ一覧');
  assert.equal(translateUiText('Dimension Pool'),'評価軸一覧');
});
test('Candidate 0.2.0 description and upgrade chrome localize while authored descriptions remain untouched',()=>{
  assert.equal(translateUiText('Describe this Dimension'),'評価軸の説明を入力');
  assert.equal(translateUiText('Upgrade to 0.2.0'),'0.2.0にアップグレード');
  assert.equal(translateUiText('Upgrade Dimension Assessment?'),'Dimension Assessmentをアップグレードしますか？');
  assert.equal(translateUiText('The Ashen Crown measures arcane power.'),'The Ashen Crown measures arcane power.');
  assert.equal(translateUiText('Select a Primary vertex on the chart, then use Arrow keys to edit the recorded value. Each press moves about 10% of that Dimension range (integer steps for integer-only Dimensions). Positions use each Dimension’s MIN/MAX. Missing values remain unassessed; existing values violating range or integer-only constraints are retained without a chart position.'),'図の主Entityの評価軸を選び、矢印キーで記録値を編集できます。1回の操作で範囲の約10%を移動します（整数のみの評価軸では整数刻み）。位置は各評価軸のMIN/MAXから算出します。未設定値は未評価のままです。範囲または整数制約に反する既存値は保持され、図には配置されません。');
});

test('workspace saving progress is localized without implying a completed write',()=>{
  assert.notEqual(translateUiText('Saving locally…'),'Saving locally…');
  assert.notEqual(translateUiText('Saving browser-local workspace…'),'Saving browser-local workspace…');
  assert.notEqual(translateUiText('Waiting for browser-local save confirmation.'),'Waiting for browser-local save confirmation.');
});

test('stale-workspace recovery warning uses the adopted Japanese Export action wording',()=>{
  const english='Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep as E2R JSON and check that the download completed; then reload this tab and choose Continue Editing to open the latest saved workspace.';
  const japanese=translateUiText(english);
  assert.match(japanese,/E2R JSONとして書き出し/);
  assert.match(japanese,/「編集を続ける」を選んで/);
  assert.doesNotMatch(japanese,/Export|Continue Editing/);
});
