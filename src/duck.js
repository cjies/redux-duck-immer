// @flow
import produce from 'immer';

/**
 * An action type
 */
type ActionType = string;

/**
 * An object to describe action
 */
type Action<P> = {
  type: ActionType,
  payload?: P,
};

/**
 * Apply action type as object key
 */
type ActionCases<S, P> = {
  [actionType: ActionType | typeof undefined]: (
    state: S,
    action: Action<P>
  ) => void | S,
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
  return function actionCreator<P>(payload?: P): Action<P> {
    const action: Action<P> = { type: actionType };

    if (payload !== undefined) {
      action.payload = payload;
    }

    return action;
  };
}

/**
 * Create a reducer with immer supports
 */
export function createReducer<S, P: any>(
  initState: S,
  cases: ActionCases<S, P>
) {
  // Throw error when `undefined` is one of the object key
  if (cases[undefined]) {
    throw new Error('Does not include undefined as object key!');
  }

  return (state: S = initState, action: Action<P>): S => {
    return produce(state, (draftState: S): void | S => {
      if (action && cases[action.type]) {
        return cases[action.type](draftState, action);
      }
    });
  };
}

export default {
  defineType,
  createAction,
  createReducer,
};
