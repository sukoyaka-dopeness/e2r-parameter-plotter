import {restoreDocumentScroll, revealInDocument} from './viewport-scroll.js';

const navigationTypes = [
  {type: 'primary', attribute: 'data-primary-step', group: '.entity-pager'},
  {type: 'waiting', attribute: 'data-waiting-step', group: '.entity-pager'},
  {type: 'matrix', attribute: 'data-matrix-page', group: '.matrix-nav'},
];

export function headerNavigationFocusRequest(button, event) {
  if (event.detail !== 0 || !button.closest('.view-control')) return null;
  for (const navigation of navigationTypes) {
    if (button.hasAttribute(navigation.attribute) && button.closest(navigation.group)) {
      return {type: navigation.type, step: button.getAttribute(navigation.attribute)};
    }
  }
  return null;
}

export function restoreHeaderNavigationFocus(root, request, {scrollSnapshot=null, documentObject=globalThis.document}={}) {
  const navigation = navigationTypes.find(item => item.type === request?.type);
  if (!navigation) return false;
  const group = root.querySelector(`.view-control ${navigation.group}`);
  if (!group) return false;
  const controls = [...group.querySelectorAll(`[${navigation.attribute}]`)];
  const sameDirection = controls.find(button => button.getAttribute(navigation.attribute) === request.step);
  const target = sameDirection && !sameDirection.disabled
    ? sameDirection
    : controls.find(button => !button.disabled);
  if (!target) return false;
  if (scrollSnapshot) restoreDocumentScroll(scrollSnapshot);
  target.focus({preventScroll: true});
  if (scrollSnapshot) {
    // Root replacement can change browser scroll anchoring even when the new
    // control is focused with preventScroll. Restore the prior page position,
    // then reveal only if the focused control is no longer visible.
    restoreDocumentScroll(scrollSnapshot);
    revealInDocument(target, documentObject);
  }
  return true;
}
