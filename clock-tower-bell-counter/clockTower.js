export default class clockTower {
  /**
   * Accepts a start time and end time. Both times should be in twenty-four hour notation, such as 12:00 for noon and 15:30 for half-past three in the afternoon.
   * Returns an integer representing the number of times the clock tower will ring its bell between the two provided times.
   */
  countBells(startTime, endTime) {
    const start = this.parseTime(startTime)
    const end = this.parseTime(endTime);
    const diff = (end.hour - start.hour);
    const hoursPassed = (diff > 0)
      ? diff // same day
      : (diff < 0)
        ? diff + 24 // next day
        : (start.minute >= end.minute)
          ? diff + 24 // next day
          : 0; // same hour

    let bellsTotal = 0;
    let i = (start.minute < 1) ? 0 : 1;
    while (i <= hoursPassed) {
      let bells = (start.hour + i) % 12;
      if (bells < 1) bells = 12;
      bellsTotal += bells;
      i++;
    }

    return bellsTotal;
  };

  /**
   * Accepts time as string in twenty-four hour notation
   * Returns time as an object with 'hour' and 'minute' properties
   */
  parseTime(strTime) {
    const time = strTime.split(":").map(time => Number.parseInt(time, 10));
    return {
      'hour': time[0],
      'minute': time[1]
    };
  }
};
