// a map of all the connected users connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique wsConnId


import { Worldflare } from "../worldflare-shared/types";

// 1. client connects to server
// 2. wsConnId is sent to client
// 3. client sends message object
// 4. message object contains scope property
// 5. 
// 6.
// 7.
// 8.
// 9.
// 10.


export class ConnectionManager {
  private static socketToWsConnId = new Map<WebSocket, number>();
  private static wsConnIdToSocket = new Map<number, WebSocket>();
  private static scopeToSockets = new Map<Worldflare.App.Scope, Set<WebSocket>>();


  static addConnection(socket: WebSocket, wsConnId: number, scope: Worldflare.App.Scope = Worldflare.App.Scope.Unknown) {
    this.socketToWsConnId.set(socket, wsConnId);
    this.wsConnIdToSocket.set(wsConnId, socket);

    const scopedSocketSet = this.scopeToSockets.get(scope)
    scopedSocketSet ? scopedSocketSet.add(socket) : this.scopeToSockets.set(scope, new Set([socket]));
  }

  static removeConnection(socket: WebSocket) {
    const wsConnId = this.socketToWsConnId.get(socket);
    this.socketToWsConnId.delete(socket);
    if (wsConnId !== undefined) {
      this.wsConnIdToSocket.delete(wsConnId);
    }
  }

  static getSocket(wsConnId: number): WebSocket | undefined {
    return this.wsConnIdToSocket.get(wsConnId);
  }

  static getWsConnId(socket: WebSocket): number | undefined {
    return this.socketToWsConnId.get(socket);
  }

  static forEachWsConnId(callback: (wsConnId: number, socket: WebSocket) => void) {
    this.socketToWsConnId.forEach(callback);
  }

  static forEachSocket(callback: (socket: WebSocket, wsConnId: number) => void) {
    this.wsConnIdToSocket.forEach(callback);
  }

  static getSocketsByScope(scope: Worldflare.App.Scope): Set<WebSocket> | undefined {
    return this.scopeToSockets.get(scope);
  }
}
