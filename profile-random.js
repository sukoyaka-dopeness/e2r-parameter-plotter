import {integerCandidates, dimensionRange} from './model.js';
import {hintedRandom} from './decimal-presentation.js';

export function randomDimensionValue(dimension, random = Math.random) {
  // Decimal scale is for random generation only, never direct-input precision.
  if (dimension?.integerOnly !== true) {
    const {min,max}=dimensionRange(dimension);
    return hintedRandom(min,max,dimension?.decimalPlaces ?? 2,random);
  }

  // Technical guard for generated candidates, not a portable precision rule.
  const candidates=integerCandidates(dimension);
  if (!candidates) return null;
  const {first,count}=candidates;
  return first + Math.floor(random() * count);
}
