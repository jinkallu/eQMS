function arrayBufferToBase64(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);

  // Convert the Uint8Array to a Base64 encoded string
  let binary = "";
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
  return window.btoa(binary);
}

export { arrayBufferToBase64 };
