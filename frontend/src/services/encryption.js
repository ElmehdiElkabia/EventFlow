/**
 * Client-side encryption for sensitive data
 * Encrypts sensitive fields before transmission to prevent plaintext exposure
 */

// Encryption key - in production, this should come from environment variable
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'EventFlow2026SecureEncryptionKeyDefault';

/**
 * Generate a encryption key from the base key
 */
async function getEncryptionKey() {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('EventFlowSalt2026'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a string value
 * @param {string} plaintext - The text to encrypt
 * @returns {Promise<string>} Base64 encoded encrypted data with IV
 */
async function encryptValue(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') {
    return plaintext;
  }

  try {
    const encoder = new TextEncoder();
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return as base64 with prefix to identify encrypted data
    return 'ENC:' + btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed');
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Decrypt a string value
 * @param {string} encrypted - The encrypted data (with ENC: prefix)
 * @returns {Promise<string>} Decrypted plaintext
 */
async function decryptValue(encrypted) {
  if (!encrypted || typeof encrypted !== 'string' || !encrypted.startsWith('ENC:')) {
    return encrypted;
  }

  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encrypted.substring(4)), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed');
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypt sensitive fields in an object
 * @param {Object} data - Object containing fields to encrypt
 * @param {Array<string>} sensitiveFields - Array of field names to encrypt
 * @returns {Promise<Object>} Object with encrypted fields
 */
export async function encryptSensitiveFields(data, sensitiveFields = []) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  const encrypted = { ...data };

  for (const field of sensitiveFields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = await encryptValue(encrypted[field]);
    }
  }

  return encrypted;
}

/**
 * Encrypt authentication credentials
 * @param {Object} credentials - Login/register credentials
 * @returns {Promise<Object>} Credentials with encrypted password
 */
export async function encryptAuthCredentials(credentials) {
  const sensitiveFields = ['password', 'password_confirmation', 'current_password', 'new_password'];
  return encryptSensitiveFields(credentials, sensitiveFields);
}

/**
 * Encrypt payment information
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment data with encrypted sensitive fields
 */
export async function encryptPaymentData(paymentData) {
  const sensitiveFields = ['card_number', 'cvv', 'pin'];
  return encryptSensitiveFields(paymentData, sensitiveFields);
}

/**
 * Check if encryption is available
 * @returns {boolean} True if Web Crypto API is available
 */
export function isEncryptionAvailable() {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.encrypt === 'function';
}

export { encryptValue, decryptValue };
