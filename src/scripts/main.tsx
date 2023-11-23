import '../styles/main.scss';

import { h, render } from 'preact';

import { App } from './components/app';
import { SvgIcon } from './custom-elements/svg-icon/svg-icon';

customElements.define('svg-icon', SvgIcon);

document.body.classList.remove('loading');

render(<App />, document.body);
