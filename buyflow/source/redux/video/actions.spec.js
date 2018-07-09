import * as actions from './actions';

describe('customizationTypes', () => {
	it('should create LOAD_CONTENT action', () => {
		const result = actions.loadContent();
    const expected = {type: 'LOAD_CONTENT'};

    expect(result).toEqual(expected);
  });

	it('should create SET_CONTENT action', () => {
		const result = {type: actions.SET_CONTENT};
		const expected = {type: 'SET_CONTENT'};

		expect(result).toEqual(expected);
	});

	it('should create SET_CART action', () => {
		const result = {type: actions.SET_CART};
		const expected = {type: 'SET_CART'};

		expect(result).toEqual(expected);
	});

	it('should create UPDATE_CHANNEL_GROUP action', () => {
		const result = {type: actions.UPDATE_CHANNEL_GROUP};
		const expected = {type: 'UPDATE_CHANNEL_GROUP'};

		expect(result).toEqual(expected);
	});

	it('should create UPDATE_CHANNEL_SELECTION action to remove channel', () => {
		const result = actions.updateChannelSelection('videoPremiumChannel', '142314532', true);
		const expected = {
			type: actions.UPDATE_CHANNEL_SELECTION,
			payload: {
				channelType: 'videoPremiumChannel',
				optionId: '142314532',
				remove: true
			}
		};

		expect(result).toEqual(expected);
	});

	it('should create UPDATE_CHANNEL_SELECTION action to add channel', () => {
		const result = actions.updateChannelSelection('videoPremiumChannel', '142314532');
		const expected = {
			type: actions.UPDATE_CHANNEL_SELECTION,
			payload: {
				channelType: 'videoPremiumChannel',
				optionId: '142314532',
				remove: false
			}
		};

		expect(result).toEqual(expected);
	});

	it('should create TOGGLE_ACCORDION action', () => {
    const result = actions.toggleAccordion('videoPremiumChannel', true);
    const expected = {
      type: actions.TOGGLE_ACCORDION,
      payload: {
        channelType: 'videoPremiumChannel',
        expanded: true
      }
    };

    expect(result).toEqual(expected);
  });
});
