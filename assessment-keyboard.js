import {decimalAdd} from './decimal-presentation.js';
import {acceptsDimensionValue, dimensionRange} from './model.js';

export function assessmentKeyboardStep(dimension) {
  return dimension?.integerOnly === true ? 1 : 0.05;
}

export function adjustAssessmentByKeyboard(dimension, current, direction) {
  if (!Number.isFinite(current) || ![-1, 1].includes(direction)) return null;
  const next = decimalAdd(current, assessmentKeyboardStep(dimension) * direction);
  return acceptsDimensionValue(dimension, next) ? next : null;
}

export function quadrantArrowAdjustment(key, xDimensionId, yDimensionId) {
  if (key === 'ArrowLeft') return {dimensionId:xDimensionId, direction:-1, axis:'X'};
  if (key === 'ArrowRight') return {dimensionId:xDimensionId, direction:1, axis:'X'};
  if (key === 'ArrowUp') return {dimensionId:yDimensionId, direction:1, axis:'Y'};
  if (key === 'ArrowDown') return {dimensionId:yDimensionId, direction:-1, axis:'Y'};
  return null;
}

export function quadrantKeyboardHelp(locale) {
  return locale === 'ja'
    ? '\u77e2\u5370\u30ad\u30fc\u3067\u70b9\u3092\u79fb\u52d5\u3057\u3001\u5bfe\u5fdc\u3059\u308b\u5024\u3092\u76f4\u63a5\u7de8\u96c6\u3067\u304d\u307e\u3059\u3002\u5de6\u53f3\u306fX\u8ef8\u3001\u4e0a\u4e0b\u306fY\u8ef8\u3067\u3059\u3002\u5024\u306f\u30ad\u30fc\u5165\u529b\u3054\u3068\u306b\u53cd\u6620\u3057\u307e\u3059\u3002'
    : 'Use arrow keys to move the point and edit the corresponding value. Left/right adjust X; up/down adjust Y. Each key press applies immediately.';
}

export function quadrantKeyboardValues(locale, entityName, xName, xValue, yName, yValue) {
  return locale === 'ja'
    ? `${entityName}\u3002X\u8ef8 ${xName}: ${xValue}\u3001Y\u8ef8 ${yName}: ${yValue}`
    : `${entityName}. X ${xName}: ${xValue}; Y ${yName}: ${yValue}`;
}

export function rejectedKeyboardAdjustment(locale, entityName, axis, dimension, current) {
  const range = dimensionRange(dimension);
  const bounds = `${range.min} ${locale === 'ja' ? '\u304b\u3089' : 'to'} ${range.max}`;
  return locale === 'ja'
    ? `${entityName}\u306e${axis}\u8ef8\u306e\u5024\u306f\u5909\u66f4\u3055\u308c\u307e\u305b\u3093\u3002${bounds}\u306e\u7bc4\u56f2\u5185\u3067\u3001${dimension?.integerOnly === true ? '\u6574\u6570\u3067' : ''}\u30ad\u30fc\u3092\u64cd\u4f5c\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u73fe\u5728\u5024: ${current}`
    : `${entityName} ${axis} value unchanged. Use a key that keeps the value within ${dimension?.integerOnly === true ? 'integer ' : ''}range ${bounds}. Current value: ${current}`;
}

export function keyboardEditUnavailable(locale, entityName, axis) {
  return locale === 'ja'
    ? `${entityName}\u306e${axis}\u8ef8\u306eAssessment\u306f\u5909\u66f4\u3067\u304d\u307e\u305b\u3093\u3002\u30c7\u30fc\u30bf\u30bb\u30c3\u30c8\u306f\u8aad\u307f\u53d6\u308a\u5c02\u7528\u3001\u307e\u305f\u306f\u672a\u5bfe\u5fdc\u5185\u5bb9\u3092\u542b\u3093\u3067\u3044\u307e\u3059\u3002`
    : `${entityName} ${axis} Assessment was not changed. The Dataset is read-only or contains unsupported content.`;
}
