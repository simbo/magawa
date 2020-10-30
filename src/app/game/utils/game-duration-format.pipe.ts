import { Pipe, PipeTransform } from '@angular/core';

import { formatDuration } from './format-duration';


@Pipe({
  name: 'gameDurationFormat'
})
export class GameDurationFormatPipe implements PipeTransform {

  transform(duration: number | string, ...args: unknown[]): string {
    if (typeof duration !== 'number') {
      return duration;
    }
    return formatDuration(duration);
  }

}
