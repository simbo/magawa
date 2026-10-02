import '../styles/main.scss';

import { render } from 'preact';

import { App } from './components/app';
import { SvgIcon } from './custom-elements/svg-icon/svg-icon';
import { DevMode } from './lib/dev-mode';

/**
 * Bootstraps the app by clearing the initial loading state, registering SVG icons,
 * and installing the developer-mode keyboard handler before mounting the root component.
 */
globalThis.document.documentElement.classList.remove('page-loading');

globalThis.customElements.define('svg-icon', SvgIcon);

globalThis.document.addEventListener('keydown', event => {
  DevMode.handleKeyEvent(event);
});

render(<App />, globalThis.document.body);
