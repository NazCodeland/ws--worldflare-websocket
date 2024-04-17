// 
import { App } from "./types";

class Uint8ArrayWriter {
  // The offset tells you at which position (or index) in the 
  // Uint8Array you should write the next byte of data.
  offset = 0;
  viewFloat64: DataView;
  constructor(public array: Uint8Array) {
    this.viewFloat64 = new DataView(this.array.buffer, this.offset);
  }
  addByte(value: number) {
    this.array[this.offset] = value;
    this.offset += 1;
  }
  addFloat64(value: number) {
    this.viewFloat64.setFloat64(this.offset, value, false);
    this.offset += 8;
  }
}
class Uint8ArrayReader {
  offset = 0;
  viewFloat64: DataView;
  constructor(public array: Uint8Array) {
    this.viewFloat64 = new DataView(this.array.buffer, this.offset);
  }
  getByte() {
    const value = this.array[this.offset];
    this.offset += 1;
    return value;
  }
  getFloat64() {
    const value = this.viewFloat64.getFloat64(this.offset, false);
    this.offset += 8;
    return value;
  }
}

// serialize
export function encode({ origin, reason, wsConnId, type, scope, payload }: App.Message) {
  const bytes = new Uint8Array(256);
  const w = new Uint8ArrayWriter(bytes);

  w.addByte(origin);
  w.addByte(reason);
  w.addByte(type);
  w.addByte(scope);

  w.addFloat64(wsConnId);

  w.addFloat64(payload.data.coordinates.lat);
  w.addFloat64(payload.data.coordinates.lng);

  return bytes.slice(0, w.offset);
}
// deserialize
export function decode(bytes: Uint8Array) {
  const message: App.Message = {
    origin: 0,
    reason: 0,
    wsConnId: 0,
    type: 0,
    scope: 0,
    payload: {
      data: {
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
    },

  };
  const r = new Uint8ArrayReader(bytes);

  message.origin = r.getByte();
  message.reason = r.getByte();
  message.type = r.getByte();
  message.scope = r.getByte();

  message.wsConnId = r.getFloat64();

  message.payload.data.coordinates.lat = r.getFloat64();
  message.payload.data.coordinates.lng = r.getFloat64();

  return message;
}

// Usage example
// -------------------
// const res1 = deserialize(new Uint8Array([0, 1, 1, 4, 65, 50, 214, 213, 0, 0, 0, 0, 64, 147, 74, 127, 80, 93, 15, 166, 64, 200, 62, 65, 213, 72, 156, 81]));
// console.log(res1)