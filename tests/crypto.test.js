const { test, expect, describe } = require("bun:test");
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
} 

const algorithm = 'aes256';
const secret = Buffer.from("0e8a533d3bc362cf7d3b842b4b602e4887d2ba4a47f28a4fdf77e7b8af6ca31a" + "0e8a533d3bc362cf7d3b842b4b602e4887d2ba4a47f28a4fdf77e7b8af6ca31a", "hex");

export function encrypt(data) {
  const cipher = crypto.createCipher(algorithm, secret);
  let encryptedData = cipher.update(data);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
	return encryptedData.toString("hex")
}

export function decrypt(encryptedData) {
  const decipher = crypto.createDecipher(algorithm, secret);
  let decryptedData = decipher.update(Buffer.from(encryptedData, 'hex'));
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData.toString();
}

describe.only("tests", () => {
  test("encryptTest", () => {
    let data = "hello!";
    const encrypted_temp = encrypt(data)
    expect(encrypted_temp.length >= 0 && encrypted_temp !== data).toBe(true);
  });


  test("decryptTest", () => {
    let data = "hello!";
    let correct_str = "hello!";
    expect(decrypt(encrypt(data))).toBe(correct_str);
  });
})

