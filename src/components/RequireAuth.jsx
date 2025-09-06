// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function RequireAuth() {
  const authed = isAuthenticated();
  const loc = useLocation();
  return authed ? <Outlet /> : <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
}
