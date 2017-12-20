export interface Action<T> {
  type: T;

  [extraProps: string]: {};
}

export type ActionCreatorsMapObject<A> = Map<string, A>;