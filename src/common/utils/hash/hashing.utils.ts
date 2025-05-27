import * as CryptoJS from 'crypto-js';
import { env } from 'src/common/config';
import * as crypto from 'crypto';

export function encrypt(text: string) {
  const ciphertext = CryptoJS.AES.encrypt(text.toString(), env.PASSPHRASE);
  const ciphertextString = ciphertext.toString();
  return ciphertextString;
}

export function decrypt(text: string) {
  const decrypted = CryptoJS.AES.decrypt(text.toString(), env.PASSPHRASE);
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

export function hashBuffer(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
