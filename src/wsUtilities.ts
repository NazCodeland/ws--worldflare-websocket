import { WebSocket } from 'ws';
import { encode } from './lib/worldflare-shared/codec.js';
import { messages } from './lib/stores/messages.js';
import { ConnectionManager } from './lib/stores/connectionManager.js';
import { Worldflare } from './lib/worldflare-shared/types.js';

export function send(message: Worldflare.App.BaseWsMessage, socket: WebSocket) {
  message.origin = Worldflare.App.Origin.Websocket;
  try {
    socket.send(encode(message));
  } catch (error) {
    console.error('Error in send function, wsUtilities.ts, a server file');
  }
}

export function broadcast(message: Worldflare.App.BaseWsMessage, newConnection: boolean = false) {
  function broadcasToMatchingScope() {
    const matchingScopedSockets = ConnectionManager.scopeToSockets.get(message.scope)
  }

  function broadcastNewUserMessage() {
    ConnectionManager.forEachWsConnId((wsConnId, socket) => {
      // broadcast the new client's message to all other connected clients
      if (message.wsConnId !== wsConnId) {
        console.log('broadcasting message to:', wsConnId);
        send(message, socket);
      } else {
        console.log(
          'skipping broadcast to current sender: uniqueId:',
          message.wsConnId,
          'wsConnId',
          wsConnId,
        );
      }
    });
  }

  function sendExistingMessagesToNewUser() {
    messages.forEach((storedMessage, wsConnId) => {
      if (storedMessage.wsConnId !== message.wsConnId) {
        const currentSocket = ConnectionManager.getSocket(message.wsConnId);
        currentSocket !== undefined
          ? send(storedMessage, currentSocket)
          : console.log('socket not found for current wsConnId:', wsConnId);
      } else {
        console.log(
          'skipping sending existing messages to new user: wsConnId:',
          wsConnId,
          'wsConnId',
          storedMessage.wsConnId,
        );
      }
    });
  }

  broadcastNewUserMessage();
  if (newConnection) {
    sendExistingMessagesToNewUser();
  }
}
