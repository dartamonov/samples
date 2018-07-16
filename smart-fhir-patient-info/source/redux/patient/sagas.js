import {
  call,
  put,
  fork
} from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import {
  LOAD_PATIENT,
  SET_PATIENT,
  LOAD_CONDITIONS,
  setConditions
} from './actions';
import loader from '../../tools/loader/loader';
import endpoints from '../../tools/loader/endpoints';
import { normalizePatient, normalizeConditions } from './helpers';

// WATCHERS
export function* loadPatientWatch() {
  yield* takeLatest(LOAD_PATIENT, loadPatientWorker);
}
export function* loadConditionsWatch() {
  yield* takeLatest(LOAD_CONDITIONS, loadConditionsWorker);
}

// WORKERS
export function* loadPatientWorker({payload: {patientId}}) {
  const endpoint = endpoints.loadPatient(patientId);

  try {
    const response = yield call(loader.request, endpoint);

    yield put({
      type: SET_PATIENT,
      payload: normalizePatient(response)
    });
  } catch(e) {
    //
  }
}
export function* loadConditionsWorker({payload: {patientId, conditionStatus}}) {
  const endpoint = endpoints.loadConditions(patientId, conditionStatus);

  try {
    const response = yield call(loader.request, endpoint);

    yield put(setConditions(normalizeConditions(response)));
  } catch(e) {
    //
  }
}

export default function* videoSagas() {
  yield [
    fork(loadPatientWatch),
    fork(loadConditionsWatch)
  ];
}
