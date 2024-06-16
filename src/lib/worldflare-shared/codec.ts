import { createWebSocketMessage } from './createWebSocketMessage';
import { Worldflare } from './types';

// TODO: future optimization: the addFloat64 uses up 8 bytes of memory
// even when all of it is not needed. This extra used
class Uint8ArrayWriter {
  // The offset tells you at which position (or index) in the
  // Uint8Array you should write the next byte of data.
  offset = 0;
  viewFloat32: DataView;
  viewFloat64: DataView;
  constructor(public array: Uint8Array) {
    this.viewFloat32 = new DataView(this.array.buffer, this.offset);
    this.viewFloat64 = new DataView(this.array.buffer, this.offset);
  }
  addByte(value: number) {
    this.array[this.offset] = value;
    this.offset += 1;
  }
  addFloat32(value: number) {
    this.viewFloat64.setFloat32(this.offset, value, false);
    this.offset += 4;
  }
  addFloat64(value: number) {
    this.viewFloat64.setFloat64(this.offset, value, false);
    this.offset += 8;
  }
}
class Uint8ArrayReader {
  offset = 0;
  viewFloat32: DataView;
  viewFloat64: DataView;
  constructor(public array: Uint8Array) {
    this.viewFloat32 = new DataView(this.array.buffer, this.offset);
    this.viewFloat64 = new DataView(this.array.buffer, this.offset);
  }
  getByte() {
    const value = this.array[this.offset];
    this.offset += 1;
    return value;
  }
  getFloat32() {
    const value = this.viewFloat32.getFloat32(this.offset, false);
    this.offset += 4;
    return value;
  }
  getFloat64() {
    const value = this.viewFloat64.getFloat64(this.offset, false);
    this.offset += 8;
    return value;
  }
}

// serialize
export function encode({ origin, reason, wsConnId, type, scope, payload }: Worldflare.App.Message) {
  const bytes = new Uint8Array(256);
  const w = new Uint8ArrayWriter(bytes);
  w.addByte(origin);
  w.addByte(reason);
  w.addByte(type);
  w.addByte(scope);

  w.addFloat64(wsConnId);

  w.addFloat32(payload.data.coordinates.lat);
  w.addFloat32(payload.data.coordinates.lng);

  return bytes.slice(0, w.offset);
}
// deserialize
export function decode(bytes: Uint8Array) {
  const r = new Uint8ArrayReader(bytes);
  const message: Worldflare.App.Message = createWebSocketMessage({
    origin: r.getByte(),
    reason: r.getByte(),
    type: r.getByte(),
    scope: r.getByte(),

    wsConnId: r.getFloat64(),

    payload: {
      data: {
        coordinates: { lat: r.getFloat32(), lng: r.getFloat32() },
      },
    },
  });
  return message;
}
