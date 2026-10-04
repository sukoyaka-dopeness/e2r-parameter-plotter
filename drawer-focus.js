const focusable = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function containDrawerFocus(event, root) {
  const drawer = root.querySelector('.drawer.is-open');
  if (!drawer || event.key !== 'Tab') return false;
  const controls = [...drawer.querySelectorAll(focusable)].filter(el => el.getClientRects().length);
  if (!controls.length) { event.preventDefault(); drawer.focus(); return true; }
  const first = controls[0], last = controls.at(-1);
  if (!drawer.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); return true; }
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); return true; }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); return true; }
  return false;
}

export function focusDrawer(root) {
  root.querySelector('.drawer.is-open .drawer-head button')?.focus();
}
