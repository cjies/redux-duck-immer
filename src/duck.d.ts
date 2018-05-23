/**
 * An action type in string
 */
export type ActionType = string;

/**
 * An object to describe action
 */
export interface Action<P> {
  type: ActionType;
  payload?: P;
}

/**
 * Apply action type as object key
 */
export interface ActionCases<S, P> {
  [actionType: ActionType]: (state: S, action: Action<P>) => void | S;
}

/**
 * Define an action type
 */
export function defineType(...actionTypes: string[]): ActionType;

/**
 * Create an action creator
 */
export function createAction(
  actionType: ActionType
): <P>(payload?: P) => Action<P>;

/**
 * Create a reducer with immer supports
 */
export function createReducer<S, P>(
  initState: S,
  cases: ActionCases<S, P>
): (state: S, action: Action<P>) => S;
