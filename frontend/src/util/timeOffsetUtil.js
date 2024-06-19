import { axiosBasic } from "./axiosInterceptor";
import CookieService from "./cookieService";

class TimeSyncUtil {
  static async fetchServerTime() {
    const start = Date.now();
    const response = await axiosBasic.get("/api/time");
    const serverTime = parseInt(response.data, 10);
    const end = Date.now();
    const latency = (end - start) / 2;
    const adjustedServerTime = serverTime * 1000 + latency;
    const clientTime = Date.now();
    const offset = adjustedServerTime - clientTime;
    console.log(
      "offset",
      offset,
      "servertime",
      serverTime,
      "clienttime",
      clientTime
    );
    this.setTimeOffset(offset);
  }

  static setTimeOffset(offset) {
    CookieService.setCookie("timeOffset", offset, { expires: 1 });
  }

  static getTimeOffset() {
    return parseInt(CookieService.getCookie("timeOffset"), 10) || 0;
  }

  static getAdjustedTime() {
    const timeOffset = this.getTimeOffset();
    return (Date.now() + timeOffset) / 1000;
  }
}

export default TimeSyncUtil;
