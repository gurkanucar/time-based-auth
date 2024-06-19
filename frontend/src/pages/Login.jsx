import React, { useState } from "react";
import { axiosBasic } from "../util/axiosInterceptor";
import CookieService from "../util/cookieService";
import TimeSyncUtil from "../util/timeOffsetUtil";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosBasic.post("/api/login", {
        username,
        password,
      });
      console.log("login req sent");

      if (response.status === 200) {
        const { key } = response.data;
        CookieService.setCookie("secretKey", key, { expires: 1 });

        TimeSyncUtil.fetchServerTime();

        setIsAuthenticated(true);
        navigate("/otp-validator");
        setMessage("Login successful!");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login error. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 w-1/4 mt-20">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
      </form>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
};

export default Login;
