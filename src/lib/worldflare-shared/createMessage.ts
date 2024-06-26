import { Worldflare } from './types';

// since all the fields of this function are needed, there doesn't
// seem to be that of a utility for it right now, other than, a centralized
// place where this message object is created (this object is used in a lot places)
export function createMessage(
  { origin, reason, wsConnId, type, scope, payload }: Worldflare.App.Message = {
    origin: Worldflare.App.Origin.Websocket,
    reason: Worldflare.App.Reason.Unknown,
    wsConnId: 0,
    type: Worldflare.App.Type.Unknown,
    scope: Worldflare.App.Scope.Unknown,
    payload: { data: { coordinates: { lat: 0, lng: 0 } } },
  },
) {
  const message: Worldflare.App.Message = {
    origin: origin,
    reason: reason,
    wsConnId: wsConnId,
    type: type,
    scope: scope,
    payload: payload,
  };

  return message;
}
