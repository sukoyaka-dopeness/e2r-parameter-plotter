function plotContextTrigger(root, context) {
  if(!root||!context?.id)return null;
  const isLabel=context.trigger==='label',attribute=isLabel?'selectEntity':'point';
  const selector=isLabel?'[data-select-entity]':'[data-point]';
  return [...root.querySelectorAll(selector)].find(element=>element.dataset[attribute]===context.id);
}

export function placePlotContextMenuAfterTrigger(root, context) {
  const menu=root?.querySelector('.plot-context-menu');
  const trigger=plotContextTrigger(root,context);
  if(!menu||!trigger)return null;
  trigger.after(menu);
  return trigger;
}

export function closePlotContextMenu(root, context, {restoreFocus=false}={}) {
  const menu=root?.querySelector('.plot-context-menu');
  menu?.remove();
  if(!restoreFocus||!context?.id)return false;
  const trigger=plotContextTrigger(root,context);
  if(!trigger)return false;
  trigger.focus({preventScroll:true});
  return true;
}
