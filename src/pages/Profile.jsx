import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { BubbleBackground } from "../components/animate-ui/components/backgrounds/bubble";
import { notify } from "../lib/toast";

// ── Icons ─────────────────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="rgba(201,168,124,0.15)"
      stroke="rgba(201,168,124,0.6)"
      strokeWidth="1.5"
    />
    <path
      d="M10 20 Q16 8 22 20"
      stroke="#c9a87c"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="16" cy="13" r="2" fill="#c9a87c" opacity="0.7" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
const LogOutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Section card ──────────────────────────────────────────────────
function Card({ title, children }) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5">
      <h3 className="font-display text-lg font-medium text-text-h border-b border-border pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const email = session?.user?.email || "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "ME";

  // FIX 3: Load display name — check all possible metadata fields
  useEffect(() => {
    const meta = session?.user?.user_metadata;
    if (!meta) return;
    const name = meta.display_name || meta.full_name || meta.name || "";
    setDisplayName(name);
  }, [session]);

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    setSavingName(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName.trim(), display_name: displayName.trim() },
    });
    setSavingName(false);
    if (error) notify.error("Couldn't save name", error.message);
    else notify.success("Display name updated");
  };

  const handleChangePassword = async () => {
    if (!newPw || !confirmPw) {
      notify.warning("Missing fields", "Please fill in all password fields.");
      return;
    }
    if (newPw !== confirmPw) {
      notify.warning(
        "Passwords don't match",
        "Please make sure both password fields are identical.",
      );
      return;
    }
    if (newPw.length < 6) {
      notify.warning(
        "Password too short",
        "Password must be at least 6 characters.",
      );
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSavingPw(false);
    if (error) {
      notify.error("Couldn't update password", error.message);
    } else {
      notify.success("Password updated", "Your password has been changed.");
      setNewPw("");
      setConfirmPw("");
    }
  };
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        notify.error("Couldn't sign out", error.message);
        return;
      }
      notify.info("Signed out", "You've been logged out.");
      navigate("/login");
    } catch (err) {
      notify.error(
        "Connection problem",
        "Couldn't reach the server. Check your internet connection and try again.",
      );
    }
  };

  const pwStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6)
      return { label: "Too short", color: "bg-red-400", w: "w-1/4" };
    if (pw.length < 8)
      return { label: "Weak", color: "bg-amber-400", w: "w-2/4" };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw))
      return { label: "Strong", color: "bg-green-400", w: "w-full" };
    return { label: "Fair", color: "bg-gold-soft", w: "w-3/4" };
  };
  const strength = pwStrength(newPw);

  return (
    <div className="min-h-svh relative">
      <BubbleBackground
        interactive
        colors={{
          first: "201,168,124",
          second: "221,168,160",
          third: "168,191,160",
          fourth: "212,184,150",
          fifth: "232,197,192",
          sixth: "141,170,132",
        }}
        className="fixed inset-0 z-0"
      />
      <div className="relative z-10 flex flex-col min-h-svh">
        <header
          className="sticky top-0 z-50 border-b border-border backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,252,248,0.88) 0%,rgba(250,247,242,0.78) 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
            >
              <LogoIcon />
              <span className="font-display text-lg font-light text-text-h tracking-wide">
                ShareAlbum
              </span>
            </Link>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-ghost text-sm gap-1.5"
            >
              <ArrowLeftIcon /> Dashboard
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
          {/* Avatar + heading */}
          <div className="flex flex-col items-center text-center mb-10 gap-3">
            <div className="w-20 h-20 rounded-full glass border-2 border-accent/30 flex items-center justify-center text-2xl font-display font-light text-accent shadow-glass">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-light text-text-h">
                {displayName || email.split("@")[0]}
              </h1>
              <p className="text-text-sm text-sm mt-0.5">{email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* ── Display Name ────────────────────────────── */}
            <Card title="Display Name">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-sm mb-1.5">
                    Full name
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-sm mb-1.5">
                    Email address
                  </label>
                  <input
                    className="input opacity-60 cursor-not-allowed"
                    type="email"
                    value={email}
                    readOnly
                    tabIndex={-1}
                  />
                  <p className="text-text-sm text-xs mt-1">
                    Email cannot be changed.
                  </p>
                </div>
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="btn-primary self-start"
                >
                  {savingName ? "Saving…" : "Save changes"}
                </button>
              </div>
            </Card>

            {/* ── Change Password ──────────────────────────── */}
            <Card title="Change Password">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-sm mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showNew ? "text" : "password"}
                      placeholder="New password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                      onClick={() => setShowNew(!showNew)}
                    >
                      <EyeIcon open={showNew} />
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-parchment rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`}
                        />
                      </div>
                      <span className="text-xs text-text-sm">
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-sm mb-1.5">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      className={`input pr-10 ${confirmPw && confirmPw !== newPw ? "border-red-300 focus:border-red-400 focus:ring-red-200" : ""}`}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={savingPw || !newPw || !confirmPw}
                  className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPw ? "Updating…" : "Update password"}
                </button>
              </div>
            </Card>

            {/* ── Sign out — subtle row, no heavy card ── */}
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-xs text-text-sm">
                Signed in as <span className="text-text">{email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-600 transition-colors"
              >
                <LogOutIcon />
                Sign out
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
