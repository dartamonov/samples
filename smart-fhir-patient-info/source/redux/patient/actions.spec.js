import * as actions from './actions';

describe('customizationTypes', () => {
	it('should create LOAD_PATIENT action', () => {
		const result = actions.loadPatient('123');
    const expected = {type: 'LOAD_PATIENT', payload: {patientId: '123'}};

    expect(result).toEqual(expected);
  });

	it('should create LOAD_CONDITIONS action', () => {
		const result = actions.loadConditions('123', 'active');
    const expected = {type: 'LOAD_CONDITIONS', payload: {patientId: '123', conditionStatus: 'active'}};

    expect(result).toEqual(expected);
  });

	it('should create SET_PATIENT action', () => {
		const payload = {fullName: 'John Doe', gender: 'male'};
		const result = {type: actions.SET_PATIENT, payload};
		const expected = {type: 'SET_PATIENT', payload};

		expect(result).toEqual(expected);
	});

	it('should create SET_CONDITIONS action', () => {
		const payload = [{dateRecorded: '2015-03-12', title: 'Condition title'}];
		const result = actions.setConditions(payload);
		const expected = {type: 'SET_CONDITIONS', payload: payload};

		expect(result).toEqual(expected);
	});

});
