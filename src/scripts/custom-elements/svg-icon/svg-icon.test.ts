import { waitFor } from '@testing-library/preact';

import { ICON_NAME_ATTRIBUTE, SvgIcon } from './svg-icon';

beforeAll(() => {
  globalThis.customElements.define('test-svg-icon', SvgIcon);
});

test.each(['sun', 'moon', 'github'])('loads bundled %s markup and reuses it across instances', async name => {
  const icon = globalThis.document.createElement('test-svg-icon');
  globalThis.document.body.append(icon);
  icon.setAttribute(ICON_NAME_ATTRIBUTE, name);
  await waitFor(() => {
    expect(icon.querySelector('svg')).toBeTruthy();
  });
  const second = globalThis.document.createElement('test-svg-icon');
  globalThis.document.body.append(second);
  second.setAttribute(ICON_NAME_ATTRIBUTE, name);
  await waitFor(() => {
    expect(second.querySelector('svg')?.outerHTML).toBe(icon.querySelector('svg')?.outerHTML);
  });
  const markup = icon.querySelector('svg')?.outerHTML;
  icon.setAttribute(ICON_NAME_ATTRIBUTE, '');
  icon.setAttribute('title', 'unchanged');
  expect(icon.querySelector('svg')?.outerHTML).toBe(markup);
  icon.remove();
  second.remove();
});
