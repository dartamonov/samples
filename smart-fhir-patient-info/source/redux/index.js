import { combineReducers } from 'redux';
import patientReducer from './patient/reducer';

const rootReducer = combineReducers({
  patient: patientReducer
});

export default rootReducer;
