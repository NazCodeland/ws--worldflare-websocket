// a map of all the connected users connected to the WebSocket Server.
// the 'key' value represents the socket connection and the 'value' represents the unique ID

export class ConnectionManager {
  private static socketToUniqueUserId = new Map<WebSocket, number>();
  private static uniqueUserIdToSocket = new Map<number, WebSocket>();

  static addConnection(socket: WebSocket, uniqueUserId: number) {
    this.socketToUniqueUserId.set(socket, uniqueUserId);
    this.uniqueUserIdToSocket.set(uniqueUserId, socket);
  }

  static removeConnection(socket: WebSocket) {
    const uniqueUserId = this.socketToUniqueUserId.get(socket);
    this.socketToUniqueUserId.delete(socket);
    if (uniqueUserId) {
      this.uniqueUserIdToSocket.delete(uniqueUserId);
    }
  }

  static getSocket(uniqueUserId: number): WebSocket | undefined {
    return this.uniqueUserIdToSocket.get(uniqueUserId);
  }

  static getUniqueUserId(socket: WebSocket): number | undefined {
    return this.socketToUniqueUserId.get(socket);
  }

  static forEachUniqueUserId(callback: (uniqueUserId: number, socket: WebSocket) => void) {
    this.socketToUniqueUserId.forEach(callback);
  }

  static forEachSocket(callback: (socket: WebSocket, uniqueUserId: number) => void) {
    this.uniqueUserIdToSocket.forEach(callback);
  }
}
