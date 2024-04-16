export function encode(message: App.Message) {
  // Create a TextEncoder
  const encoder = new TextEncoder();

  // Encode the serialized data
  const encoded = encoder.encode(JSON.stringify(message));

  // Return the encoded data
  return encoded;
}


export function decode(message: Uint8Array) {
  // Create a TextDecoder
  const decoder = new TextDecoder();

  // Decode the encoded data
  const decoded: App.Message = JSON.parse(decoder.decode(message));

  // Return the decoded data
  return decoded;
}


