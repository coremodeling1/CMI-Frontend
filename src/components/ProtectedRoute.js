import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user")); // read directly from localStorage
  if (!user) return <Navigate to="/" />; // not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // role mismatch
  return children; // allowed
};

export default ProtectedRoute;
