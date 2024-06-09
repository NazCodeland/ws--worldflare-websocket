import { WebSocket } from 'ws';
import { encode } from './lib/worldflare-shared/codec.js';
import type { Worldflare } from './lib/worldflare-shared/types.js';
import { ws } from './websocket.js';

export function send(message: Worldflare.App.Message, client: WebSocket) {
  try {
    client.send(encode(message));
  } catch (error) {
    console.log('Error in send function, wsUtilities.ts, a server file');
  }
}

export function broadcast(message: Worldflare.App.Message, connection: WebSocket) {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      send(message, client);
    }
  });
}
