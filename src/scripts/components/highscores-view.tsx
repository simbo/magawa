import { Component, createRef, h, VNode } from 'preact';
import { Link } from 'preact-router';

import { AppRoute } from '../lib/app-route.enum';
import { DEFAULT_GAME_DIFFICULTY, GameDifficulty } from '../lib/game-difficulty';
import { getHighscores, HighscoreGameDifficulty, HighscoresCollection } from '../lib/highscores';
import { IconName } from '../lib/icon-name.enum';

import { HighscoresTable } from './highscores-table';

interface HighscoresViewState {
  difficulty: HighscoreGameDifficulty;
  collection?: HighscoresCollection;
  page: number;
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
    const page = 1;
    this.setState({ difficulty, page });
    this.request(difficulty, page, player);
  }

  public render(_props: object, { difficulty, collection }: HighscoresViewState): VNode {
    const { items, total, page, pages, nextPage, previousPage } = (collection as HighscoresCollection) || {};
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
              onInput={this.onChangeOptions}
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
            <form onSubmit={this.onChangeOptions}>
              <label class="c-highscores-view__label e-label" htmlFor="player">
                Player
              </label>
              <input
                ref={this.refInput}
                id="player"
                name="player"
                pattern="^[\w*?]*$"
                class="c-highscores-view__input e-input"
              />
            </form>
          </div>
        </div>
        <div class="c-highscores-view__table">
          <HighscoresTable rows={items} highlight="CrjD8A1cqGjxtpVT70aMM" />
          {page && pages ? (
            <div class="c-highscores-view__pagination">
              <div>
                <button
                  disabled={!previousPage}
                  onClick={() => this.changePage(previousPage as number)}
                  title={`Page ${previousPage}`}
                >
                  ◀
                </button>
              </div>
              <div>{total} Entries</div>
              <div>
                Page {page} of {pages}
              </div>
              <div>
                <button
                  disabled={!nextPage}
                  onClick={() => this.changePage(nextPage as number)}
                  title={`Page ${nextPage}`}
                >
                  ▶
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="e-back-button">
          <Link href={AppRoute.Home} class="e-back-button__button e-button">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  private readonly onChangeOptions = (event: Event): void => {
    event.preventDefault();
    const difficulty = Number.parseInt(`${this.refSelect.current?.value}`, 10);
    const player = this.refInput.current?.value;
    const page = this.state.page;
    this.request(difficulty, page, player);
  };

  private readonly changePage = (page: number) => {
    const difficulty = Number.parseInt(`${this.refSelect.current?.value}`, 10);
    const player = this.refInput.current?.value;
    this.request(difficulty, page, player);
  };

  private request(difficulty: HighscoreGameDifficulty, page: number, player?: string): void {
    this.setState({ difficulty, collection: undefined });
    getHighscores({ difficulty, player, page })
      .then(collection => {
        this.setState({ difficulty, collection });
      })
      .catch(() => {
        this.setState({ difficulty, collection: { items: [] } as unknown as HighscoresCollection });
      });
  }
}
