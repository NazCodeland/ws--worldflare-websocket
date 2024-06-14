import { broadcast } from '$src/wsUtilities';
import { Worldflare } from '$src/lib/worldflare-shared/types';

export default function handleUserEvents(message: Worldflare.App.Message): void {
  // create geolocationMessage  and broadcast to all connected connected users except current sender
  if (message.reason === Worldflare.App.Reason.UserGeolocation) {
    console.log('websocket: geolocation received from client');
    console.log(`----------------------------------------------------`);
    console.log('msg', JSON.stringify(message));
    console.log(`----------------------------------------------------`);

    message.origin = Worldflare.App.Origin.Websocket;

    broadcast(message);
  }
}
// })

//   -------------------------------------------------------------------------
