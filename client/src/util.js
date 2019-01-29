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

function afterNow(m) {
  return moment().isBefore(m);
}

function timeToday(time) {
  return moment(time, 'HH:mm');
}

function momentFromDateTime({date, time}) {
  return moment(date + 'T' + time);
}

function formatSection(section, start) {
  let asleep = moment(start.format('YYYY-MM-DD') + 'T' + section.asleep);
  if (asleep.isBefore(start)) {
    asleep.add(1, 'day');
  }
  let awake = moment(start.format('YYYY-MM-DD') + 'T' + section.awake);
  if (awake.isBefore(start)) {
    awake.add(1, 'day');
  }

  return {
    id: section.id,
    asleep: asleep.format(),
    awake: awake.format()
  };
}

function fromNow(date) {
  return moment.duration(date.diff(moment()));
}

function hoursMinutes(duration) {
  let past = duration < 0;
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
  let s = past ? '' : 'in ';
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
  s += past ? ' ago' : '';

  return s;
}

function dateToHoursMinutes(date) {
  return hoursMinutes(fromNow(date));
}

export {
  momentSort,
  afterNow,
  timeToday,
  formatSection,
  momentFromDateTime,
  fromNow,
  hoursMinutes,
  dateToHoursMinutes
};
