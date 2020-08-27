import * as duck from './duck';

describe('export methods', () => {
  it('should provide 3 methods', () => {
    expect(Object.keys(duck).length).toBe(3);
  });

  it('should provide a `defineType` method', () => {
    expect(duck.defineType).toBeTruthy();
    expect(typeof duck.defineType).toBe('function');
  });

  it('should provide a `createAction` method', () => {
    expect(duck.createAction).toBeTruthy();
    expect(typeof duck.createAction).toBe('function');
  });

  it('should provide a `createReducer` method', () => {
    expect(duck.createReducer).toBeTruthy();
    expect(typeof duck.createReducer).toBe('function');
  });
});

describe('Action Type', () => {
  it('should join the action type string', () => {
    const TYPE_1 = duck.defineType('test1', 'TYPE'); // `test1` as prefix

    expect(TYPE_1).toBe('test1/TYPE');
  });

  it('should return the expected action type string', () => {
    const TYPE_2 = duck.defineType('TYPE_2');

    expect(TYPE_2).toBe('TYPE_2');
  });
});

describe('Action Creator', () => {
  const TYPE = duck.defineType('TYPE');

  it('should create a valid action without payload', () => {
    const actionWithoutPayload = duck.createAction<undefined>(TYPE);

    expect(actionWithoutPayload()).toEqual({ type: TYPE });
  });

  it('should create a valid action with payload', () => {
    const payload = {
      id: 123,
      message: 'hello world',
    };
    const actionWithPayload = duck.createAction<typeof payload>(TYPE);

    expect(actionWithPayload(payload)).toEqual({ type: TYPE, payload });
  });
});

describe('Reducer', () => {
  const UPDATE_MESSAGE = duck.defineType('UPDATE_MESSAGE');
  const RESET = duck.defineType('RESET');

  function updateMessage(message: string) {
    return {
      type: UPDATE_MESSAGE,
      payload: message,
    };
  }
  const reset = duck.createAction<void>(RESET);

  interface State {
    message: string;
  }

  const initState: State = {
    message: '',
  };
  const testReducer = duck.createReducer(initState, {
    [UPDATE_MESSAGE]: (
      state,
      { payload }: ReturnType<typeof updateMessage>
    ) => {
      state.message = payload;
    },
    [RESET]: () => {
      return initState;
    },
  });

  it('should return the default state without action', () => {
    expect(testReducer(initState)).toEqual(initState);
  });

  it('should work with the defined cases', () => {
    const testState = testReducer(initState, updateMessage('hello world'));
    const testState2 = testReducer(testState, reset());

    expect(testState).toEqual({ message: 'hello world' });
    expect(testState2).toEqual({ message: '' });
  });
});

test('throw error if try to mutate reducer state', () => {
  const UPDATE_MESSAGE = duck.defineType('UPDATE_MESSAGE');
  const updateMessage = duck.createAction<string>(UPDATE_MESSAGE);

  type a = ReturnType<typeof updateMessage>;

  const initState = {
    message: '',
  };
  const testReducer = duck.createReducer(initState, {
    [UPDATE_MESSAGE]: (
      state,
      { payload }: ReturnType<typeof updateMessage>
    ) => {
      state.message = payload;
    },
  });
  const testState = testReducer(initState, updateMessage('hello world'));

  expect(() => {
    testState.message = 'lol';
  }).toThrow(
    "Cannot assign to read only property 'message' of object '#<Object>'"
  );
  expect(() => {
    // @ts-ignore
    testState.id = 123;
  }).toThrow('Cannot add property id, object is not extensible');
});

// Test with Classes & Symbol
test('should support Classes & Symbol in reducer', () => {
  class ClassA {}
  const SymbolA = Symbol('a');
  const updatePayload = {
    class: new ClassA(),
    symbol: SymbolA,
  };

  const UPDATE_CLASS_N_SYMBOL = duck.defineType('UPDATE_CLASS_N_SYMBOL');
  const updateClassNSymbol = duck.createAction<typeof updatePayload>(
    UPDATE_CLASS_N_SYMBOL
  );

  const initState = {
    class: new ClassA(),
    symbol: undefined,
  };

  const testReducer = duck.createReducer(initState, {
    [UPDATE_CLASS_N_SYMBOL]: (
      state,
      { payload }: ReturnType<typeof updateClassNSymbol>
    ) => {
      return payload;
    },
  });
  const testState = testReducer(initState, updateClassNSymbol(updatePayload));

  expect(testState).toEqual({
    class: new ClassA(),
    symbol: SymbolA,
  });
});
