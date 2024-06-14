import { WebSocket } from 'ws';
import { encode } from './lib/worldflare-shared/codec.js';
import type { Worldflare } from './lib/worldflare-shared/types.js';
import { connectedUsers } from './connectedUsers.js';

export function send(message: Worldflare.App.Message, socket: WebSocket) {
  try {
    socket.send(encode(message));
  } catch (error) {
    console.log('Error in send function, wsUtilities.ts, a server file');
  }
}

export function broadcast(message: Worldflare.App.Message) {
  connectedUsers.forEach((uniqueId, socket) => {
    // send to everyone but the current sender
    if (uniqueId !== message.wsConnId) {
      send(message, socket);
    }
  });
}
