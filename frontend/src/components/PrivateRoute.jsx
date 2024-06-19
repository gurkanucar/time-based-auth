import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
