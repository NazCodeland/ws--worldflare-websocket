
import { App, encode } from "@worldflare/shared";
import { ws } from "./websocket";
import { WebSocket } from 'ws';

export function send(message: App.Message, client: WebSocket) {
  try {
    client.send(encode(message))
  } catch (error) {
    console.log("Error in send function, wsUtilities.ts, a server file")
  }
}

export function broadcast(message: App.Message, connection: WebSocket) {
  ws.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      send(message, client);
      // if (connection != client) {
      // }
    }
  })
}


