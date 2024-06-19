import axios from "axios";

import CookieService from "./cookieService";
import { generateOTP } from "./otpHelper";
import TimeSyncUtil from "./timeOffsetUtil";

export const getContentType = () => ({
  "Content-Type": "application/json",
});

export const API_URL = "http://localhost:8080";

// Axios instance without otp
export const axiosBasic = axios.create({
  baseURL: API_URL,
  headers: getContentType(),
});

// Axios instance with otp
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: getContentType(),
});

// Add request interceptor to attach otp
axiosInstance.interceptors.request.use(async (config) => {
  const secretKey = CookieService.getCookie("secretKey");

  const username = "admin";
  const time = TimeSyncUtil.getAdjustedTime();
  const otp = await generateOTP(secretKey, time);

  const base64Credentials = btoa(`${username}:${otp}`);
  console.log(time);

  config.headers.Authorization = base64Credentials;

  return config;
});

// Helper function to introduce a delay
function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if successful
  async (error) => {
    const config = error.config;
    // Initialize retry state if not already set
    if (!config._retry) {
      config._retry = true;
      config._retryCount = 0;
    }

    if (config._retryCount < 3) {
      config._retryCount++; // Increment retry count
      console.log(`Retry attempt #${config._retryCount}`); // Log retry attempt number

      try {
        await delay(1000); // Wait for 1000 milliseconds (1 second) before retrying
        return await axiosInstance(config); // Retry the request
      } catch (err) {
        console.error("Error retrying the request:", err);
      }
    } else {
      console.error("Max retry attempts reached, redirecting to login.");
      // Redirect to login or handle max retry failure
    }

    return Promise.reject(error);
  }
);
