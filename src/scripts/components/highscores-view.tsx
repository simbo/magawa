import { Component, createRef, h, VNode } from 'preact';
import { Link } from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';
import { formatDate } from '../lib/format-date.function';
import { DEFAULT_GAME_DIFFICULTY, GameDifficulty } from '../lib/game-difficulty';
import { highscoresManager } from '../lib/highscores-manager';
import { HighscoreGameDifficulty, HighscoresList } from '../lib/highscores.interface';
import { IconName } from '../lib/icon-name.enum';

import { HighscoresTable } from './highscores-table';

interface HighscoresViewState {
  difficulty: HighscoreGameDifficulty;
  player: string;
  list?: HighscoresList | null;
  updated?: Date | null;
}

export class HighscoresView extends Component<object, HighscoresViewState> {
  private readonly difficulties = Object.entries(GameDifficulty).filter(
    ([, value]) => typeof value === 'number' && value !== GameDifficulty.Custom
  ) as [string, HighscoreGameDifficulty][];

  private readonly refSelect = createRef<HTMLSelectElement>();
  private readonly refInput = createRef<HTMLInputElement>();

  constructor(props: object, state: HighscoresViewState) {
    super(props, state);
    const difficulty = DEFAULT_GAME_DIFFICULTY;
    const player = '';
    this.setState({ difficulty, player });
    this.request(difficulty, player);
  }

  public render(_props: object, { difficulty, player, list, updated }: HighscoresViewState): VNode {
    return (
      <div class="c-highscores-view">
        <h1 class="c-highscores-view__title e-title">
          Highscores <img class="e-icon" src={`icons/${IconName.Trophy}.png`} />
        </h1>
        <div class="c-highscores-view__options">
          <div class="c-highscores-view__option">
            <label class="c-highscores-view__label e-label" htmlFor="difficulty">
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
                <option class="c-highscores-view__option e-option" value={value} selected={difficulty === value}>
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
        {updated ? <div class="c-highscores-view__updated">Updated at {formatDate(updated)}</div> : ''}
        <div className="e-back-button">
          <Link href={AppRoute.Home} class="e-back-button__button e-button">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  private readonly onChange = (event: Event): void => {
    event.preventDefault();
    const difficulty = Number.parseInt(`${this.refSelect.current?.value}`, 10);
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
