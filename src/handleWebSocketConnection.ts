import { ConnectionManager } from './lib/stores/connectionManager';
import { messages } from './lib/stores/messages';
import { createWebSocketMessage } from './lib/worldflare-shared/createWebSocketMessage';
import { Worldflare } from './lib/worldflare-shared/types';
import { broadcast, send } from './wsUtilities';

let uniqueUserId = 1;

export default function handleWebSocketConnection(socket: WebSocket): void {
  console.log('Websocket: Connected to client');
  // STEP 0

  ConnectionManager.addConnection(socket, uniqueUserId);

  // send uniqueUserId back to the client
  const message = createWebSocketMessage({
    origin: Worldflare.App.Origin.Websocket,
    reason: Worldflare.App.Reason.UserConnected,
    wsConnId: uniqueUserId,
    type: Worldflare.App.Type.User,
    scope: Worldflare.App.Scope.Unknown,
    payload: { data: { coordinates: { lat: 0, lng: 0 } } },
  });
  send(message, socket);
  console.log('websocket: uniqueUserId sent to client, message:', message);
  console.log('');
  uniqueUserId++;

  socket.on('close', () => {
    console.log('Websocket: client disconnected');
    // when a socket connection is "closed", broadcast the "ID"
    const uniqueUserId = ConnectionManager.getUniqueUserId(socket);
    if (uniqueUserId !== undefined) {
      const storedMessage = messages.get(uniqueUserId);
      const message = createWebSocketMessage({
        origin: Worldflare.App.Origin.Websocket,
        reason: Worldflare.App.Reason.UserDisconnected,
        wsConnId: uniqueUserId,
        type: Worldflare.App.Type.User,
        scope: Worldflare.App.Scope.Unknown,
        payload: { data: { coordinates: { lat: 0, lng: 0 } } },
      });
      if (storedMessage !== undefined) {
        broadcast(message);
      }
      messages.delete(message.wsConnId);
      ConnectionManager.removeConnection(socket);
    }
  });
}
