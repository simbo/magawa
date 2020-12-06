import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export interface Action<S> {
  type: string;
  map(state: S): Partial<S> | void;
}

export class Store<S> {
  private readonly stateSubject: BehaviorSubject<S>;

  private readonly actionsSubject = new Subject<Action<S>>();

  constructor(public readonly initialState: S) {
    this.stateSubject = new BehaviorSubject<S>(this.initialState);
    this.actions$
      .pipe(
        map(action => action.map(this.stateSubject.getValue())),
        filter(payload => !!payload)
      )
      .subscribe(payload =>
        window.setTimeout(() => this.update(payload as Partial<S>))
      );
  }

  public get state$(): Observable<S> {
    return this.stateSubject.pipe(
      distinctUntilChanged((a, b) => a === b, JSON.stringify)
    );
  }

  public get actions$(): Observable<Action<S>> {
    return this.actionsSubject.asObservable();
  }

  public push(action: Action<S>): void {
    window.setTimeout(() => this.actionsSubject.next(action));
  }

  private update(newState: Partial<S>): void {
    this.stateSubject.next({ ...this.stateSubject.getValue(), ...newState });
  }
}
