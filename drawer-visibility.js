export function revealWithinScrollport(target, scrollport) {
  if (!target || !scrollport?.getBoundingClientRect) return 0;

  const targetRect = target.getBoundingClientRect();
  const scrollportRect = scrollport.getBoundingClientRect();
  const visibleTop = scrollportRect.top + (scrollport.clientTop || 0);
  const visibleBottom = visibleTop + scrollport.clientHeight;
  const delta = targetRect.bottom > visibleBottom
    ? targetRect.bottom - visibleBottom
    : targetRect.top < visibleTop
      ? targetRect.top - visibleTop
      : 0;
  if (!delta) return 0;

  const current = scrollport.scrollTop || 0;
  const maximum = Math.max(0, scrollport.scrollHeight - scrollport.clientHeight);
  const next = Math.max(0, Math.min(maximum, current + delta));
  const applied = next - current;
  if (applied) scrollport.scrollTop = next;
  return applied;
}
