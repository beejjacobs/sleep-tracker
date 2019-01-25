import io from 'socket.io-client';

const url = process.env.NODE_ENV === 'production' ? '192.168.0.2' : 'localhost';
const socket = io.connect(`http://${url}:3003`);

const SocketStorePlugin = store => {
  socket.on('connect', () => {
    store.commit('setConnected', true);
    store.commit('updateLastConnected');
    store.dispatch('fakeSleep');
  });
  socket.on('disconnect', () => {
    store.commit('setConnected', false);
  });

  socket.on('sleeps', sleeps => {
    store.commit('setSleeps', sleeps);
  });
};

export {SocketStorePlugin, socket};
export default socket;
