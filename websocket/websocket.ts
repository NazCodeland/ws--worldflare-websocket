
import { WebSocketServer } from "ws";
import handleUserEvents from "./events/userEvents";

console.log("WEBSOCKET CONNECTION SUCCESSFUL")
console.log("------------------------------------")

const PORT = 8080
export const ws = new WebSocketServer({ port: PORT })

// register the websocket message (events) handlers
handleUserEvents()
