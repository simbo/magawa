import { Component, h, VNode } from 'preact';

import { formatDifficulty } from '../lib/format-difficulty.function';
import { formatDuration } from '../lib/format-duration.function';
import { HighscoresEntry } from '../lib/highscores.interface';
import { IconName } from '../lib/icon-name.enum';
import { Icon } from './icon';

interface CongratulationsProps {
  entry?: HighscoresEntry;
}

export class Congratulations extends Component<CongratulationsProps> {
  public render({ entry }: CongratulationsProps): VNode {
    return (
      <div class="c-congratulations">
        <div class="c-congratulations__title">
          <Icon name={IconName.Party} /> Congratulations!
        </div>
        {entry ? (
          <div class="c-congratulations__text">
            You won in <strong>{formatDuration(entry.time)}</strong> claiming rank <strong>{entry.rank}</strong> in
            highscores for difficulty <em>{formatDifficulty(entry.difficulty)}</em>.
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
