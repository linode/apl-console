function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i += 1) bytes[i] = binaryString.charCodeAt(i)
  return bytes.buffer
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i += 1) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function pemToDer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/[\r\n\s]/g, '')
    .trim()
  return base64ToArrayBuffer(base64)
}

async function getPublicKeyFromPem(pem) {
  const der = pemToDer(pem)
  return window.crypto.subtle.importKey(
    'spki',
    der,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt'],
  )
}

function stringToArrayBuffer(str) {
  return new TextEncoder().encode(str).buffer
}

async function hybridEncrypt(pubKey, plaintext, label) {
  const sessionKey = window.crypto.getRandomValues(new Uint8Array(32))
  const plaintextBuffer = typeof plaintext === 'string' ? stringToArrayBuffer(plaintext) : plaintext
  const labelBuffer = new TextEncoder().encode(label)
  const rsaEncryptedKey = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP', label: labelBuffer },
    pubKey,
    sessionKey,
  )
  const iv = new Uint8Array(12).fill(0)
  const aesKey = await window.crypto.subtle.importKey('raw', sessionKey, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
  ])
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aesKey, plaintextBuffer)
  const encryptedContent = new Uint8Array(encrypted)
  const encryptedData = encryptedContent.slice(0, encryptedContent.length - 16)
  const authTag = encryptedContent.slice(encryptedContent.length - 16)
  const rsaKeyLengthBytes = new Uint8Array(2)
  const rsaKeyLength = new Uint8Array(rsaEncryptedKey).length
  rsaKeyLengthBytes[0] = Math.floor(rsaKeyLength / 256) % 256
  rsaKeyLengthBytes[1] = rsaKeyLength % 256
  const finalCiphertext = new Uint8Array(2 + rsaKeyLength + encryptedData.length + authTag.length)
  finalCiphertext.set(rsaKeyLengthBytes, 0)
  finalCiphertext.set(new Uint8Array(rsaEncryptedKey), 2)
  finalCiphertext.set(encryptedData, 2 + rsaKeyLength)
  finalCiphertext.set(authTag, 2 + rsaKeyLength + encryptedData.length)
  return arrayBufferToBase64(finalCiphertext)
}

export async function encryptSecretItem(sealedSecretsPEM, namespace, data) {
  const pubKey = await getPublicKeyFromPem(sealedSecretsPEM)
  const out = await hybridEncrypt(pubKey, data, namespace)
  return out
}
