// a map of all the connected users connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique wsConnId

export class ConnectionManager {
  private static socketToWsConnId = new Map<WebSocket, number>();
  private static wsConnIdToSocket = new Map<number, WebSocket>();

  static addConnection(socket: WebSocket, wsConnId: number) {
    this.socketToWsConnId.set(socket, wsConnId);
    this.wsConnIdToSocket.set(wsConnId, socket);
  }

  static removeConnection(socket: WebSocket) {
    const wsConnId = this.socketToWsConnId.get(socket);
    this.socketToWsConnId.delete(socket);
    if (wsConnId) {
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
}
