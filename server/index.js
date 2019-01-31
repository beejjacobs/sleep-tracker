const io = require('socket.io')(3003);
const fs = require('fs');
const path = require('path');

let jsonPath = path.join(__dirname, 'sleeps.json');
console.log(jsonPath);

let {sleeps, schedule} = require(jsonPath);

/**
 * @typedef {Object} SleepSection
 * @property {Number} id
 * @property {String} asleep
 * @property {String} awake
 */

/**
 * @typedef {Object} Sleep
 * @property {Number} id
 * @property {String} start
 * @property {String} end
 * @property {SleepSection[]} sections
 */

/**
 * @param {Number} id
 * @return {Sleep|undefined}
 */
function sleepById(id) {
  return sleeps.find(sleep => sleep.id === id);
}

/**
 *
 * @param {Number} id
 * @return {Number}
 */
function sleepIndexById(id) {
  return sleeps.findIndex(sleep => sleep.id === id);
}

/**
 * @param {Sleep} sleep
 * @param {Number} id
 * @return {Number}
 */
function sleepSectionById(sleep, id) {
  return sleep.sections.find(section => section.id === id);
}

/**
 * @param {Sleep} sleep
 * @param {Number} id
 * @return {Number}
 */
function sleepSectionIndexById(sleep, id) {
  return sleep.sections.findIndex(section => section.id === id);
}

function updateFrom(a, b, msg) {
  if (b.id !== a.id) {
    console.error(`updateFrom error: ids do not match (this id:${a.id} != that id:${b.id})`);
    return;
  }

  let message = `${msg} id: ${a.id} updated`;

  Object.keys(a)
      .forEach(key => {
        if (key === 'id') {
          return;
        }

        if (a[key] !== b[key]) {
          a[key] = b[key];
          message += ` ${key} (${a[key]})`;
        }
      });

  console.log(message);
}

io.on('connection', socket => {
  console.log('client connected');
  // send all data to client
  socket.emit('sleeps', sleeps);
  socket.emit('schedule', schedule);

  function refresh() {
    console.log('refresh');
    socket.emit('sleeps', sleeps);
  }

  /**
   * @param {Sleep} sleep
   */
  function updateSleep(sleep) {
    const localCopy = sleepById(sleep.id);
    if (localCopy === undefined) {
      console.log(`added sleep with id = ${sleep.id}`);
      sleeps.push(sleep);
    } else {
      updateFrom(localCopy, sleep, `sleep`);
    }

    socket.broadcast.emit('update-sleep', sleep);
    save();
  }

  /**
   * @param {Number} id
   */
  function deleteSleep(id) {
    const index = sleepIndexById(id);
    if (index === -1) {
      console.warn(`unable to find sleep with id = ${id} to delete`);
    } else {
      console.log(`deleted sleep with id = ${id}`);
      sleeps.splice(index, 1);
    }
    socket.broadcast.emit('delete-sleep', id);
  }

  /**
   * @param {Number} sleepId
   * @param {SleepSection} section
   */
  function updateSleepSection({sleepId, section}) {
    const sleep = sleepById(sleepId);
    const localSection = sleepSectionById(sleep, section.id);
    if (localSection === undefined) {
      console.log(`added section with id = ${section.id} to sleep id = ${sleepId}`);
      sleep.sections.push(section);
    } else {
      updateFrom(localSection, section, `(sleep id = ${sleepId}) section`);
    }

    socket.broadcast.emit('update-sleep-section', {sleepId, section});
    save();
  }

  /**
   * @param {Number} sleepId
   * @param {Number} sectionId
   */
  function deleteSleepSection({sleepId, sectionId}) {
    const sleep = sleepById(sleepId);
    const index = sleepSectionIndexById(sleep, sectionId);
    if (index === -1) {
      console.warn(`unable to find section with id = ${sectionId} in sleep id = ${sleepId} to delete`);
    } else {
      console.log(`deleted section with id = ${sectionId} in sleep id = ${sleepId}`);
      sleep.sections.splice(index, 1);
    }

    socket.broadcast.emit('delete-sleep-section', {sleepId, sectionId});
    save();
  }

  function updateSchedule(s) {
    console.log('update schedule');
    schedule = s;
    socket.broadcast.emit('schedule', s);
    save();
  }


  socket.on('refresh', refresh);
  socket.on('update-sleep', updateSleep);
  socket.on('delete-sleep', deleteSleep);
  socket.on('update-sleep-section', updateSleepSection);
  socket.on('delete-sleep-section', deleteSleepSection);
  socket.on('update-schedule', updateSchedule);
});

function save() {
  let d = {
    sleeps,
    schedule
  };
  fs.writeFileSync(jsonPath, JSON.stringify(d, null, 2), 'utf8');
}

console.log('listening on port 3002');
