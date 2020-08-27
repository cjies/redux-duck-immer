// @ts-ignore
import * as duck from 'redux-duck-immer';

// -------------------------------------
//   Action types
// -------------------------------------

const UPDATE = duck.defineType('message', 'UPDATE');
const RESET = duck.defineType('message', 'RESET');

// -------------------------------------
//   Actions
// -------------------------------------

const updateAction = duck.createAction<string>(UPDATE);
const reset = duck.createAction<void>(RESET);

// Dispatch action in anywhere
// dispatch(updateAction('hello world!'));

// -------------------------------------
//   Reducer
// -------------------------------------

type State = {
  message: string;
};

const initState: State = {
  message: '',
};

export default duck.createReducer(initState, {
  [UPDATE]: (state, { payload }: ReturnType<typeof updateAction>) => {
    // message should turn to 'hello world!'
    state.message = payload;
  },
  [RESET]: () => {
    return initState;
  },
});
