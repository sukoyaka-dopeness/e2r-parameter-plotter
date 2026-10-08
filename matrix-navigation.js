export function matrixPageAfter(currentPage, pageCount, step) {
  const count = Number.isInteger(pageCount) && pageCount > 0 ? pageCount : 1;
  if (count === 1) return 0;
  const current = Number.isInteger(currentPage) ? currentPage : 0;
  const delta = Number.isInteger(step) ? step : 0;
  return ((current + delta) % count + count) % count;
}
