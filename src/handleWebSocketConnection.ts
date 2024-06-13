import { connectedUsers } from './connectedUsers';
import { createMessage } from './lib/worldflare-shared/createMessage';
import { Worldflare } from './lib/worldflare-shared/types';
import { broadcast, send } from './wsUtilities';

export let uniqueId = 1;

export default function handleWebSocketConnection(socket: WebSocket): void {
  console.log("")
  // STEP 0
  // add the current connection to 'connectedUsers' map object
  connectedUsers.set(socket, uniqueId);

  // send uniqueId back to the client
  const message = createMessage({
    origin: Worldflare.App.Origin.Websocket,
    reason: Worldflare.App.Reason.UserConnected,
    wsConnId: uniqueId,
    type: Worldflare.App.Type.User,
    scope: Worldflare.App.Scope.Global,
    payload: { data: { coordinates: { lat: 0, lng: 0 } } },
  });
  send(message, socket);
  console.log("websocket: uniqueId sent to client")
  uniqueId++;

  socket.on('close', () => {
    console.log('Websocket: client disconnected');

    // when a socket connection is "closed", broadcast the "ID"
    const message = createMessage({
      origin: Worldflare.App.Origin.Websocket,
      reason: Worldflare.App.Reason.UserDisconnected,
      wsConnId: connectedUsers.get(socket),
      type: Worldflare.App.Type.User,
      scope: Worldflare.App.Scope.Global,
      payload: { data: { coordinates: { lat: 0, lng: 0 } } },
    });
    broadcast(message);

    // remove the disconnected connection from 'connectedUsers' map object
    connectedUsers.delete(socket);
  });
}
