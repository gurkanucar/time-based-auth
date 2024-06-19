import CryptoJS from "crypto-js";
import { axiosBasic } from "./axiosInterceptor";

export const REFRESH_TIME = 5;

export async function generateOTP(key, time) {
  // Create the HMAC hash
  const timeBytes = new ArrayBuffer(8);
  new DataView(timeBytes).setUint32(4, Math.floor(time / REFRESH_TIME), false);
  const timeWordArray = CryptoJS.lib.WordArray.create(
    new Uint8Array(timeBytes)
  );
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const hmacResult = CryptoJS.HmacSHA256(timeWordArray, keyWordArray);

  // Convert the HMAC hash to bytes
  const hmacBytes = CryptoJS.enc.Hex.parse(
    hmacResult.toString(CryptoJS.enc.Hex)
  );
  const hmacArray = hmacBytes.words
    .map((word) => {
      return [
        (word >> 24) & 0xff,
        (word >> 16) & 0xff,
        (word >> 8) & 0xff,
        word & 0xff,
      ];
    })
    .flat();

  // Calculate the offset
  const offset = hmacArray[hmacArray.length - 1] & 0xf;

  // Extract the binary code
  const binary =
    ((hmacArray[offset] & 0x7f) << 24) |
    ((hmacArray[offset + 1] & 0xff) << 16) |
    ((hmacArray[offset + 2] & 0xff) << 8) |
    (hmacArray[offset + 3] & 0xff);

  // Return the OTP
  return binary % 1000000;
}

export const fetchServerTime = async () => {
  const response = await axiosBasic.get("/api/time");
  return parseInt(response.data, 10);
};
