import {
  SET_PATIENT,
  SET_CONDITIONS
} from './actions';

export const initialState = {
  info: {},
  conditions: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PATIENT:
      return {
        ...state,
        info: action.payload
      };
    case SET_CONDITIONS:
      return {
        ...state,
        conditions: action.payload
      };
    default:
      return state;
  }
};
