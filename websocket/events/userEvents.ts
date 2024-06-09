import { WebSocket } from 'ws';


import { broadcast, send } from '../wsUtilities.js';

import { clients } from '../clients.js';
import { App, createMessage, decode } from '@worldflare/shared';
// a map of all the "clients" connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique ID

export let uniqueId = 1;
// ws.on("connection", (socket, request) => {
//   handleUserEvents(socket)
export default function handleUserEvents(socket: WebSocket): void {
  // STEP 0
  // add the current connection to 'clients' map object
  // clients.set(socket, uniqueId)
  // send back existing uniqueId for connection. If it doesn't exist use  a new uniqueId
  const message = createMessage(
    {
      origin: App.Origin.Websocket,
      reason: App.Reason.UserConnected,
      wsConnId: uniqueId,
      type: App.Type.User,
      scope: App.Scope.Global,
      payload: { data: { coordinates: { lat: 0, lng: 0 } } }
    })
  send(message, socket)
  uniqueId++


  // when a socket connection is "closed", broadcast the "ID"     
  socket.on('close', () => {
    console.log("Websocket: user disconnected")
    // remove the client websocket connection from the 'clients' Map object
    clients.delete(socket)

    const message = createMessage({
      origin: App.Origin.Websocket,
      reason: App.Reason.UserDisconnected,
      wsConnId: clients.get(socket),
      type: App.Type.User,
      scope: App.Scope.Global,
      payload: { data: { coordinates: { lat: 0, lng: 0 } } }
    })
    broadcast(message, socket)
    console.log('----------------------------------------------------')
  });


  // create geolocationMessage  and broadcast to all connected clients except current sender  
  socket.on("message", function incoming(rawMessage: ArrayBufferLike) {
    const decodedMessage = decode(new Uint8Array(rawMessage))
    console.log(`----------------------------------------------------`)
    console.log("msg", JSON.stringify(decodedMessage))
    console.log(`----------------------------------------------------`)

    if (decodedMessage.type !== App.Type.User) return
    if (decodedMessage.reason === App.Reason.UserGeolocation) {
      decodedMessage.origin = App.Origin.Websocket
      broadcast(decodedMessage, socket)
    }
  });
}
// })


//   -------------------------------------------------------------------------
