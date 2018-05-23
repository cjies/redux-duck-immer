// @flow
// Replace '../src/duck' path by 'redux-duck-immer'
import * as duck from '../src/duck';

// -------------------------------------
//   Action types
// -------------------------------------

const UPDATE = duck.defineType('message', 'UPDATE');

// -------------------------------------
//   Actions
// -------------------------------------

const updateAction = duck.createAction(UPDATE);

// Dispatch action
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
  UPDATE: (state, action) => {
    // `state.message` should be 'hello world!'
    state.message = action.payload;
  },
});
