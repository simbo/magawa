import { Component, h, VNode } from 'preact';

import { IconName } from '../lib/icon-name.enum';
import { Icon } from './icon';

interface FlagsProps {
  flagsCount: number;
  minesCount: number;
}

export class Flags extends Component<FlagsProps> {
  public render({ flagsCount, minesCount }: FlagsProps): VNode {
    return (
      <div class="c-flags">
        <div className="c-flags__label">
          {flagsCount}/{minesCount}
        </div>
        <div className="c-flags__icon">
          <Icon name={IconName.FlagOnGreen}></Icon>
        </div>
      </div>
    );
  }
}
