import mockUtil from './mockUtil.js';

const JSON_PATH = 'video/videoChannelsSuccess.json';

describe('readMock', () => {
	it(`parses a JSON file asynchronously and applies a callback to the parsed data`, () => {
		const asyncAction = new Promise((resolve) => {
			mockUtil.readMock(JSON_PATH, (data) => {
				resolve(data);
			});
		});

		asyncAction.then((data) => {
			expect(data.responseStatus).toEqual('Success');
		});
	});
});

describe('readMockSync', () => {
	it(`parses a JSON file synchronously and returns the parsed data`, () => {
		const data = mockUtil.readMockSync(JSON_PATH);

		expect(data.responseStatus).toEqual('Success');
	});
});

describe('the ArrayLoop class', () => {
	it(`expose an array's values in an infinite loop`, () => {
		const testLoop = new mockUtil.ArrayLoop([1, 2, 3]);

		expect(testLoop.currentValue()).toEqual(1);

		testLoop.nextIndex() // 2
						.nextIndex() // 3
						.nextIndex() // loops back to 1
						.nextIndex(); // 2
		expect(testLoop.currentValue()).toEqual(2);
	});
});
