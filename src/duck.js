// @flow
import produce from 'immer';

/**
 * An action type
 */
type ActionType = string;

/**
 * An object to describe action
 */
type Action = {
  type: ActionType,
  payload?: any,
  [x: string]: any,
};

/**
 * Apply action type as object key
 */
type ActionCases<S> = {
  [actionType: ActionType | typeof undefined]: (S, Action) => void,
};

/**
 * Define an action type
 */
export function defineType(...actionTypes: string[]): ActionType {
  return actionTypes.join('/');
}

/**
 * Create an action creator
 */
export function createAction(actionType: ActionType) {
  return (payload: any): Action => {
    const action: Action = { type: actionType };

    if (payload !== undefined) {
      action.payload = payload;
    }

    return action;
  };
}

/**
 * Create a reducer with immer supports
 */
export function createReducer(initState: any, cases: ActionCases<any>) {
  // Throw error when `undefined` is one of the object key
  if (cases[undefined]) {
    throw new Error('Does not include undefined as object key!');
  }

  return function reducer<S>(state: S = initState, action: Action): S {
    return produce(state, (draftState: S): void | S => {
      if (action && cases[action.type]) {
        cases[action.type](draftState, action);
      }
    });
  };
}
