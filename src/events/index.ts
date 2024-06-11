import { WebSocket } from 'ws';
import handleUserEvents from './userEvents';
import { decode } from '$src/lib/worldflare-shared/codec';

export default function handleAllEvents(socket: WebSocket) {
  socket.on('message', function (rawMessage: ArrayBufferLike) {
    const decodedMessage = decode(new Uint8Array(rawMessage));

    console.log(`----------------------------------------------------`);
    console.log('msg', JSON.stringify(decodedMessage));
    console.log(`----------------------------------------------------`);

    switch (decodedMessage.type) {
      case 2: // user
        handleUserEvents(decodedMessage);
        break;

      case 3: // npc
        // handleNpcEvents(socket);
        break;

      default:
        console.log('Unknown message type:', decodedMessage.type);
        break;
    }
  });
}
