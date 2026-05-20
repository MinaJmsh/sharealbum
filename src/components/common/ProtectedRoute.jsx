import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // While Supabase resolves the session, show nothing (avoids flash redirect)
  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-6 h-6 text-accent"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-text-sm text-sm font-sans">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Save where they were trying to go so Login can redirect back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
