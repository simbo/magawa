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
        <h1 className="c-menu-view__title e-title e-title--with-subtitle">
          Magawa <Icon name={IconName.Magawa} />
        </h1>
        <p className="e-subtitle">A Minesweeper Clone.</p>
        <MenuForm />
        <Link
          href={AppRoute.Highscores}
          class="c-menu-view__button e-button e-button--block"
        >
          Highscores
          <Icon name={IconName.Trophy} />
        </Link>
        <Link
          href={AppRoute.About}
          class="c-menu-view__button e-button e-button--block"
        >
          About
          <Icon name={IconName.Book} />
        </Link>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=UHNHNPFVD32U8"
          target="_blank"
          class="c-menu-view__button e-button e-button--block"
        >
          Donate
          <Icon name={IconName.Money} />
        </a>
      </div>
    );
  }
}
