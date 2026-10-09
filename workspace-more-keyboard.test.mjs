import assert from 'node:assert/strict';
import test from 'node:test';
import {focusFirstWorkspaceMoreItem, focusWorkspaceMoreOnOpen, handleWorkspaceMoreKeydown} from './workspace-more-keyboard.js';

function makeMenu({disabled = []} = {}) {
  const state = {activeElement: null};
  const items = [false, false].map((isDisabled, index) => ({
    disabled: disabled[index] ?? isDisabled,
    focus() { state.activeElement = this; },
  }));
  const summary = {focus() { state.activeElement = this; }};
  const details = {
    open: true,
    ownerDocument: state,
    matches: (selector) => selector === 'details.workspace-more',
    querySelector(selector) {
      if (selector === 'summary') return summary;
      if (selector === '.workspace-more-item:not(:disabled)') return items.find((item) => !item.disabled) ?? null;
      return null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, '.workspace-more-item:not(:disabled)');
      return items.filter((item) => !item.disabled);
    },
  };
  const target = {closest: (selector) => selector === 'details.workspace-more' ? details : null};
  return {details, items, summary, state, target};
}

function keyEvent(menu, key, modifiers = {}) {
  return {
    target: menu.target,
    key,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...modifiers,
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
  };
}

test('opening native disclosure focuses its first enabled menu action', () => {
  const menu = makeMenu({disabled: [true, false]});
  focusWorkspaceMoreOnOpen({target: menu.details});
  assert.equal(menu.state.activeElement, menu.items[1]);
  menu.details.open = false;
  focusWorkspaceMoreOnOpen({target: menu.details});
  assert.equal(menu.state.activeElement, menu.items[1]);
});

test('ArrowUp and ArrowDown cycle through enabled actions while Home and End jump to bounds', () => {
  const menu = makeMenu();
  focusFirstWorkspaceMoreItem(menu.details);
  for (const [key, expected] of [['ArrowDown', 1], ['ArrowDown', 0], ['ArrowUp', 1], ['Home', 0], ['End', 1]]) {
    const event = keyEvent(menu, key);
    assert.equal(handleWorkspaceMoreKeydown(event), true);
    assert.equal(event.defaultPrevented, true);
    assert.equal(menu.state.activeElement, menu.items[expected]);
  }
});

test('disabled menu actions are skipped and a single enabled action remains stable', () => {
  const menu = makeMenu({disabled: [false, true]});
  focusFirstWorkspaceMoreItem(menu.details);
  for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
    handleWorkspaceMoreKeydown(keyEvent(menu, key));
    assert.equal(menu.state.activeElement, menu.items[0]);
  }
});

test('Tab and Shift+Tab close the disclosure without preventing browser traversal', () => {
  for (const modifiers of [{}, {shiftKey: true}]) {
    const menu = makeMenu();
    const event = keyEvent(menu, 'Tab', modifiers);
    assert.equal(handleWorkspaceMoreKeydown(event), true);
    assert.equal(menu.details.open, false);
    assert.equal(event.defaultPrevented, false);
  }
});

test('Escape closes and restores trigger focus; Enter and Space remain native button activation', () => {
  const menu = makeMenu();
  const escape = keyEvent(menu, 'Escape');
  handleWorkspaceMoreKeydown(escape);
  assert.equal(menu.details.open, false);
  assert.equal(menu.state.activeElement, menu.summary);
  assert.equal(escape.defaultPrevented, true);

  for (const key of ['Enter', ' ']) {
    const activation = keyEvent(menu, key);
    assert.equal(handleWorkspaceMoreKeydown(activation), false);
    assert.equal(activation.defaultPrevented, false);
  }
});

test('modifier arrows and key events outside the open disclosure are not intercepted', () => {
  const menu = makeMenu();
  const modified = keyEvent(menu, 'ArrowDown', {altKey: true});
  assert.equal(handleWorkspaceMoreKeydown(modified), false);
  assert.equal(modified.defaultPrevented, false);
  assert.equal(handleWorkspaceMoreKeydown({...keyEvent(menu, 'ArrowDown'), target: {closest: () => null}}), false);
});
