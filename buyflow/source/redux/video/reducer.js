import update from 'react/lib/update';
import {
  SET_CONTENT,
  SET_CART,
  UPDATE_CHANNEL_GROUP,
  TOGGLE_ACCORDION
} from './actions';

export const initialState = {
  content: {
    channelGroups: {}
  },
  cart: {
    monthlyTotal: 0
  }
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CONTENT:
      return {
        ...state,
        content: action.payload.content
      };
    case SET_CART:
      return {
        ...state,
        cart: action.payload.cart
      };
    case UPDATE_CHANNEL_GROUP: {
      return update(state, {
          content: {
            channelGroups: {
              [action.payload.channelType] : {
                $apply: content => {
                  return {
                    ...action.payload.content,
                    expanded: content.expanded
                  };
                }
              }
            }
          }
        });
    }
    case TOGGLE_ACCORDION:
      return update(state, {
        content: {
          channelGroups: {
            [action.payload.channelType]: {
              expanded: {
                $set: action.payload.expanded
              }
            }
          }
        }
      });
    default:
      return state;
  }
};
