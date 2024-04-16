import { WebSocket } from 'ws';
import createMessage from '../message.js';
import { ws } from '../websocket.js'
// a map of all the "clients" connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique ID
const clients = new Map();
let uniqueId = 1;


export default function handleUserEvents(socket: WebSocket): void {
  // add connection to `clients` map object
  clients.set(socket, uniqueId)
  console.log("WITHIN SOCKET CODE")
  // STEP 0
  //   ---------------------------------------------------------------------------
  // send back existing uniqueId for connection else, a new uniqueId
  const userConnectedMessage = createMessage({ reason: "user-connected", id: uniqueId })
  console.log("Websocket: sending 'user-connected' message", userConnectedMessage)
  socket.send(userConnectedMessage);
  uniqueId++;

  // STEP 1
  // ---------------------------------------------------------------------------
  // when a socket connection is "closed", broadcast the "ID"     
  socket.on('close', function close() {
    clients.delete(socket)

    const userDisconnectedMessage = createMessage({ reason: "user-disconnected", id: clients.get(socket) })
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
      reason: "user-geolocation",
      id: clients.get(socket) ?? uniqueId,
      payload: { data: { coordinates: message.payload.data.coordinates } },
    })
    //  // 'ws.clients' is an array of active websocket connections
    ws.clients.forEach(client => {
      // 'socket' represents the current websocket connection
      // 'client' represents a unique websocket connection
      if (socket != client) {
        console.log("Websocket: Sending geolocation to each client", geolocationMessage)
        client.send(JSON.stringify(geolocationMessage));

      }
      else { console.log("") }
    });
  });
}

//   -------------------------------------------------------------------------
