import { Component, h, VNode } from 'preact';
import { Link } from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';

export class BackButton extends Component {
  public render(): VNode {
    return (
      <div className="c-back-button">
        <Link href={AppRoute.Home} class="c-back-button__button e-button">
          ← Back
        </Link>
      </div>
    );
  }
}
