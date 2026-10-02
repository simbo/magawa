import { Component, type VNode } from 'preact';

import { formatDate } from '../lib/format-date.function';
import { formatDuration } from '../lib/format-duration.function';
import type { Highscore } from '../lib/highscores';

/**
 * Leaderboard rows and the optional entry ID to highlight. Undefined rows indicate loading.
 */
interface HighscoresTableProps {
  rows?: Highscore[];
  highlight?: string;
}

/**
 * Displays leaderboard rows with loading, empty, and highlighted-entry states.
 */
export class HighscoresTable extends Component<HighscoresTableProps> {
  /**
   * Formats leaderboard rows and distinguishes missing data from an empty result set.
   *
   * @param root0 - Component props or action input.
   * @param root0.rows - Leaderboard entries, or undefined while loading.
   * @param root0.highlight - Optional highscore ID to highlight.
   * @returns The rendered view.
   */
  public render({ rows, highlight }: HighscoresTableProps): VNode {
    return (
      <table class="c-highscores-table">
        <thead>
          <tr class="c-highscores-table__head-row">
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--rank">#</th>
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--name">Name</th>
            <th class="c-highscores-table__head-cell c-highscores-table__head-cell--time">Time</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map(({ id, rank, player, time, date }) => (
            <tr
              title={`${player} 🏆 ${formatDate(date)}`}
              class={`c-highscores-table__row ${id === highlight ? 'c-highscores-table__row--highlight' : ''}`}
            >
              <td class="c-highscores-table__cell c-highscores-table__cell--rank">{rank}</td>
              <td class="c-highscores-table__cell c-highscores-table__cell--name">{player}</td>
              <td class="c-highscores-table__cell c-highscores-table__cell--time">{formatDuration(time)}</td>
            </tr>
          ))}
        </tbody>
        {!rows || rows.length === 0 ? (
          <tfoot>
            <tr class="c-highscores-table__foot-row">
              {rows ? (
                <td colSpan={3} class="c-highscores-table__foot-cell c-highscores-table__foot-cell--empty">
                  No entries found.
                </td>
              ) : (
                <td colSpan={3} class="c-highscores-table__foot-cell c-highscores-table__foot-cell--loading">
                  Loading...
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
