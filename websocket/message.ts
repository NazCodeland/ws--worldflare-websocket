// 

export default function createMessage({ origin, reason, id, payload }: App.Message =
  { origin: 'websocket', reason: '', id: 0, payload: { scope: '', data: { coordinates: { lat: 0, lng: 0 } } } }) {

  return JSON.stringify({
    "origin": origin,
    "reason": reason,
    "id": id,
    "payload": {
      "scope": payload?.scope,
      "data": {
        coordinates: payload?.data.coordinates
      }
    }
  })

}
