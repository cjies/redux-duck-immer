# redux-duck-immer

[![NPM version](https://img.shields.io/npm/v/redux-duck-immer.svg?style=flat-square)](https://www.npmjs.com/package/redux-duck-immer)
[![Build status](https://img.shields.io/travis/cjies/redux-duck-immer.svg?style=flat-square)](https://travis-ci.org/cjies/redux-duck-immer)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Inspired by [redux-duck](https://github.com/PlatziDev/redux-duck).

Providing redux helpers to implement [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux/) proposal.
And the reducer's state is produced by [Immer](https://github.com/mweststrate/immer) for immutability.

## Installation

```bash
yarn add redux-duck-immer
```

## API

### Define action types

```javascript
import { defineType } from 'redux-duck-immer';

/**
 * type ActionType = string;
 *
 * (...actionTypes: string[]): ActionType;
 */
const UPDATE = defineType('UPDATE');
const PREFIXED_UPDATE = defineType('prefix', 'UPDATE'); // 'prefix/UPDATE'
```

- `defineType` method receive one or many arguments.
- If multiple arguments are provided, its result should be a string like `prefix/UPDATE`.

### Create action creator

```javascript
import { createAction } from 'redux-duck-immer';

/**
 * interface Action<P> {
 *   type: ActionType;
 *   payload?: P;
 * }
 *
 * (actionType: ActionType): <P>(payload?: P) => Action<P>;
 */
const update = createAction(UPDATE);

// Dispatch action
dispatch(update('hello world!'));
```

- `createAction` method receive just one argument.
- This argument should be the defined action type string.
- It should return a function who will receive the action payload and return a valid (FSA compilant) action object.
- The action creator will receive an optional argument with the action payload.

### Create reducer

```javascript
import { createReducer } from 'redux-duck-immer';

const initialState = {
  message: '',
};

/**
 * interface ActionCases<S, P> {
 *   [actionType: ActionType]: (state: S, action: Action<P>) => void | S;
 * }
 *
 * <S, P: any>(initState: any, cases: ActionCases<S, P>): (state: S, action: Action<P>) => S;
 */
const reducer = createReducer(initState, {
  [UPDATE]: (state, action) => ({
    state.message = action.payload
  }),
});
```

- `createReducer` method receive two arguments, both required.
- The first argument is the reducer initial state.
- The second argument is an object with the possible action cases, should use the previously defined _action types_ as keys.
- Each key in the action cases should be a function who will receive the current state and the dispatched action as arguments.
- Reducer state is immutable which protected by [Immer](https://github.com/mweststrate/immer). In each action case, Immer will produce the nextState based on the mutations to the draft state.

## License

Check [LICENSE](/LICENSE) file for more details.
