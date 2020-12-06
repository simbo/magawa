import { Component, h, JSX, VNode } from 'preact';
import { take } from 'rxjs/operators';

import { gameDifficultySettings } from '../lib/game-difficulty-settings';
import { GameDifficulty } from '../lib/game-difficulty.enum';
import { IconName } from '../lib/icon-name.enum';
import { GameActions } from '../store/game/game-actions';
import { gameStore } from '../store/game/game-store';
import { Icon } from './icon';

interface GameMenuState {
  difficulty: GameDifficulty;
  tilesX: number;
  tilesY: number;
  minesCount: number;
}

export class GameMenu extends Component<{}, GameMenuState> {
  private readonly difficulties = Object.entries(GameDifficulty);

  private readonly minTilesX: number;
  private readonly minTilesY: number;
  private readonly minMinesCount: number;
  private readonly maxTilesX: number;
  private readonly maxTilesY: number;
  private readonly maxMinesCount: number;

  constructor(props: never, state: GameMenuState) {
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
      .subscribe(({ difficulty, tilesX, tilesY, minesCount }) =>
        this.setState({ difficulty, tilesX, tilesY, minesCount })
      );
  }

  public render(
    props: never,
    { difficulty, tilesX, tilesY, minesCount }: GameMenuState
  ): VNode {
    const readonly = difficulty !== GameDifficulty.Custom;
    return (
      <div class="c-game-menu">
        <form class="c-game-menu__form" onSubmit={this.onSubmit}>
          <div className="c-game-menu__row">
            <label htmlFor="difficulty" class="c-game-menu__label">
              Difficulty
            </label>
            <select
              class="c-game-menu__select"
              id="difficulty"
              name="difficulty"
              onChange={this.onChangeDifficulty}
            >
              {this.difficulties.map(([key, value]) => (
                <option
                  value={value}
                  selected={difficulty === value}
                  class="c-game-menu__option"
                >
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="c-game-menu__row">
            <label htmlFor="tilesX" class="c-game-menu__label">
              Width
            </label>
            <input
              class="c-game-menu__input"
              id="tilesX"
              name="tilesX"
              type={readonly ? 'text' : 'number'}
              min={this.minTilesX}
              max={this.maxTilesX}
              value={tilesX}
              readOnly={readonly}
            />
          </div>
          <div className="c-game-menu__row">
            <label htmlFor="tilesY" class="c-game-menu__label">
              Height
            </label>
            <input
              class="c-game-menu__input"
              id="tilesY"
              name="tilesY"
              type={readonly ? 'text' : 'number'}
              min={this.minTilesY}
              max={this.maxTilesY}
              value={tilesY}
              readOnly={readonly}
            />
          </div>
          <div className="c-game-menu__row">
            <label htmlFor="minesCount" class="c-game-menu__label">
              Mines
            </label>
            <input
              class="c-game-menu__input"
              id="minesCount"
              name="minesCount"
              type={readonly ? 'text' : 'number'}
              min={this.minMinesCount}
              max={this.maxMinesCount}
              value={minesCount}
              readOnly={readonly}
            />
          </div>
          <div className="c-game-menu__buttons">
            <button class="c-game-menu__button" type="submit">
              Start
              <Icon name={IconName.Magawa} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  private readonly onSubmit = (event: Event): void => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity()) {
      const data = new FormData(form);
      GameActions.start(data.get('difficulty') as GameDifficulty, {
        tilesX: parseInt(data.get('tilesX') as string, 10),
        tilesY: parseInt(data.get('tilesY') as string, 10),
        minesCount: parseInt(data.get('minesCount') as string, 10)
      });
    }
  };

  private readonly onChangeDifficulty = (
    event: JSX.TargetedEvent<HTMLSelectElement, Event>
  ): void => {
    const difficulty: GameDifficulty = event.currentTarget
      .value as GameDifficulty;
    if (difficulty === GameDifficulty.Custom) {
      this.setState({ difficulty });
    } else {
      const { tilesX, tilesY, minesCount } = gameDifficultySettings[difficulty];
      this.setState({ difficulty, tilesX, tilesY, minesCount });
    }
  };
}
