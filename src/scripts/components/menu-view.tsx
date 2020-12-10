import { Component, h, VNode } from 'preact';
import { Link } from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';
import { IconName } from '../lib/icon-name.enum';
import { Icon } from './icon';
import { MenuForm } from './menu-form';

export class MenuView extends Component {
  public render(): VNode {
    return (
      <div class="c-menu-view">
        <MenuForm />
        <Link
          href={AppRoute.Highscores}
          class="c-menu-view__button e-button e-button--block"
        >
          Highscores
          <Icon name={IconName.Trophy} />
        </Link>
      </div>
    );
  }
}
