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

export {
  momentSort,
  afterNow,
  timeToday,
  formatSection,
  momentFromDateTime
};
