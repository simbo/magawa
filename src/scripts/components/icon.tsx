import { Component, h, VNode } from 'preact';

import { IconName } from '../lib/icon-name.enum';

interface IconProps {
  name: IconName;
  title?: string;
}

export class Icon extends Component<IconProps> {
  private readonly iconNameMap = Object.entries(IconName).reduce(
    (map, [key, value]) => ({ ...map, [value]: key }),
    {} as { [key: string]: string }
  );

  public render({ name, title }: IconProps): VNode {
    const alt = title && title.length ? title : this.iconNameMap[name];
    const titleAttr = title && title.length ? title : false;
    return (
      <div class="c-icon">
        <img
          src={`icons/${name}.png`}
          {...(titleAttr ? { title: titleAttr } : {})}
          alt={alt}
        />
      </div>
    );
  }
}
