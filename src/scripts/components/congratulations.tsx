import { Component, h, VNode } from 'preact';

import { formatDifficulty } from '../lib/format-difficulty.function';
import { formatDuration } from '../lib/format-duration.function';
import { Highscore, HighscoreGameDifficulty } from '../lib/highscores';
import { IconName } from '../lib/icon-name.enum';

/**
 * Winning difficulty and optional saved highscore shown after a victory.
 */
interface CongratulationsProps {
  highscore?: Highscore;
  difficulty: HighscoreGameDifficulty;
}

/**
 * Displays the winning time and rank once a highscore has been saved.
 */
export class Congratulations extends Component<CongratulationsProps> {
  /**
   * Displays congratulations and, when available, the saved time and leaderboard rank.
   */
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
