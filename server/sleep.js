const moment = require('moment');

/**
 *
 */
class Sleep {
  /**
   *
   * @param {Number} id
   * @param {moment.Moment|String} start
   * @param {moment.Moment|String} asleep
   * @param {moment.Moment|String} awake
   * @param {moment.Moment|String} end
   */
  constructor({id, start = null, asleep = null, awake = null, end = null}) {
    /**
     * @type {Number}
     */
    this.id = id;
    this.start = start;
    this.asleep = asleep;
    this.awake = awake;
    this.end = end;
  }

  /**
   * @param {Sleep} sleep
   */
  updateFrom(sleep) {
    if (sleep.id !== this.id) {
      console.error(`updateFrom error: ids do not match (this id:${this.id} != that id:${sleep.id})`);
      return;
    }

    let message = `sleep id: ${this.id} updated`;

    Object.keys(this)
        .forEach(key => {
          if (key === 'id') {
            return;
          }

          if (this[key] !== sleep[key]) {
            this[key] = sleep[key];
            message += ` ${key} (${this[key]})`;
          }
        });

    console.log(message);
  }

  /**
   * @return {moment.Moment|null}
   */
  get startTime() {
    if (this.start === null) {
      return null;
    }
    return moment(this.start);
  }

  set startTime(time) {
    this.start = time;
  }

  /**
   * @return {moment.Moment|null}
   */
  get asleepTime() {
    if (this.asleep === null) {
      if (this.start !== null) {
        return this.startTime;
      }
      return null;
    }
    return moment(this.asleep);
  }

  set asleepTime(time) {
    this.asleep = time;
  }

  /**
   * @return {moment.Moment|null}
   */
  get awakeTime() {
    if (this.awake === null) {
      if (this.end !== null) {
        return this.endTime;
      }
      return null;
    }
    return moment(this.awake);
  }

  set awakeTime(time) {
    this.awake = time;
  }

  /**
   * @return {moment.Moment|null}
   */
  get endTime() {
    if (this.end === null) {
      return null;
    }
    return moment(this.end);
  }

  set endTime(time) {
    this.end = time;
  }

  /**
   * @return {moment.Duration|null}
   */
  get timeAsleep() {
    if (this.asleepTime === null || this.awakeTime === null) {
      return null;
    }
    return moment.duration(this.awakeTime.diff(this.asleepTime));
  }

  /**
   * @return {moment.Duration|null}
   */
  get totalTime() {
    if (this.startTime === null || this.endTime === null) {
      return null;
    }
    return moment.duration(this.endTime.diff(this.startTime));
  }
}

module.exports = Sleep;
