
// @ts-ignore
import crypto from 'crypto-js';
const k = crypto.enc.Utf8.parse('996ce17f6abc9fe126b57aa5f1d8c92c')
const iv = crypto.enc.Utf8.parse('6abc9fe126b57aa5')
export const encryption = (data: string | number) => {
    return crypto.AES.encrypt(data, k, {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7
    }).toString()
  }

// 解密数据
export const decrypt = (data: string | number) => {
  return crypto.AES.decrypt(data, k, {
      iv: iv,
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7
  }).toString(crypto.enc.Utf8)
}

  export function encryptedRequest(data: object): string {
    try {
      const dataString = JSON.stringify(data);
      const encrypted = crypto.AES.encrypt(dataString, k, {
        iv: iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      });
      
      return encrypted.ciphertext.toString(crypto.enc.Base64);
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Data encryption failed');
    }
  }