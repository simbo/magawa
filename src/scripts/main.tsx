import '../styles/main.scss';

import { h, render } from 'preact';

import { App } from './components/app';
import { SvgIcon } from './custom-elements/svg-icon/svg-icon';
import { DevMode } from './lib/dev-mode';

/**
 * Bootstraps the app by clearing the initial loading state, registering SVG icons,
 * and installing the developer-mode keyboard handler before mounting the root component.
 */
document.documentElement.classList.remove('page-loading');

customElements.define('svg-icon', SvgIcon);

document.addEventListener('keydown', event => DevMode.handleKeyEvent(event));

render(<App />, document.body);
