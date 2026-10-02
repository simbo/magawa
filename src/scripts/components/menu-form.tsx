import { Component, createRef, type VNode } from 'preact';

import { AppRoute } from '../lib/app-route.enum';
import { GameDifficulty, gameDifficultySettings } from '../lib/game-difficulty';
import { route } from '../lib/hash-router';
import { GameAction } from '../store/game/game-actions';
import { gameStore } from '../store/game/game-store';

/**
 * Player name, selected difficulty, and editable board dimensions.
 */
interface MenuFormState {
  difficulty: GameDifficulty;
  tilesX: number;
  tilesY: number;
  minesCount: number;
  player: string | null;
}

/**
 * Collects and validates the player name and board settings before starting a game.
 */
export class MenuForm extends Component<object, MenuFormState> {
  /**
   * Filters out the reverse lookup entries emitted for numeric TypeScript enums.
   * Only named difficulty entries become selectable options.
   */
  private readonly difficulties = Object.entries(GameDifficulty).filter(([, value]) => typeof value === 'number') as [
    string,
    GameDifficulty,
  ][];

  private readonly refPlayerInput = createRef<HTMLInputElement>();

  private readonly minTilesX: number;
  private readonly minTilesY: number;
  private readonly minMinesCount: number;
  private readonly maxTilesX: number;
  private readonly maxTilesY: number;
  private readonly maxMinesCount: number;

  /**
   * Derives input limits from presets and reads the current settings once from the store.
   *
   * @param props - Initial component props.
   * @param state - Current game or component state.
   */
  public constructor(props: object, state: MenuFormState) {
    super(props, state);
    const settingsEasy = gameDifficultySettings[GameDifficulty.Easy];
    this.minTilesX = settingsEasy.tilesX;
    this.minTilesY = settingsEasy.tilesY;
    this.minMinesCount = settingsEasy.minesCount;
    const settingsCustom = gameDifficultySettings[GameDifficulty.Custom];
    this.maxTilesX = settingsCustom.tilesX;
    this.maxTilesY = settingsCustom.tilesY;
    this.maxMinesCount = settingsCustom.minesCount;
    const { difficulty, tilesX, tilesY, minesCount, player } = gameStore.state.peek();
    this.state = { difficulty, tilesX, tilesY, minesCount, player };
  }

  /**
   * Focuses the player-name input when the form becomes visible.
   */
  public override componentDidMount(): void {
    this.refPlayerInput.current.focus();
  }

  /**
   * Displays required player and board inputs; only custom dimensions are editable.
   *
   * @param _props - Component props, unused by this view.
   * @param root0 - Component props or action input.
   * @param root0.difficulty - Selected game difficulty.
   * @param root0.tilesX - Number of board columns.
   * @param root0.tilesY - Number of board rows.
   * @param root0.minesCount - Total number of mines to place.
   * @param root0.player - Player name associated with the game or query.
   * @returns The rendered view.
   */
  public render(_props: object, { difficulty, tilesX, tilesY, minesCount, player }: MenuFormState): VNode {
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
            value={player ?? ''}
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
              <option value={value} selected={difficulty === value} class="c-menu-form__option e-option">
                {key}
              </option>
            ))}
          </select>
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="tilesX" class="c-menu-form__label e-label">
            Width
          </label>
          {this.renderDimensionInput('tilesX', tilesX, this.minTilesX, this.maxTilesX, readonly)}
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="tilesY" class="c-menu-form__label e-label">
            Height
          </label>
          {this.renderDimensionInput('tilesY', tilesY, this.minTilesY, this.maxTilesY, readonly)}
        </div>
        <div class="c-menu-form__row">
          <label htmlFor="minesCount" class="c-menu-form__label e-label">
            Mines
          </label>
          {this.renderDimensionInput('minesCount', minesCount, this.minMinesCount, this.maxMinesCount, readonly)}
        </div>
        <button class="c-menu-form__button e-button e-button--block e-button--primary" type="submit">
          Start Game
        </button>
      </form>
    );
  }

  /**
   * Renders a preset as read-only text or custom settings as a numeric input.
   * Separate JSX branches retain Preact 11's discriminated input attribute types.
   *
   * @param name - Form field identifier.
   * @param value - Current setting value.
   * @param min - Smallest accepted custom value.
   * @param max - Largest accepted custom value.
   * @param readonly - Whether a preset prevents editing.
   * @returns The appropriate form input.
   */
  private renderDimensionInput(name: string, value: number, min: number, max: number, readonly: boolean): VNode {
    const props = {
      class: 'c-menu-form__input e-input',
      id: name,
      name,
      min,
      max,
      required: true,
      value,
      readOnly: readonly,
    };
    return readonly ? <input {...props} type="text" /> : <input {...props} type="number" />;
  }

  /**
   * Validates the form, dispatches parsed settings, and navigates to the game route.
   *
   * @param event - Browser event initiating this operation.
   */
  private readonly onSubmit = (event: Event): void => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity()) {
      const data = new FormData(form);
      gameStore.dispatch(GameAction.SetSettings, {
        player: data.get('player') as string,
        difficulty:
          this.difficulties.find(([, value]) => String(value) === data.get('difficulty'))?.[1] ?? GameDifficulty.Medium,
        settings: {
          tilesX: Number(data.get('tilesX')),
          tilesY: Number(data.get('tilesY')),
          minesCount: Number(data.get('minesCount')),
        },
      });
      route(AppRoute.Game);
    }
  };

  /**
   * Keeps custom dimensions or applies the selected preset while preserving the entered player name.
   *
   * @param event - Browser event initiating this operation.
   */
  private readonly onChangeDifficulty = (event: Event): void => {
    const selectedValue = (event.currentTarget as HTMLSelectElement).value;
    const difficulty: GameDifficulty =
      this.difficulties.find(([, value]) => String(value) === selectedValue)?.[1] ?? GameDifficulty.Medium;
    const player = this.refPlayerInput.current.value;
    if (difficulty === GameDifficulty.Custom) {
      this.setState(state => ({ ...state, difficulty, player }));
    } else {
      const { tilesX, tilesY, minesCount } = gameDifficultySettings[difficulty];
      this.setState({ difficulty, tilesX, tilesY, minesCount, player });
    }
  };
}
