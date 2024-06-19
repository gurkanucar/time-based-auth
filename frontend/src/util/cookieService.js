import Cookies from "js-cookie";

export const CookieService = {
  // Set a cookie
  setCookie: (name, value, options = {}) => {
    Cookies.set(name, value, { ...options });
  },

  // Get a cookie
  getCookie: (name) => {
    return Cookies.get(name);
  },

  // Update a cookie (set with the same name)
  updateCookie: (name, value, options = {}) => {
    Cookies.set(name, value, { ...options });
  },

  // Delete a cookie
  deleteCookie: (name) => {
    Cookies.remove(name);
  },
};

export default CookieService;
