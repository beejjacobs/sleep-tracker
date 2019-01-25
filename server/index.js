const io = require('socket.io')(3003);
const fs = require('fs');
const path = require('path');
const Sleep = require('./sleep');

let jsonPath = path.join(__dirname, 'sleeps.json');
console.log(jsonPath);

/**
 * @type {Sleep[]}
 */
let sleeps = require(jsonPath).map(obj => new Sleep(obj));

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
  // send all sleeps to client
  socket.emit('sleeps', sleeps);

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

  socket.on('refresh', refresh);
  socket.on('update-sleep', updateSleep);
  socket.on('delete-sleep', deleteSleep)
});

function save() {
  fs.writeFileSync(jsonPath, JSON.stringify(sleeps, null, 2), 'utf8');
}

console.log('listening on port 3002');
