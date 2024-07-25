import { ConnectionManager } from './lib/stores/connectionManager';
import { messages } from './lib/stores/messages';
import { Worldflare } from './lib/worldflare-shared/types';
import { broadcast, send } from './wsUtilities';

// Each client has a unique wsConnId
let wsConnId = 1;

export default function handleWebSocketConnection(socket: WebSocket): void {
  console.log('Websocket: Connected to client');
  // STEP 0

  ConnectionManager.addConnection(socket, wsConnId);

  // send wsConnId back to the client
  const message: Worldflare.App.BaseWsMessage = {
    origin: Worldflare.App.Origin.Websocket,
    reason: Worldflare.App.Reason.UserConnected,
    wsConnId: wsConnId,
    type: Worldflare.App.Type.User,
    scope: Worldflare.App.Scope.Unknown,
    payload: { data: { coordinates: { lat: 0, lng: 0 } } },
  };
  send(message, socket);
  console.log('websocket: wsConnId sent to client, message:', message);
  console.log('');
  wsConnId++;

  socket.on('close', () => {
    console.log('Websocket: client disconnected');
    // when a socket connection is "closed", broadcast the "ID"
    const wsConnId = ConnectionManager.getWsConnId(socket);
    if (wsConnId !== undefined) {
      const storedMessage = messages.get(wsConnId);
      const message: Worldflare.App.BaseWsMessage = {
        origin: Worldflare.App.Origin.Websocket,
        reason: Worldflare.App.Reason.UserDisconnected,
        wsConnId: wsConnId,
        type: Worldflare.App.Type.User,
        scope: Worldflare.App.Scope.Unknown,
        payload: { data: { coordinates: { lat: 0, lng: 0 } } },
      };
      if (storedMessage !== undefined) {
        broadcast(message);
      }
      messages.delete(message.wsConnId);
      ConnectionManager.removeConnection(socket);
    }
  });
}
