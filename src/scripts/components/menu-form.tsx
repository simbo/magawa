import { Component, createRef, h, JSX, VNode } from 'preact';
import { route } from 'preact-router';
import { take } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { gameDifficultySettings } from '../lib/game-difficulty-settings';
import { GameDifficulty } from '../lib/game-difficulty.enum';
import { toNumber } from '../lib/to-number.function';
import { GameAction } from '../store/game/game-actions';
import { gameStore } from '../store/game/game-store';

interface MenuFormState {
  difficulty: GameDifficulty;
  tilesX: number;
  tilesY: number;
  minesCount: number;
  player: string | null;
}

export class MenuForm extends Component<{}, MenuFormState> {
  private readonly difficulties = Object.entries(GameDifficulty).filter(
    ([key, value]) => typeof value === 'number'
  ) as [string, GameDifficulty][];

  private readonly refPlayerInput = createRef<HTMLInputElement>();

  private readonly minTilesX: number;
  private readonly minTilesY: number;
  private readonly minMinesCount: number;
  private readonly maxTilesX: number;
  private readonly maxTilesY: number;
  private readonly maxMinesCount: number;

  constructor(props: never, state: MenuFormState) {
    super(props, state);
    const settingsEasy = gameDifficultySettings[GameDifficulty.Easy];
    this.minTilesX = settingsEasy.tilesX;
    this.minTilesY = settingsEasy.tilesY;
    this.minMinesCount = settingsEasy.minesCount;
    const settingsCustom = gameDifficultySettings[GameDifficulty.Custom];
    this.maxTilesX = settingsCustom.tilesX;
    this.maxTilesY = settingsCustom.tilesY;
    this.maxMinesCount = settingsCustom.minesCount;
    gameStore.state$
      .pipe(take(1))
      .subscribe(({ difficulty, tilesX, tilesY, minesCount, player }) =>
        this.setState({ difficulty, tilesX, tilesY, minesCount, player })
      );
  }

  public componentDidMount(): void {
    this.refPlayerInput.current?.focus();
  }

  public render(
    props: never,
    { difficulty, tilesX, tilesY, minesCount, player }: MenuFormState
  ): VNode {
    const readonly = difficulty !== GameDifficulty.Custom;
    return (
      <form class="c-menu-form" onSubmit={this.onSubmit}>
        <div class="c-menu-form__row">
          <label htmlFor="player" class="c-menu-form__label e-label">
            Your Name
          </label>
          <input
            class="c-menu-form__input e-input"
            id="player"
            name="player"
            type="text"
            pattern="^\w+$"
            required
            value={player || ''}
            ref={this.refPlayerInput}
          />
        </div>{' '}
        <div class="c-menu-form__row">
          <label htmlFor="difficulty" class="c-menu-form__label e-label">
            Difficulty
          </label>
          <select
            class="c-menu-form__select e-select"
            id="difficulty"
            name="difficulty"
            onChange={this.onChangeDifficulty}
          >
            {this.difficulties.map(([key, value]) => (
              <option
                value={value}
                selected={difficulty === value}
                class="c-menu-form__option e-option"
              >
                {key}
              </option>
            ))}
          </select>
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="tilesX" class="c-menu-form__label e-label">
            Width
          </label>
          <input
            class="c-menu-form__input e-input"
            id="tilesX"
            name="tilesX"
            type={readonly ? 'text' : 'number'}
            min={this.minTilesX}
            max={this.maxTilesX}
            required
            value={tilesX}
            readOnly={readonly}
          />
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="tilesY" class="c-menu-form__label e-label">
            Height
          </label>
          <input
            class="c-menu-form__input e-input"
            id="tilesY"
            name="tilesY"
            type={readonly ? 'text' : 'number'}
            min={this.minTilesY}
            max={this.maxTilesY}
            required
            value={tilesY}
            readOnly={readonly}
          />
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="minesCount" class="c-menu-form__label e-label">
            Mines
          </label>
          <input
            class="c-menu-form__input e-input"
            id="minesCount"
            name="minesCount"
            type={readonly ? 'text' : 'number'}
            min={this.minMinesCount}
            max={this.maxMinesCount}
            required
            value={minesCount}
            readOnly={readonly}
          />
        </div>
        <button
          class="c-menu-form__button e-button e-button--block e-button--primary"
          type="submit"
        >
          Start Game
        </button>
      </form>
    );
  }

  private readonly onSubmit = (event: Event): void => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity()) {
      const data = new FormData(form);
      gameStore.dispatch(GameAction.SetSettings, {
        player: data.get('player') as string,
        difficulty: toNumber(data.get('difficulty')),
        settings: {
          tilesX: toNumber(data.get('tilesX')),
          tilesY: toNumber(data.get('tilesY')),
          minesCount: toNumber(data.get('minesCount'))
        }
      });
      route(AppRoute.Game);
    }
  };

  private readonly onChangeDifficulty = (
    event: JSX.TargetedEvent<HTMLSelectElement, Event>
  ): void => {
    const difficulty: GameDifficulty = toNumber(event.currentTarget.value);
    const player = this.refPlayerInput.current?.value;
    if (difficulty === GameDifficulty.Custom) {
      this.setState(state => ({ ...state, difficulty, player }));
    } else {
      const { tilesX, tilesY, minesCount } = gameDifficultySettings[difficulty];
      this.setState({ difficulty, tilesX, tilesY, minesCount, player });
    }
  };
}
