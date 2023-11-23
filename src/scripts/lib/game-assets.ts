import { Assets, Texture } from 'pixi.js';

import { IconName } from './icon-name.enum';

export type ResourceName = IconName;
export interface Resource {
  name: ResourceName;
  src: string;
}

/**
 * Initialize pixi assets
 */
Assets.init({
  basePath: document.head.baseURI
});

/**
 * Names of available assets
 */
export enum Asset {
  Boom = IconName.Boom,
  Flag = IconName.Flag
}

/**
 * Asset names with corresponding relative path
 */
const ASSETS = [
  { name: IconName.Boom, src: 'icons/boom.png' },
  { name: IconName.Flag, src: 'icons/flag.png' }
];

for (const asset of ASSETS) {
  Assets.add(asset);
}

Assets.backgroundLoad(ASSETS.map(({ name }) => name));

export async function getAsset(name: Asset): Promise<Texture> {
  return Assets.load(name);
}
