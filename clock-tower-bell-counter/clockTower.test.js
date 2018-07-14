import clockTower from './clockTower.js';

describe('countBells', () => {
	it(`Returns an integer representing the number of times the clock tower will ring its bell between the two provided times`, () => {
		const ct = new clockTower();

		expect(ct.countBells('2:00', '3:00')).toEqual(5);
		expect(ct.countBells('14:00', '15:00')).toEqual(5);
		expect(ct.countBells('14:23', '15:42')).toEqual(3);
		expect(ct.countBells('23:00', '1:00')).toEqual(24);
	});
});
