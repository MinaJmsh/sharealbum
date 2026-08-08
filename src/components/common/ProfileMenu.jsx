import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { notify } from "../../lib/toast";

/* ─── Profile Menu ────────────────────────────────────────────────── */
export default function ProfileMenu({ user, onClose }) {
  const navigate = useNavigate();
  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");
  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Guest";
  const email = user?.email ?? "";

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        notify.error("Couldn't sign out", error.message);
        return;
      }
      notify.info("Signed out", "You've been logged out.");
      navigate("/");
    } catch (err) {
      notify.error(
        "Connection problem",
        "Couldn't reach the server. Check your internet connection and try again.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute top-14 right-4 w-64 glass-sm p-1 shadow-glass-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gold-deep font-sans">
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-h truncate font-display">
                {displayName}
              </p>
              <p className="text-xs text-text-sm truncate font-sans">{email}</p>
            </div>
          </div>
        </div>
        <div className="py-1">
          <button
            onClick={() => {
              navigate("/dashboard");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-parchment/60 rounded-lg transition-colors font-sans"
          >
            <svg
              className="w-4 h-4 text-text-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
              />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-parchment/60 rounded-lg transition-colors font-sans"
          >
            <svg
              className="w-4 h-4 text-text-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Profile
          </button>
          <div className="border-t border-border my-1" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-50/40 rounded-lg transition-colors font-sans"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
