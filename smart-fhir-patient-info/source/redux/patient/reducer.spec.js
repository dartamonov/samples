import * as actions from './actions';
import reducer, { initialState } from './reducer';

describe('Patient reducer', () => {
  it('Should return the initial state', () => {
    const result = reducer(undefined, undefined);
    const expected = initialState;

    expect(result).toEqual(expected);
  });

  it('Should handle SET_PATIENT action type', () => {
    const payload = {fullName: 'John Doe', gender: 'male'};
    const action = {
      type: actions.SET_PATIENT,
      payload
    };
    const result = reducer(undefined, action);
    const expected = {
        ...initialState,
        info: payload
      };

    expect(result).toEqual(expected);
  });

  it('Should handle SET_CONDITIONS action type', () => {
    const payload = [{dateRecorded: '2015-03-12', title: 'Condition title'}];
    const action = actions.setConditions(payload);
    const result = reducer(undefined, action);
    const expected = {
        ...initialState,
        conditions: payload
      };

    expect(result).toEqual(expected);
  });
});
