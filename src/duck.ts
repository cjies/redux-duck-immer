import produce, { Draft } from 'immer';

/**
 * An action type
 */
type ActionType = string;

/**
 * An object to describe action
 */
type Action<P> = {
  type: ActionType;
  payload?: P;
};

/**
 * Apply action type as object key
 */
type ActionCases<S, P> = {
  [actionType: string]: (state: S | Draft<S>, action: Action<P>) => S | void;
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
export function createReducer<S, P>(initState: S, cases: ActionCases<S, P>) {
  // Throw error when `undefined` is one of the object key
  // tslint:disable-next-line no-string-literal
  if (cases['undefined']) {
    throw new Error('Does not include undefined as object key!');
  }

  return (state: S = initState, action?: Action<P>) => {
    return produce(state, (draftState) => {
      if (action && cases[action.type]) {
        return cases[action.type](draftState, action);
      }
    });
  };
}
