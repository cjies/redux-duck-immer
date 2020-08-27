import produce, { Draft } from 'immer';

// -------------------------------------
//   Type Definitions
// -------------------------------------

/**
 * Action type
 */
export type ActionType = string;

type ActionWithPayload<T, P> = { type: T; payload: P };
type ActionWithoutPayload<T> = { type: T };

/**
 * Action object created by action creator
 */
export type Action<T, P> = ActionWithPayload<T, P> | ActionWithoutPayload<T>;

/**
 * Action handlers in reducer
 */
type ActionHandlers<S, TS extends string, P> = {
  readonly [T in TS | string]: (
    state: S | Draft<S>,
    action: Action<T, P>
  ) => S | void;
};

// -------------------------------------
//   Public Methods
// -------------------------------------

/**
 * Define an action type
 */
export function defineType(...actionTypes: string[]): ActionType {
  return actionTypes.join('/');
}

/**
 * Create an action creator
 */
export function createAction<P>(actionType: ActionType) {
  return function actionCreator(payload?: P) {
    if (payload !== undefined) {
      return {
        type: actionType,
        payload,
      };
    }

    return {
      type: actionType,
    };
  };
}

/**
 * Create a reducer with immer supports
 */
export function createReducer<S, T extends ActionType, P>(
  initState: S,
  handlers?: ActionHandlers<S, T, P>
) {
  return (state: S = initState, action?: Action<T, P>) => {
    if (!action || !handlers || !handlers.hasOwnProperty(action.type)) {
      return state;
    }

    return produce(state, (draftState) => {
      return handlers[action.type](draftState, action);
    });
  };
}
