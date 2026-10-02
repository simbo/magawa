import { storage } from './storage';

/**
 * Document event dispatched after the persisted developer-mode value changes.
 */
const CHANGE_EVENT_TYPE = 'dev-mode-changed';

/**
 * Persists developer mode before notifying document listeners of the new value.
 *
 * @param devMode - Whether developer mode should be enabled.
 */
function change(devMode: boolean): void {
  storage.set({ devMode });
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT_TYPE, { detail: { devMode } }));
}

/**
 * Enables and persists developer mode, then notifies listeners.
 */
function enable(): void {
  change(true);
}

/**
 * Disables and persists developer mode, then notifies listeners.
 */
function disable(): void {
  change(false);
}

/**
 * Reads the persisted developer-mode preference, defaulting to disabled.
 */
function isEnabled(): boolean {
  return !!storage.get({ devMode: false }).devMode;
}

/**
 * Inverts the persisted developer-mode preference and notifies listeners.
 */
function toggle(): void {
  if (isEnabled()) disable();
  else enable();
}

const triggerKeys = ['KeyD', 'KeyE', 'KeyV'];
const triggerTimespan = 3000;
let triggerTimeout = 0;
let pressedKeys: string[] = [];

/**
 * Persistent developer-mode controls and the keyboard sequence used to toggle mine visibility.
 */
export const DevMode = {
  change,
  enable,
  disable,
  isEnabled,
  toggle,
  /**
   * Recognizes D, E, V in order while Ctrl, Alt, and Shift are held.
   * Each accepted key resets a three-second timeout; completing the sequence toggles the mode.
   *
   * @param event - Keyboard event to check.
   */
  handleKeyEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.altKey && event.shiftKey && triggerKeys.includes(event.code)) {
      pressedKeys.push(event.code);
      window.clearTimeout(triggerTimeout);
      triggerTimeout = window.setTimeout(() => {
        pressedKeys = [];
      }, triggerTimespan);
      /**
       * Validates each three-key group in order and clears it after the attempt.
       * Other keys are ignored; only accepted trigger keys extend the timeout.
       */
      if (pressedKeys.length === triggerKeys.length) {
        let keysAreEqual = 0;
        for (let i = 0; i < triggerKeys.length; i++) {
          if (pressedKeys[i] === triggerKeys[i]) keysAreEqual++;
          else break;
        }
        if (keysAreEqual === triggerKeys.length) toggle();
        pressedKeys = [];
      }
    }
  },
  CHANGE_EVENT_TYPE
};
