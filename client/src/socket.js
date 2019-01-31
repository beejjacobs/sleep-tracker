import io from 'socket.io-client';

const url = process.env.NODE_ENV === 'production' ? '192.168.0.2' : 'localhost';
const socket = io.connect(`http://${url}:3004`);

const SocketStorePlugin = store => {
  socket.on('connect', () => {
    store.commit('setConnected', true);
    store.commit('updateLastConnected');
    store.commit('schedule/setOfflineScheduleChanged', false);
  });

  socket.on('disconnect', () => store.commit('setConnected', false));
  socket.on('sleeps', sleeps => store.commit('sleep/setSleeps', sleeps));
  socket.on('update-sleep', data => store.commit('sleep/updateSleep', data));
  socket.on('delete-sleep', data => store.commit('sleep/deleteSleep', data));
  socket.on('update-sleep-section', data => store.commit('sleep/updateSleepSection', data));
  socket.on('delete-sleep-section', data => store.commit('sleep/deleteSleepSection', data));
  socket.on('schedule', schedule => store.commit('schedule/setSchedule', schedule));
};

export {SocketStorePlugin, socket};
export default socket;
