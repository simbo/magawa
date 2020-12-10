import produce from 'immer';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom
} from 'rxjs/operators';

// tslint:disable:no-any

export type ActionPayload<ACTION extends string> = {
  [KEY in ACTION]?: { [key: string]: any };
};

export type Actions<
  STATE,
  ACTION extends string,
  PAYLOAD extends ActionPayload<ACTION>
> = {
  [KEY in ACTION]: (
    state: STATE,
    payload: PAYLOAD[KEY] | never,
    dispatch: (action: ACTION, payload?: PAYLOAD[KEY]) => void
  ) => Partial<STATE> | void;
};

export interface ActionMeta<
  ACTION extends string,
  PAYLOAD extends ActionPayload<ACTION>
> {
  name: ACTION;
  payload: PAYLOAD[ACTION];
}

export type Selectors<STATE, SELECTOR extends string> = {
  [KEY in SELECTOR]: (state: STATE) => any;
};

export class Store<
  STATE,
  ACTION extends string,
  PAYLOAD extends ActionPayload<ACTION>
> {
  private readonly initialState: STATE;
  private readonly stateSubject: BehaviorSubject<STATE>;
  private readonly actionsSubject = new Subject<ActionMeta<ACTION, PAYLOAD>>();

  constructor(
    initialState: STATE,
    private readonly actions: Actions<STATE, ACTION, PAYLOAD>
  ) {
    this.initialState = produce({}, () => initialState) as STATE;
    this.stateSubject = new BehaviorSubject<STATE>(this.initialState);
    this.listen();
  }

  public get state$(): Observable<STATE> {
    return this.stateSubject.pipe(
      distinctUntilChanged(
        (a, b) => a === b,
        value => (typeof value === 'object' ? JSON.stringify(value) : value)
      )
    );
  }

  public get actions$(): Observable<
    ActionMeta<ACTION, PAYLOAD> & { state: STATE }
  > {
    return this.actionsSubject.pipe(
      withLatestFrom(this.state$),
      map(([{ name, payload }, state]) => ({ name, payload, state }))
    );
  }

  public readonly dispatch = (
    name: ACTION,
    payload?: PAYLOAD[ACTION]
  ): void => {
    this.actionsSubject.next({ name, payload: payload as PAYLOAD[ACTION] });
  };

  private readonly dispatchAfterCallstack = (
    name: ACTION,
    payload?: PAYLOAD[ACTION]
  ): void => {
    setTimeout(() => this.dispatch(name, payload));
  };

  private update(state: STATE, partial: Partial<STATE>): void {
    const nextState = produce(state, draftState => ({
      ...draftState,
      ...partial
    }));
    this.stateSubject.next(nextState as STATE);
  }

  private listen(): void {
    this.actions$
      .pipe(
        map(({ name, payload, state }) => [
          this.actions[name](state, payload, this.dispatchAfterCallstack),
          state
        ]),
        filter(([partial]) => !!partial)
      )
      .subscribe(([partial, state]) =>
        this.update(state as STATE, partial as Partial<STATE>)
      );
  }
}
