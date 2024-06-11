//
import { WebSocketServer } from 'ws';
import handleAllEvents from './events/index';
import handleWebSocketConnection from './handleWebSocketConnection';
console.log('WEBSOCKET CONNECTION SUCCESSFUL');
console.log('------------------------------------');

const PORT = 8080;
export const ws = new WebSocketServer({ port: PORT });

// -----------------------------------------------------
ws.on('connection', (socket) => {
  console.log('Websocket: Connected to client');
  handleWebSocketConnection(socket);
  handleAllEvents(socket);
});

ws.on('error', (err) => {
  console.log('Websocket: Error occurred', err);
});

ws.on('close', () => {
  console.log('Websocket server disconnected');
});
// -----------------------------------------------------
