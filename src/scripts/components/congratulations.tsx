import { Component, h, VNode } from 'preact';

import { formatDifficulty } from '../lib/format-difficulty.function';
import { formatDuration } from '../lib/format-duration.function';
import { Highscore, HighscoreGameDifficulty } from '../lib/highscores';
import { IconName } from '../lib/icon-name.enum';

interface CongratulationsProps {
  highscore?: Highscore;
  difficulty: HighscoreGameDifficulty;
}

export class Congratulations extends Component<CongratulationsProps> {
  public render({ highscore, difficulty }: CongratulationsProps): VNode {
    return (
      <div class="c-congratulations">
        <div class="c-congratulations__title">
          <img class="e-icon" src={`icons/${IconName.Party}.png`} /> Congratulations!
        </div>
        {highscore ? (
          <div class="c-congratulations__text">
            You won in <strong>{formatDuration(highscore.time)}</strong> claiming rank <strong>{highscore.rank}</strong>{' '}
            in highscores for difficulty <em>{formatDifficulty(difficulty)}</em>.
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
