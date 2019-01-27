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

export {
  momentSort,
  afterNow,
  timeToday
};
