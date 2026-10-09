export function focusFirstWorkspaceMoreItem(details) {
  const first = details?.querySelector('.workspace-more-item:not(:disabled)');
  first?.focus();
  return first ?? null;
}

export function focusWorkspaceMoreOnOpen(event) {
  const details = event.target;
  if (!details?.matches?.('details.workspace-more') || !details.open) return;
  focusFirstWorkspaceMoreItem(details);
}

export function handleWorkspaceMoreKeydown(event) {
  const details = event.target?.closest?.('details.workspace-more');
  if (!details?.open) return false;

  if (event.key === 'Tab') {
    details.open = false;
    return true;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    details.open = false;
    details.querySelector('summary')?.focus();
    return true;
  }

  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return false;

  const items = [...details.querySelectorAll('.workspace-more-item:not(:disabled)')];
  if (!items.length) return false;

  const currentIndex = items.indexOf(details.ownerDocument?.activeElement);
  let nextIndex = null;
  if (event.key === 'ArrowDown') {
    nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
  } else if (event.key === 'ArrowUp') {
    nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = items.length - 1;
  }

  if (nextIndex === null) return false;
  event.preventDefault();
  items[nextIndex]?.focus();
  return true;
}
