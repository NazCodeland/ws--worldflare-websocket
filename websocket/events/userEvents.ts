import { WebSocket } from 'ws';
import createMessage from '../createMessage.js';
import { ws } from '../websocket.js'
import { App } from '../types.js';
// a map of all the "clients" connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique ID
const clients = new Map();
let uniqueId = 1;



export default function handleUserEvents(socket: WebSocket): void {

  // add the current connection to 'clients' map object
  clients.set(socket, uniqueId)

  // STEP 0
  //   ---------------------------------------------------------------------------
  // send back existing uniqueId for connection else, a new uniqueId
  console.log('------------------------------2222--------------------------------')
  const userConnectedMessage = createMessage(
    {
      origin: App.Origin.Websocket,
      reason: App.Reason.UserConnected,
      wsConnId: uniqueId,
      type: App.Type.User,
      scope: App.Scope.Global,
      payload: { data: { coordinates: { lat: 0, lng: 0 } } }
    })

  console.log('-----------------sending back message------------------------------')
  socket.send(userConnectedMessage);
  uniqueId++;

  // STEP 1
  // ---------------------------------------------------------------------------
  // when a socket connection is "closed", broadcast the "ID"     
  socket.on('close', function close() {
    clients.delete(socket)

    const userDisconnectedMessage = createMessage({
      origin: App.Origin.Websocket,
      reason: App.Reason.UserDisconnected,
      wsConnId: clients.get(socket),
      type: App.Type.User,
      scope: App.Scope.Global,
      payload: { data: { coordinates: { lat: 0, lng: 0 } } }
    })

    console.log("Websocket: user disconnected")
    if (clients.size) { console.log("sending message (id),", userDisconnectedMessage) }
    // broadcast 'userDisconnectedMessage' for the disconnected connection 
    ws.clients.forEach(client => {
      client.send(userDisconnectedMessage)
    })
  });

  // ---------------------------------------------------------------------------
  // STEP 2
  socket.on("message", rawMessage => {
    console.log("Websocket: Received message from Client " + rawMessage)
    const message = JSON.parse(rawMessage.toString())

    // create geolocationMessage  and broadcast to all connected clients except current sender  
    const geolocationMessage = createMessage({
      origin: App.Origin.Websocket,
      reason: App.Reason.UserGeolocation,
      wsConnId: clients.get(socket) ?? uniqueId,
      type: App.Type.User,
      scope: App.Scope.Global,
      payload: { data: { coordinates: message.payload.data.coordinates } },
    })
    //  // 'ws.clients' is an array of active websocket connections

    ws.clients.forEach(client => {
      // 'socket' represents the current websocket connection
      // 'client' represents a unique websocket connection
      if (socket != client) {
        console.log("Websocket: Sending geolocation to each client", geolocationMessage)
        client.send(geolocationMessage);

      }
      else { console.log("") }
    });
  });
}

//   -------------------------------------------------------------------------
