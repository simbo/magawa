import { Component, h, VNode } from 'preact';

import { IconName } from '../lib/icon-name.enum';
import { BackButton } from './back-button';
import { Icon } from './icon';

export class AboutView extends Component {
  public render(): VNode {
    return (
      <div class="c-about-view">
        <h1 className="c-about-view__title e-title">
          About <Icon name={IconName.Book}></Icon>
        </h1>
        <h2>How to play</h2>
        <p>
          Mines are scattered throughout the board. To win the game, you must uncover all non-mined tiles of the board.
          Numbers on tiles will tell you how many of the adjacent tiles are mined. You can flag a tile if you suspect it
          to be mined – although flagged tiles are not required to win. The timer starts with the first click and stops
          when the game is lost or won.
        </p>
        <hr />
        <h2>Controls</h2>
        <dl>
          <dt>Uncover</dt>
          <dd>
            <Icon name={IconName.LeftClick} title="Left Click" />
          </dd>
        </dl>
        <dl>
          <dt>Flag</dt>
          <dd>
            <Icon name={IconName.RightClick} title="Right Click" />
          </dd>
          <dd>
            <kbd>⇧</kbd>+<Icon name={IconName.LeftClick} title="Left Click" />
          </dd>
          <dd>
            <kbd>Alt</kbd>+<Icon name={IconName.LeftClick} title="Left Click" />
          </dd>
          <dd>
            <kbd>Ctrl</kbd>+
            <Icon name={IconName.LeftClick} title="Left Click" />
          </dd>
          <dd>
            <kbd>⌘</kbd>+<Icon name={IconName.LeftClick} title="Left Click" />
          </dd>
        </dl>
        <dl>
          <dt>Pause</dt>
          <dd>
            <kbd>P</kbd>
          </dd>
          <dd>
            <kbd>Esc</kbd>
          </dd>
        </dl>
        <hr />
        <h2>Trivia</h2>
        <img class="c-about-view__image" src="images/magawa.jpg" alt="Magawa" title="Magawa" />
        <p>
          This game is named after the giant pouched rat <em>Magawa</em>, who received a gold medal in september 2020
          for its success and bravery in clearing mine fields in Cambodia.
        </p>
        <hr />
        <BackButton />
      </div>
    );
  }
}
