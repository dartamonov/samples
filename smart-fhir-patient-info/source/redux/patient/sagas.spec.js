import {
  take
} from 'redux-saga/effects';
import {
  loadPatient,
  loadConditions
} from './actions';
import {
  loadPatientWatch,
  loadConditionsWatch
} from './sagas';

describe('loadPatientWatch saga', () => {
  const generator = loadPatientWatch();

  it('should takeLatest LOAD_PATIENT', () => {
    const action = generator.next().value;

    expect(action).toEqual(take(loadPatient('123')));
  });
});

describe('loadConditionsWatch saga', () => {
  const generator = loadConditionsWatch();

  it('should takeLatest LOAD_CONDITIONS', () => {
    const action = generator.next().value;

    expect(action).toEqual(take(loadConditions('123', 'active')));
  });
});
