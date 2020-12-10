import { Observable, Subject } from 'rxjs';

import { IconName } from './icon-name.enum';

export type ResourceName = IconName;
export type Resource = [ResourceName, string];

class Resources {
  public readonly loader = new PIXI.Loader();

  private readonly loadedSubject = new Subject<void>();

  private readonly items = new Map<ResourceName, PIXI.LoaderResource>();

  constructor(...res: Resource[]) {
    this.loader.baseUrl = document.head.baseURI;
    res.forEach(([key, value]) => this.loader.add(key, value));
    this.loader.load((loader, items) => this.onLoaded(items));
  }

  public get loaded$(): Observable<void> {
    return this.loadedSubject.asObservable();
  }

  public get(key: ResourceName): PIXI.LoaderResource | undefined {
    return this.items.get(key);
  }

  public has(key: ResourceName): boolean {
    return this.items.has(key);
  }

  private onLoaded(
    items: Partial<Record<ResourceName, PIXI.LoaderResource>>
  ): void {
    Object.entries(items).forEach(([key, value]) => {
      if (value && !value.error) {
        this.items.set(key as ResourceName, value);
      }
    });
    this.loadedSubject.next();
    this.loadedSubject.complete();
  }
}

export const resources = new Resources(
  ...(Object.values(IconName).map(name => [
    name,
    `icons/${name}.png`
  ]) as Resource[])
);
