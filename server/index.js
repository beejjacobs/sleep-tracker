const io = require('socket.io')(3003);
const fs = require('fs');
const path = require('path');
const Sleep = require('./sleep');

let jsonPath = path.join(__dirname, 'sleeps.json');
console.log(jsonPath);

/**
 * @type {{sleeps, schedule}}
 */
let data = require(jsonPath);

/**
 * @type {Sleep[]}
 */
let sleeps = data.sleeps.map(obj => new Sleep(obj));

let schedule = data.schedule;

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
   * @param {Object} sleep
   */
  function updateSleep(sleep) {
    sleep = new Sleep(sleep);
    const localCopy = sleepById(sleep.id);
    if (localCopy === undefined) {
      console.log(`added sleep with id = ${sleep.id}`);
      sleeps.push(sleep);
    } else {
      localCopy.updateFrom(sleep);
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
      console.warn(`unable to find sleep with id = ${id} to delete`)
    } else {
      console.log(`deleted sleep with id = ${id}`);
      sleeps.splice(index, 1);
    }
    socket.broadcast.emit('delete-sleep', id);
  }

  function updateSchedule(s) {
    console.log('update schedule');
    schedule = s;
    socket.broadcast.emit('update-schedule', s);
    save();
  }

  socket.on('refresh', refresh);
  socket.on('update-sleep', updateSleep);
  socket.on('delete-sleep', deleteSleep);
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
