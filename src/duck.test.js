import test from 'ava';
import duck from './duck';

test('export methods', t => {
  t.is(Object.keys(duck).length, 3, 'it should provided 3 methods');

  t.truthy(duck.defineType, 'it should provided a `defineType` method');
  t.is(typeof duck.defineType, 'function', 'it should be a function');

  t.truthy(duck.createAction, 'it should provided a `createAction` method');
  t.is(typeof duck.createAction, 'function', 'it should be a function');

  t.truthy(duck.createReducer, 'it should provided a `createReducer` method');
  t.is(typeof duck.createReducer, 'function', 'it should be a function');
});

test('create action type', t => {
  const TYPE_1 = duck.defineType('test1', 'TYPE'); // `test1` as prefix
  const TYPE_2 = duck.defineType('TYPE_2');

  t.is(TYPE_1, 'test1/TYPE', 'it should be the expected action type string');

  t.is(TYPE_2, 'TYPE_2', 'it should be the expected action type string');
});

test('create action creator', t => {
  const TYPE = duck.defineType('TYPE');
  const actionType = duck.createAction(TYPE);

  t.is(typeof actionType, 'function', 'it should create a valid function');

  const emptyAction = actionType();

  t.deepEqual(
    emptyAction,
    { type: TYPE },
    'it should be able to create an action without payload'
  );

  const FAKE_PAYLOAD = {
    id: 123,
    message: 'hello world',
  };
  const actionWithPayload = actionType(FAKE_PAYLOAD);

  t.deepEqual(
    actionWithPayload,
    {
      type: TYPE,
      payload: FAKE_PAYLOAD,
    },
    'it should create a valid action object'
  );
});

test('create reducer', t => {
  const UPDATE_MESSAGE = duck.defineType('UPDATE_MESSAGE');
  const RESET = duck.defineType('RESET');

  function updateMessage(message) {
    return {
      type: UPDATE_MESSAGE,
      payload: message,
    };
  }
  const reset = duck.createAction(RESET);

  const initState = {
    message: '',
  };
  const testReducer = duck.createReducer(initState, {
    [UPDATE_MESSAGE]: (state, { payload }) => {
      state.message = payload;
    },
    [RESET]: () => {
      return initState;
    },
  });

  t.is(typeof testReducer, 'function', 'the reducer should be a function');

  t.deepEqual(
    testReducer(initState),
    initState,
    'the reducer should be able to return the default state'
  );

  const testState = testReducer({}, updateMessage('hello world'));
  const testState2 = testReducer(testState, reset());

  t.deepEqual(
    testState,
    {
      message: 'hello world',
    },
    'the reducer should work with the defined cases'
  );

  t.deepEqual(
    testState2,
    {
      message: '',
    },
    'the reducer should work with the defined cases'
  );
});

// Reducer state
test('throw error if try to mutate reducer state', t => {
  const UPDATE_MESSAGE = duck.defineType('UPDATE_MESSAGE');
  const updateMessage = {
    type: UPDATE_MESSAGE,
    payload: 'hello world',
  };

  const initState = {
    message: '',
  };
  const testReducer = duck.createReducer(initState, {
    [UPDATE_MESSAGE]: (state, action) => {
      state.message = action.payload;
    },
  });
  const testState = testReducer(initState, updateMessage);

  const error1 = t.throws(() => {
    testState.message = 'lol';
  });
  const error2 = t.throws(() => {
    testState.id = 123;
  });

  t.is(
    error1.message,
    "Cannot assign to read only property 'message' of object '#<Object>'"
  );
  t.is(error2.message, 'Cannot add property id, object is not extensible');
});

// Test with Classes & Symbol
test('support Classes & Symbol in reducer', t => {
  class ClassA {}
  class ClassB extends ClassA {}
  const SymbolA = Symbol('a');

  const UPDATE_CLASS_N_SYMBOL = duck.defineType('UPDATE_CLASS_N_SYMBOL');
  const updateClassNSymbol = {
    type: UPDATE_CLASS_N_SYMBOL,
    payload: {
      class: new ClassB(),
      symbol: SymbolA,
    },
  };

  const initState = {
    class: new ClassA(),
    symbol: undefined,
  };
  const testReducer = duck.createReducer(initState, {
    [UPDATE_CLASS_N_SYMBOL]: (state, action) => {
      return action.payload;
    },
  });
  const testState = testReducer(initState, updateClassNSymbol);

  t.deepEqual(
    testState,
    {
      class: new ClassB(),
      symbol: SymbolA,
    },
    'the reducer should work with Classes & Symbol'
  );
});
