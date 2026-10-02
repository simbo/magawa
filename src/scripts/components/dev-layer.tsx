import { Component, type VNode } from 'preact';

/**
 * Displays a persistent visual indicator while developer mode is enabled.
 */
export class DevLayer extends Component {
  /**
   * Displays the ninja indicator at the position defined by the developer-layer stylesheet.
   *
   * @returns The rendered view.
   */
  public render(): VNode {
    return (
      <div class="dev-layer">
        <span title="Dev Mode enabled">🥷</span>
      </div>
    );
  }
}
