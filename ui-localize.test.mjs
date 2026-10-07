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
test('value-bearing UI phrases translate without changing authored Dimension names or numbers',()=>{
  assert.equal(translateUiText('-2.7 to 3.6'),'-2.7〜3.6');
  assert.equal(translateUiText('X Low'),'X軸の下限');
  assert.equal(translateUiText('Symbol or descriptive phrase'),'記号または説明文');
  assert.equal(translateUiText('Impact selected · Arrow keys adjust Primary by 1. Secondary stays comparison-only.'),'Impactを選択しました · 矢印キーで主エンティティの値を1刻みで調整できます。比較エンティティは表示専用です。');
  assert.equal(translateUiText('Value unchanged · this Dimension accepts integers from -2.7 to 3.6. The recorded value remains in session data.'),'値は変更されませんでした · この評価軸では-2.7〜3.6の整数を入力できます。記録済みの値は保持されます。');
});
