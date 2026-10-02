import { slashJoin } from 'path-slashes';

import { IconName } from './icon-name.enum';

/**
 * Names of available resources
 */
export enum PaintResourceName {
  Boom = IconName.Boom,
  Flag = IconName.Flag
}

/**
 * Named image resource and its source URL.
 */
interface PaintResource {
  name: PaintResourceName;
  src: string;
}

/**
 * Asset names with corresponding relative path
 */
const CANVAS_ASSETS: PaintResource[] = [
  { name: PaintResourceName.Boom, src: 'icons/boom.png' },
  { name: PaintResourceName.Flag, src: 'icons/flag.png' }
];

/**
 * Image resource with its loaded browser image element.
 */
export type PaintAsset = PaintResource & { image: HTMLImageElement };

/**
 * Loads an image and resolves only after the browser reports it ready to draw.
 *
 * @param asset - Named resource and source URL.
 * @returns The resource with its loaded image.
 * @throws If the browser cannot load the image.
 */
async function loadPaintAsset(asset: PaintResource): Promise<PaintAsset> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('error', error => reject(error));
    image.addEventListener('load', () => resolve({ ...asset, image: image }));
    image.src = asset.src;
  });
}

const BASE_URI = document.head.baseURI;

const CANVAS_IMAGES: { [key in PaintResourceName]?: PaintAsset } = {};

/**
 * Preloads canvas images before module evaluation completes.
 * The top-level await ensures tile textures can synchronously retrieve loaded assets.
 */
for (let i = 0; i < CANVAS_ASSETS.length; i++) {
  const { name, src } = CANVAS_ASSETS[i];
  const image = await loadPaintAsset({ name, src: slashJoin(BASE_URI, src) });
  CANVAS_IMAGES[image.name] = image;
}

/**
 * Looks up a preloaded canvas image by resource name.
 *
 * @param name - Resource to retrieve.
 * @returns The loaded image resource.
 * @throws If the named resource has not been loaded.
 */
export function getPaintAsset(name: PaintResourceName): PaintAsset {
  const image = CANVAS_IMAGES[name];
  if (!image) {
    throw new Error(`PaintAsset with name '${name}' not found`);
  }
  return image;
}
