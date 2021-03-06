import moment from 'moment';

function momentSort(a, b) {
  if (a.isBefore(b)) {
    return -1;
  }
  if (a.isAfter(b)) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

function afterNow(m, now) {
  return moment(now).isBefore(m);
}

function timeToday(time) {
  return moment(time, 'HH:mm');
}

function momentFromDateTime({date, time}) {
  return moment(date + 'T' + time);
}

function justTime(dateTime) {
  return moment(dateTime).format('HH:mm');
}

function justDate(dateTime) {
  return moment(dateTime).format('YYYY-MM-DD');
}

function formatSection(section, start) {
  let asleep = moment(start.format('YYYY-MM-DD') + 'T' + section.asleep);
  if (asleep.isBefore(start)) {
    asleep.add(1, 'day');
  }

  let awake = null;
  if (section.awake !== null) {
    awake = moment(start.format('YYYY-MM-DD') + 'T' + section.awake);
    if (awake.isBefore(start)) {
      awake.add(1, 'day');
    }
    awake = awake.format();
  }

  return {
    id: section.id,
    asleep: asleep.format(),
    awake
  };
}

function from(date, f) {
  return moment.duration(date.diff(f));
}

function fromNow(date) {
  return from(date, moment());
}

function hoursMinutes(duration) {
  let secs = Math.abs(duration.seconds());
  let mins = Math.abs(duration.minutes()) + (secs > 30 ? 1 : 0);
  let hours = Math.abs(duration.hours());
  let hasValue = mins !== 0 || hours !== 0;
  if (!hasValue) {
    return '';
  }
  if (mins === 60) {
    mins = 0;
    hours++;
  }
  let s = '';
  if (hours !== 0) {
    s += `${hours} hour`;
    if (hours > 1) {
      s += 's';
    }
    s += ' ';
  }
  if (mins !== 0) {
    s += `${mins} minute`;
    if (mins > 1) {
      s += 's';
    }
  }

  return s;
}

function dateToHoursMinutes(date, f) {
  return hoursMinutes(from(date, f));
}

export {
  momentSort,
  afterNow,
  timeToday,
  formatSection,
  momentFromDateTime,
  fromNow,
  justDate,
  justTime,
  hoursMinutes,
  dateToHoursMinutes
};
