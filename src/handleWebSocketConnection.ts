import { ConnectionManager } from './lib/stores/connectionManager';
import { messages } from './lib/stores/messages';
import { createMessage } from './lib/worldflare-shared/createMessage';
import { Worldflare } from './lib/worldflare-shared/types';
import { broadcast, send } from './wsUtilities';

let uniqueUserId = 1;

export default function handleWebSocketConnection(socket: WebSocket): void {
  console.log('Websocket: Connected to client');
  // STEP 0
  ConnectionManager.addConnection(socket, uniqueUserId);

  // send uniqueUserId back to the client
  const message = createMessage({
    origin: Worldflare.App.Origin.Websocket,
    reason: Worldflare.App.Reason.UserConnected,
    wsConnId: uniqueUserId,
    type: Worldflare.App.Type.User,
    scope: Worldflare.App.Scope.Global,
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
      const message = createMessage({
        origin: Worldflare.App.Origin.Websocket,
        reason: Worldflare.App.Reason.UserDisconnected,
        wsConnId: uniqueUserId,
        type: Worldflare.App.Type.User,
        scope: Worldflare.App.Scope.Global,
        payload: { data: { coordinates: { lat: 0, lng: 0 } } },
      });

      broadcast(message);

      // remove the message associated with the disconnected connection
      messages.delete(message.wsConnId);
      // remove the disconnected connection
      ConnectionManager.removeConnection(socket);
    }
  });
}
