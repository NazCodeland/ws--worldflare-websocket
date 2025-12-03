import { WebSocket } from 'ws';
import handleUserEvents from './userEvents';
import { decode } from '$src/lib/worldflare-shared/codec';
import { Worldflare } from '$src/lib/worldflare-shared/types';
import { messages } from '$src/lib/stores/messages';

export default function handleAllEvents(socket: WebSocket) {
  socket.on('message', function (rawMessage: ArrayBufferLike) {
    const decodedMessage = decode(new Uint8Array(rawMessage));

    // updates the message if it exists, otherwise creates a new message
    messages.set(decodedMessage.wsConnId, decodedMessage);

    switch (decodedMessage.type) {
      case Worldflare.App.Type.User:
        handleUserEvents(decodedMessage);
        break;

      case Worldflare.App.Type.Npc:
        // handleNpcEvents(socket);
        break;

      default:
        console.log('Unknown message type:', decodedMessage.type);
        break;
    }
  });
}
