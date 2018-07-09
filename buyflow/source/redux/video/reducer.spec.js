import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('video reducer', () => {
  it('should return the initial state', () => {
    const result = reducer(undefined, undefined);
    const expected = initialState;

    expect(result).toEqual(expected);
  });

  it('should handle SET_CONTENT action type', () => {
    const action = {
      type: actions.SET_CONTENT,
      payload: {
        content: {
          test: 123
        }
      }
    };
    const result = reducer(undefined, action);
    const expected = {
        ...initialState,
        content: {
          test: 123
        }
      };

    expect(result).toEqual(expected);
  });

  it('should handle SET_CART action type', () => {
    const action = {
      type: actions.SET_CART,
      payload: {
        cart: {
          monthlyTotal: 30.59
        }
      }
    };
    const result = reducer(undefined, action);
    const expected = {
        ...initialState,
        cart: {
          monthlyTotal: 30.59
        }
      };

    expect(result).toEqual(expected);
  });

  it('should handle UPDATE_CHANNEL_GROUP action type', () => {
    const action = {
      type: actions.UPDATE_CHANNEL_GROUP,
      payload: {
        channelType: 'videoPremiumChannel',
        content: {
          test: 123
        }
      }
    };
    const state = {
      content: {
        channelGroups: {
          videoPremiumChannel: {
            expanded: true,
            test: 999
          }
        }
      }
    };
    const result = reducer(state, action);
    const expected = {
      content: {
        channelGroups: {
          videoPremiumChannel: {
            expanded: true,
            test: 123
          }
        }
      }
    };

    expect(result).toEqual(expected);
  });

  it('should handle TOGGLE_ACCORDION action type', () => {
    const action = {
      type: actions.TOGGLE_ACCORDION,
      payload: {
        channelType: 'videoPremiumChannel',
        expanded: true
      }
    };
    const state = {
      content: {
        channelGroups: {
          videoPremiumChannel: {
            expanded: false
          }
        }
      }
    };

    const result = reducer(state, action);
    const expected = {
      content: {
        channelGroups: {
          videoPremiumChannel: {
            expanded: true
          }
        }
      }
    };

    expect(result).toEqual(expected);
  });
});
