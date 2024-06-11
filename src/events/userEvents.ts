import { broadcast } from '$src/wsUtilities';
import { Worldflare } from '$src/lib/worldflare-shared/types';

export default function handleUserEvents(message: Worldflare.App.Message): void {
  // create geolocationMessage  and broadcast to all connected connectedUsers except current sender
  if (message.reason === Worldflare.App.Reason.UserGeolocation) {
    message.origin = Worldflare.App.Origin.Websocket;
    broadcast(message);
  }
}
// })

//   -------------------------------------------------------------------------
