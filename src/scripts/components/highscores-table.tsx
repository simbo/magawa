import { Component, h, VNode } from 'preact';

import { formatDate } from '../lib/format-date.function';
import { formatDifficulty } from '../lib/format-difficulty.function';
import { formatDuration } from '../lib/format-duration.function';
import { HighscoresList } from '../lib/highscores.interface';

interface HighscoresTableProps {
  list?: HighscoresList | null;
  highlight?: string;
}

export class HighscoresTable extends Component<HighscoresTableProps> {
  public render({ list, highlight }: HighscoresTableProps): VNode {
    return (
      <table class="c-highscores-table">
        <thead>
          <tr class="c-highscores-table__head-row">
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--rank">#</th>
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--name">Name</th>
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--difficulty">Difficulty</th>
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--time">Time</th>
          </tr>
        </thead>
        <tbody>
          {(list || []).map(({ id, rank, player, difficulty, time, date }) => (
            <tr
              title={`${player} 🏆 ${formatDate(date)}`}
              class={`c-highscores-table__row ${id === highlight ? 'c-highscores-table__row--highlight' : ''}`}
            >
              <td class="c-highscores-table__cell c-highscores-table__cell--rank">{rank}</td>
              <td class="c-highscores-table__cell c-highscores-table__cell--name">{player}</td>
              <td class="c-highscores-table__cell c-highscores-table__cell--difficulty">
                {formatDifficulty(difficulty)}
              </td>
              <td class="c-highscores-table__cell c-highscores-table__cell--time">{formatDuration(time)}</td>
            </tr>
          ))}
        </tbody>
        {!list || list.length === 0 ? (
          <tfoot>
            <tr class="c-highscores-table__foot-row">
              {list === null ? (
                <td colSpan={4} class="c-highscores-table__foot-cell c-highscores-table__foot-cell--error">
                  Error loading highscores.
                </td>
              ) : // eslint-disable-next-line unicorn/no-nested-ternary
              list === undefined ? (
                <td colSpan={4} class="c-highscores-table__foot-cell c-highscores-table__foot-cell--loading">
                  Loading...
                </td>
              ) : (
                <td colSpan={4} class="c-highscores-table__foot-cell c-highscores-table__foot-cell--empty">
                  No entries found.
                </td>
              )}
            </tr>
          </tfoot>
        ) : (
          ''
        )}
      </table>
    );
  }
}
