import createMessage from "./createMessage";

const reasons = [
  "user-connected",
  "user-disconnected",
  "user-disconnected",
]
const types = [
  "user",
  "npc",
]
const scopes = [
  "global",
  "continent",
  "country",
  "province",
  "city",
  "town",
  "area"
]


// for both of these functions, for future refactoring if it makes sense,
// this can be refactored it something like this messageSchema.origin(origin))
export function serialize({ origin, reason, wsConnId, type, scope, payload }: App.Message) {
  // Create an array to hold the serialized data
  const serialized: App.SerializedMessage = [
    origin === 'websocket' ? 0 : 1,
    reasons.findIndex((rsn: string) => rsn == reason),
    wsConnId,
    types.findIndex((t: string) => t == type),
    scopes.findIndex((s: string) => s == scope),
    payload,
  ]

  return serialized
}


// because the type definition of SerializedMessage,
// it seems like I am forced to use type assertion 'as' 
export function deserializeMessage(serializedMsg: App.SerializedMessage) {  // Create an object to hold the deserialized data
  const deserialize: App.Message = createMessage({
    "origin": serializedMsg[0] === 0 ? 'websocket' : 'client',
    "reason": reasons[serializedMsg[1] as number],
    "wsConnId": serializedMsg[2] as number,
    "type": types[serializedMsg[3] as number],
    "scope": scopes[serializedMsg[4] as number],
    "payload": serializedMsg[5] as { data: { coordinates: App.Coordinates } }
  })

  return deserialize;
}



















