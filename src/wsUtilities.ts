import { WebSocket } from 'ws';
import { encode } from './lib/worldflare-shared/codec.js';
import type { Worldflare } from './lib/worldflare-shared/types.js';
import { messages } from './lib/stores/messages.js';
import { ConnectionManager } from './lib/stores/connectionManager.js';

export function send(message: Worldflare.App.Message, socket: WebSocket) {
  try {
    socket.send(encode(message));
  } catch (error) {
    console.log('Error in send function, wsUtilities.ts, a server file');
  }
}

export function broadcast(message: Worldflare.App.Message, newConnection: boolean = false) {
  function broadcastNewUserMessage() {
    ConnectionManager.forEachUniqueUserId((uniqueUserId, socket) => {
      // broadcast the new client's message to all other connected clients
      if (message.wsConnId !== uniqueUserId) {
        console.log('broadcasting message to:', uniqueUserId);
        send(message, socket);
      } else {
        console.log(
          'skipping broadcast to current sender: uniqueId:',
          message.wsConnId,
          'wsConnId',
          uniqueUserId,
        );
      }
    });
  }

  function sendExistingMessagesToNewUser() {
    messages.forEach((message, wsConnId) => {
      if (message.wsConnId !== wsConnId) {
        console.log('sending message to new client:', message.wsConnId, 'wsConnId', wsConnId);
        const socket = ConnectionManager.getSocket(message.wsConnId);
        socket !== undefined
          ? send(message, socket)
          : console.log('socket not found for wsConnId:', wsConnId);
      } else {
        console.log(
          'skipping sending existing messages to new user: wsConnId:',
          wsConnId,
          'wsConnId',
          message.wsConnId,
        );
      }
    });
  }

  broadcastNewUserMessage();
  if (newConnection) {
    sendExistingMessagesToNewUser();
  }
}
