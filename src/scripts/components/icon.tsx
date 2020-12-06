import { Component, h, VNode } from 'preact';

import { IconName } from '../lib/icon-name.enum';

interface IconProps {
  name: IconName;
}

export class Icon extends Component<IconProps> {
  public render({ name }: IconProps): VNode {
    return (
      <div class="c-icon">
        <img src={`icons/${name}.png`} alt="" />
      </div>
    );
  }
}
