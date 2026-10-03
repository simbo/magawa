beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
});

/**
 * Simulates one key of the documented modifier sequence.
 *
 * @param code
 * @param modifiers
 */
function key(code: string, modifiers = true) {
  return new KeyboardEvent('keydown', { code, ctrlKey: modifiers, altKey: modifiers, shiftKey: modifiers });
}

test('persists toggles before notifying listeners', async () => {
  const { DevMode } = await import('./dev-mode');
  const values: boolean[] = [];
  const listener = () => {
    values.push(DevMode.isEnabled());
  };
  globalThis.document.addEventListener(DevMode.CHANGE_EVENT_TYPE, listener);
  try {
    expect(DevMode.isEnabled()).toBe(false);
    DevMode.enable();
    DevMode.toggle();
    DevMode.toggle();
    DevMode.disable();
    expect(values).toEqual([true, false, true, false]);
  } finally {
    globalThis.document.removeEventListener(DevMode.CHANGE_EVENT_TYPE, listener);
  }
});

test('requires ordered modified keys and expires partial sequences', async () => {
  const { DevMode } = await import('./dev-mode');
  for (const code of ['KeyD', 'KeyE', 'KeyV']) DevMode.handleKeyEvent(key(code, false));
  expect(DevMode.isEnabled()).toBe(false);
  for (const code of ['KeyV', 'KeyE', 'KeyD']) DevMode.handleKeyEvent(key(code));
  expect(DevMode.isEnabled()).toBe(false);
  DevMode.handleKeyEvent(key('KeyD'));
  vi.advanceTimersByTime(3001);
  for (const code of ['KeyD', 'KeyX', 'KeyE', 'KeyV']) DevMode.handleKeyEvent(key(code));
  expect(DevMode.isEnabled()).toBe(true);
});
