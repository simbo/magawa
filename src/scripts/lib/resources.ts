import { Loader, LoaderResource } from 'pixi.js';
import { Observable, Subject } from 'rxjs';

export enum Resource {
  IconBoom = 'icons/boom.png',
  IconFlag = 'icons/flag.png'
}

class Resources {
  public readonly loader = new Loader();

  private readonly loadedSubject = new Subject<void>();

  private readonly items = new Map<Resource, LoaderResource>();

  constructor(...keys: Resource[]) {
    this.loader.baseUrl = document.head.baseURI;
    keys.forEach(key => this.loader.add(key, key));
    this.loader.load((loader, items) => this.onLoaded(items));
  }

  public get loaded$(): Observable<void> {
    return this.loadedSubject.asObservable();
  }

  public get(key: Resource): LoaderResource | undefined {
    return this.items.get(key);
  }

  public has(key: Resource): boolean {
    return this.items.has(key);
  }

  private onLoaded(items: Partial<Record<Resource, LoaderResource>>): void {
    Object.entries(items).forEach(([key, value]) => {
      if (value && !value.error) {
        this.items.set(key as Resource, value);
      }
    });
    this.loadedSubject.next();
    this.loadedSubject.complete();
  }
}

export const resources = new Resources(...Object.values(Resource));
