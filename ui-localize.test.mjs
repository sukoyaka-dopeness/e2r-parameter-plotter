import test from 'node:test';
import assert from 'node:assert/strict';
import {translateUiText} from './ui-localize.js';

test('selected Japanese Product action wording is retained',()=>{
  assert.equal(translateUiText('Dataset title'),'Datasetタイトル');
  assert.equal(translateUiText(' Fill blanks'),' 未設定の値をランダム入力');
  assert.equal(translateUiText('Review Assessment rescale'),'値の再計算を確認');
  assert.equal(translateUiText('Apply reviewed rescale'),'再計算を適用');
  assert.equal(translateUiText('Entity Pool'),'エンティティ一覧');
  assert.equal(translateUiText('Dimension Pool'),'評価軸一覧');
  assert.equal(translateUiText('Export E2R JSON'),'E2R JSONを書き出す');
  assert.equal(translateUiText('Browser-local workspace degraded / unsaved'),'ブラウザー内の作業状態を保存できていません');
});
test('unknown content, identifiers, and authored names have no lexical translation',()=>{
  assert.equal(translateUiText('ParameterPlotter'),'ParameterPlotter');
  assert.equal(translateUiText('draft.github.sukoyaka-dopeness.dimension-assessment'),'draft.github.sukoyaka-dopeness.dimension-assessment');
  assert.equal(translateUiText('The Ashen Crown'),'The Ashen Crown');
});
