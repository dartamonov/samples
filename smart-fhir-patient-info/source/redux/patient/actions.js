export const LOAD_PATIENT = 'LOAD_PATIENT';
export const SET_PATIENT = 'SET_PATIENT';
export const LOAD_CONDITIONS = 'LOAD_CONDITIONS';
export const SET_CONDITIONS = 'SET_CONDITIONS';

export const loadPatient = (patientId) => {
  return {
    type: LOAD_PATIENT,
    payload: {patientId}
  };
};
export const loadConditions = (patientId, conditionStatus) => {
  return {
    type: LOAD_CONDITIONS,
    payload: {patientId, conditionStatus}
  };
};
export const setConditions = (conditions) => {
  return {
    type: SET_CONDITIONS,
    payload: conditions
  };
};
