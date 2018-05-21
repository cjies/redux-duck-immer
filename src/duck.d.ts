/**
 * An action type in string
 */
type ActionType = string;

/**
 * An object to describe action
 */
interface Action {
  type: ActionType;
  payload?: any;
  [x: string]: any;
}

/**
 * Apply action type as object key
 */
interface ActionCases<S> {
  [actionType: ActionType]: (S, Action) => void;
}

/**
 * Define an action type
 */
export function defineType(...actionTypes: string[]): ActionType;

/**
 * Create an action creator
 */
export function createAction(actionType: ActionType): (payload: any) => Action;

/**
 * Create a reducer with immer supports
 */
export function createReducer(
  initState: any,
  cases: ActionCases<any>
): <S>(state: S, action: Action) => S;
