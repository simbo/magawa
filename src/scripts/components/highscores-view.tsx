import { Component, createRef, h, VNode } from 'preact';

import { formatDate } from '../lib/format-date.function';
import { DEFAULT_GAME_DIFFICULTY } from '../lib/game-difficulty-settings';
import { GameDifficulty } from '../lib/game-difficulty.enum';
import { highscoresManager } from '../lib/highscores-manager';
import {
  HighscoreGameDifficulty,
  HighscoresList
} from '../lib/highscores.interface';
import { IconName } from '../lib/icon-name.enum';
import { toNumber } from '../lib/to-number.function';
import { BackButton } from './back-button';
import { HighscoresTable } from './highscores-table';
import { Icon } from './icon';

interface HighscoresViewState {
  difficulty: HighscoreGameDifficulty;
  player: string;
  list?: HighscoresList | null;
  updated?: Date | null;
}

export class HighscoresView extends Component<{}, HighscoresViewState> {
  private readonly difficulties = Object.entries(GameDifficulty).filter(
    ([key, value]) =>
      typeof value === 'number' && value !== GameDifficulty.Custom
  ) as [string, HighscoreGameDifficulty][];

  private readonly refSelect = createRef<HTMLSelectElement>();
  private readonly refInput = createRef<HTMLInputElement>();

  constructor(props: never, state: HighscoresViewState) {
    super(props, state);
    const difficulty = DEFAULT_GAME_DIFFICULTY;
    const player = '';
    this.setState({ difficulty, player });
    this.request(difficulty, player);
  }

  public render(
    props: never,
    { difficulty, player, list, updated }: HighscoresViewState
  ): VNode {
    return (
      <div class="c-highscores-view">
        <h1 class="c-highscores-view__title e-title">
          Highscores <Icon name={IconName.Trophy} />
        </h1>
        <div class="c-highscores-view__options">
          <div class="c-highscores-view__option">
            <label
              class="c-highscores-view__label e-label"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              ref={this.refSelect}
              onChange={this.onChange}
              class="c-highscores-view__select e-select"
              id="difficulty"
              name="difficulty"
            >
              {this.difficulties.map(([key, value]) => (
                <option
                  class="c-highscores-view__option e-option"
                  value={value}
                  selected={difficulty === value}
                >
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div class="c-highscores-view__option">
            <label class="c-highscores-view__label e-label" htmlFor="player">
              Player
            </label>
            <input
              ref={this.refInput}
              onChange={this.onChange}
              id="player"
              name="player"
              pattern="^\w*$"
              class="c-highscores-view__input e-input"
              value={player}
            />
          </div>
        </div>
        <div class="c-highscores-view__table">
          <HighscoresTable list={list} highlight="CrjD8A1cqGjxtpVT70aMM" />
        </div>
        {updated ? (
          <div class="c-highscores-view__updated">
            Updated at {formatDate(updated)}
          </div>
        ) : (
          ''
        )}
        <BackButton />
      </div>
    );
  }

  private readonly onChange = (event: Event) => {
    event.preventDefault();
    const difficulty = toNumber(this.refSelect.current?.value);
    const player = this.refInput.current?.value;
    this.request(difficulty, player);
  };

  private request(difficulty: HighscoreGameDifficulty, player?: string): void {
    highscoresManager.get(difficulty, player).subscribe(
      ({ list, updated }) => {
        this.setState({ difficulty, player, list, updated });
      },
      err => {
        console.error(err);
        this.setState({ difficulty, player, list: null, updated: null });
      }
    );
  }
}
