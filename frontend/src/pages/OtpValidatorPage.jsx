import React, { useState } from "react";
import { axiosInstance } from "../util/axiosInterceptor";
import CookieService from "../util/cookieService";
import { generateOTP } from "../util/otpHelper";
import TimeSyncUtil from "../util/timeOffsetUtil";

export const OtpValidatorPage = () => {
  const [secretKey, setSecretKey] = useState("your-secret-key");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [result, setResult] = useState("");

  const fetchKeyFromCookie = () => {
    setSecretKey(CookieService.getCookie("secretKey"));
  };

  const generateOtpCode = async () => {
    const secretKey = CookieService.getCookie("secretKey");
    const username = "admin";
    const time = TimeSyncUtil.getAdjustedTime();
    const otp = await generateOTP(secretKey, time);
    const base64Credentials = btoa(`${username}:${otp}`);
    setGeneratedOtp(base64Credentials);
  };

  const sendRequestViaOtp = async () => {
    try {
      const name = "gurkan";
      const response = await axiosInstance.get(`/api/say-hello?name=${name}`);
      setResult(response.data ? "OTP is valid!" : "OTP is invalid!");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error validating OTP.");
    }
  };

  return (
    <div className="container mx-auto px-4 w-1/4 mt-20 flex flex-col ">
      <span className="m-5 font-bold text-3xl">
        OTP Generator and Validator
      </span>
      <div>
        <label className="p-4" htmlFor="key">
          Secret Key:
        </label>
        <input
          className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          type="text"
          id="key"
          disabled
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>

      <div>
        <button
          className="m-3 bg-green-800 hover:bg-green-900 text-white rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-green-300"
          onClick={fetchKeyFromCookie}
        >
          fetch key from cookie
        </button>
        <button
          className="m-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={sendRequestViaOtp}
        >
          send request via OTP
        </button>
      </div>
      {result && result ? (
        <div className="m-4 font-semibold text-lg">{result}</div>
      ) : (
        <div className="m-4 font-semibold text-lg">
          send request to see result...
        </div>
      )}
      <div className="mt-4">
        <label className="p-4" htmlFor="key">
          generated header:
        </label>
        <input
          className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          type="text"
          id="key"
          disabled
          value={generatedOtp}
        />
      </div>
      <button
        className="m-3 bg-green-800 hover:bg-green-900 text-white rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-green-300"
        onClick={generateOtpCode}
      >
        Generate otp header
      </button>
    </div>
  );
};
