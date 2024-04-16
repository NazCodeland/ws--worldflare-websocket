// 

// since all the fields of this function are needed, there doesn't
// seem to be that of a utility for it right now, other than, a centralized
// place where this message object is created (this object is used in a lot places)
export default function createMessage({ origin, reason, wsConnId, scope, type, payload }: App.Message =
  { origin: '', reason: '', wsConnId: 0, type: '', scope: '', payload: { data: { coordinates: { lat: 0, lng: 0 } } } }) {
  const message = {
    "origin": origin,
    "reason": reason,
    "wsConnId": wsConnId,
    "type": type,
    "scope": scope,
    "payload": payload
  }

  return message
}
