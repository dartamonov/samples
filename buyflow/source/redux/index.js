import { combineReducers } from 'redux';
import videoReducer from './video/reducer';

const rootReducer = combineReducers({
  video: videoReducer
});

export default rootReducer;
