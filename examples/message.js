// @flow
// Replace '../src/duck' path by 'redux-duck-immer'
import * as duck from '../src/duck';

// -------------------------------------
//   Action types
// -------------------------------------

const UPDATE = duck.defineType('message', 'UPDATE');
const RESET = duck.defineType('message', 'RESET');

// -------------------------------------
//   Actions
// -------------------------------------

const updateAction = duck.createAction(UPDATE);
const reset = duck.createAction(RESET);

// Dispatch action in anywhere
// dispatch(updateAction('hello world!'));

// -------------------------------------
//   Reducer
// -------------------------------------

type State = {
  message?: string,
};

const initState: State = {
  message: '',
};

export default duck.createReducer(initState, {
  [UPDATE]: (state, action) => {
    // message should turn to 'hello world!'
    state.message = action.payload;
  },
  [RESET]: () => {
    return initState;
  },
});
