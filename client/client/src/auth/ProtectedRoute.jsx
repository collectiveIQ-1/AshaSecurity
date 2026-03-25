import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthed) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signin?returnTo=${returnTo}`} replace />;
  }
  return children;
}
