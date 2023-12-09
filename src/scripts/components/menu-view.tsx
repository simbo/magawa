import { compareAsc } from 'date-fns';
import { Component, h, VNode } from 'preact';
import { Link } from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';
import { IconName } from '../lib/icon-name.enum';

import { MenuForm } from './menu-form';

const SHOW_FIXED_BADGE = compareAsc(new Date(), new Date('11 Feb 2024 GMT')) === -1;

export class MenuView extends Component {
  public render(): VNode {
    return (
      <div class="c-menu-view">
        <h1 className="c-menu-view__title e-title e-title--with-subtitle">
          Magawa <img class="e-icon" src={`icons/${IconName.Magawa}.png`} />
        </h1>
        <p className="e-subtitle">A Minesweeper Clone.</p>
        <MenuForm />
        <Link
          href={AppRoute.Highscores}
          class={`c-menu-view__button e-button e-button--block${SHOW_FIXED_BADGE ? ' is-fixed' : ''}`}
        >
          Highscores <img class="e-icon" src={`icons/${IconName.Trophy}.png`} />
        </Link>
        <Link href={AppRoute.About} class="c-menu-view__button e-button e-button--block">
          About <img class="e-icon" src={`icons/${IconName.Book}.png`} />
        </Link>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=UHNHNPFVD32U8"
          target="_blank"
          class="c-menu-view__button e-button e-button--block"
        >
          Donate <img class="e-icon" src={`icons/${IconName.Money}.png`} />
        </a>
      </div>
    );
  }
}
