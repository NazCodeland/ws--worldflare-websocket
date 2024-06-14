import { WebSocket } from 'ws';
import handleUserEvents from './userEvents';
import { decode } from '$src/lib/worldflare-shared/codec';
import { Worldflare } from '$src/lib/worldflare-shared/types';

export default function handleAllEvents(socket: WebSocket) {
  socket.on('message', function (rawMessage: ArrayBufferLike) {
    const decodedMessage = decode(new Uint8Array(rawMessage));

    switch (decodedMessage.type) {
      case Worldflare.App.Type.User: // user
        handleUserEvents(decodedMessage);
        break;

      case Worldflare.App.Type.Npc: // npc
        // handleNpcEvents(socket);
        break;

      default:
        console.log('Unknown message type:', decodedMessage.type);
        break;
    }
  });
}
