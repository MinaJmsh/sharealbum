import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { BubbleBackground } from "../components/animate-ui/components/backgrounds/bubble";
import { notify } from "../lib/toast";
import icon from "../assets/favicon.svg";

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
const AlertTriangleIcon = () => (
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
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    className="w-7 h-7 text-sage-muted"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const TrashIcon = () => (
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
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ── Storage path helper (matches MyEvent.jsx pattern) ──────────────
function getStoragePath(url) {
  if (!url) return null;
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null;
}

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

// ── Account deletion progress dialog ────────────────────────────────
function DeletingAccountDialog({ status }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-xs shadow-glass-lg p-8 flex flex-col items-center gap-4">
        <SpinnerIcon />
        <div className="text-center">
          <p className="font-display text-lg font-light text-text-h">
            Deleting your account
          </p>
          <p className="text-sm text-text-sm font-sans mt-1">{status}</p>
        </div>
      </div>
    </div>
  );
}

// ── Delete account confirmation dialog (mirrors DeleteEventDialog) ──
function DeleteAccountDialog({ email, onConfirm, onCancel, loading, step }) {
  const [confirmText, setConfirmText] = useState("");
  const required = "DELETE";
  const canConfirm = confirmText === required;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/20 backdrop-blur-md"
        onClick={!loading ? onCancel : undefined}
      />
      <div className="relative glass-lg p-6 w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1 bg-rose-300" />
        <div className="pt-4">
          {step === "warn" ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-rose-400">
                    <AlertTriangleIcon />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-text-h font-display">
                    Delete your account?
                  </h3>
                  <p className="text-sm text-text-sm font-sans mt-1 leading-relaxed">
                    This will permanently delete{" "}
                    <span className="font-medium text-text-h">{email}</span>,
                    every event you own and their media, and every photo or
                    video you've shared in other people's events. This cannot be
                    undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="btn-secondary flex-1 justify-center text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm("proceed")}
                  className="btn flex-1 justify-center text-sm bg-rose-400 text-white hover:bg-rose-500 active:scale-95 shadow-soft"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-base font-medium text-text-h font-display mb-1">
                  Final confirmation
                </h3>
                <p className="text-sm text-text-sm font-sans mb-4">
                  Type{" "}
                  <span className="font-mono font-semibold text-rose-400 bg-rose-50 px-1 rounded">
                    DELETE
                  </span>{" "}
                  to permanently remove your account and all associated data.
                </p>
                <input
                  className="input"
                  placeholder="Type DELETE to confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="btn-secondary flex-1 justify-center text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm("delete")}
                  disabled={!canConfirm || loading}
                  className={`btn flex-1 justify-center text-sm shadow-soft transition-all ${canConfirm && !loading ? "bg-rose-500 text-white hover:bg-rose-600 active:scale-95" : "bg-rose-200 text-rose-300 cursor-not-allowed"}`}
                >
                  {loading ? <SpinnerIcon /> : "Delete forever"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Success dialog (mirrors DeleteEventSuccessDialog) ───────────────
function DeleteAccountSuccessDialog({ onDone }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/20 backdrop-blur-md" />
      <div className="relative glass-lg w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-sage-light via-accent to-pink-dust" />
        <div className="px-6 pt-6 pb-8 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-sage-light/30 border border-sage-light/50 flex items-center justify-center">
            <CheckCircleIcon />
          </div>
          <div>
            <h2 className="font-display text-2xl font-light text-text-h">
              Account deleted
            </h2>
            <p className="text-sm text-text-sm font-sans mt-2 leading-relaxed">
              Your account, your events, and everything you've shared have been
              permanently removed. Take care.
            </p>
          </div>
          <button
            onClick={onDone}
            className="btn-primary w-full justify-center gap-2"
          >
            Back to home
          </button>
        </div>
      </div>
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

  // Account deletion state
  const [deleteAccountStep, setDeleteAccountStep] = useState(null); // null | "warn" | "confirm"
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteAccountSuccess, setDeleteAccountSuccess] = useState(false);

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

  // ── Delete account ──────────────────────────────────────────────
  async function handleDeleteAccount(action) {
    if (action === "proceed") {
      setDeleteAccountStep("confirm");
      return;
    }

    const userId = session?.user?.id;
    if (!userId) return;

    setDeleteAccountLoading(true);
    try {
      // 1. Delete every event this user owns, plus its media + cover in storage
      setDeleteStatus("Removing your events…");
      const { data: ownedCeremonies, error: ownedErr } = await supabase
        .from("ceremonies")
        .select("id, cover_url")
        .eq("owner_id", userId);
      if (ownedErr) throw ownedErr;

      if (ownedCeremonies && ownedCeremonies.length > 0) {
        const ceremonyIds = ownedCeremonies.map((c) => c.id);

        setDeleteStatus("Removing media from your events…");
        const { data: ownedMedia, error: ownedMediaErr } = await supabase
          .from("media")
          .select("file_url")
          .in("ceremony_id", ceremonyIds);
        if (ownedMediaErr) throw ownedMediaErr;

        if (ownedMedia && ownedMedia.length > 0) {
          const paths = ownedMedia
            .map((m) => getStoragePath(m.file_url))
            .filter(Boolean);
          for (let i = 0; i < paths.length; i += 100) {
            await supabase.storage
              .from("media")
              .remove(paths.slice(i, i + 100));
          }
        }

        const coverPaths = ownedCeremonies
          .map((c) => getStoragePath(c.cover_url))
          .filter(Boolean);
        if (coverPaths.length > 0) {
          await supabase.storage.from("media").remove(coverPaths);
        }

        await supabase.from("media").delete().in("ceremony_id", ceremonyIds);
        await supabase.from("ceremonies").delete().in("id", ceremonyIds);
      }

      // 2. Delete media this user shared as a guest in other people's events
      setDeleteStatus("Removing your shared photos and videos…");
      const { data: guestMedia, error: guestMediaErr } = await supabase
        .from("media")
        .select("file_url")
        .eq("uploader_id", userId);
      if (guestMediaErr) throw guestMediaErr;

      if (guestMedia && guestMedia.length > 0) {
        const paths = guestMedia
          .map((m) => getStoragePath(m.file_url))
          .filter(Boolean);
        for (let i = 0; i < paths.length; i += 100) {
          await supabase.storage.from("media").remove(paths.slice(i, i + 100));
        }
        await supabase.from("media").delete().eq("uploader_id", userId);
      }

      // 3. Delete the auth user itself via edge function (needs service role)
      setDeleteStatus("Deleting your account…");
      const { error: fnErr } =
        await supabase.functions.invoke("delete-account");
      if (fnErr) throw fnErr;

      await supabase.auth.signOut();
      notify.success(
        "Account deleted",
        "Your account and all your data have been removed.",
      );
      setDeleteAccountStep(null);
      setDeleteAccountSuccess(true);
    } catch (e) {
      notify.error(
        "Couldn't delete account",
        e?.message ?? "Please try again.",
      );
      setDeleteAccountStep(null);
    } finally {
      setDeleteAccountLoading(false);
    }
  }

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
      {deleteAccountStep && (
        <DeleteAccountDialog
          email={email}
          step={deleteAccountStep}
          onConfirm={handleDeleteAccount}
          onCancel={() => {
            if (!deleteAccountLoading) setDeleteAccountStep(null);
          }}
          loading={deleteAccountLoading}
        />
      )}
      {deleteAccountLoading && <DeletingAccountDialog status={deleteStatus} />}
      {deleteAccountSuccess && (
        <DeleteAccountSuccessDialog
          onDone={() => navigate("/", { replace: true })}
        />
      )}

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
              to="/"
              className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
            >
              <img
                src={icon}
                alt="ShareAlbum"
                style={{
                  width: "34px",
                  height: "34px",
                  flexShrink: 0,
                  objectFit: "contain",
                }}
              />{" "}
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

            {/* ── Danger zone ──────────────────────────────── */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-3 border border-rose-200/50">
              <div>
                <h3 className="font-display text-lg font-medium text-rose-400 border-b border-rose-200/40 pb-3 mb-0.5">
                  Danger zone
                </h3>
                <p className="text-xs text-text-sm font-sans mt-3">
                  Deleting your account is permanent. Every event you own, all
                  of its media, and every photo or video you've shared in other
                  people's events will be permanently removed.
                </p>
              </div>
              <button
                onClick={() => setDeleteAccountStep("warn")}
                className="btn flex items-center gap-2 text-sm text-rose-400 border border-rose-200/60 bg-rose-50/30 hover:bg-rose-50/60 hover:border-rose-300 active:scale-95 transition-all self-start"
              >
                <TrashIcon />
                Delete my account
              </button>
            </div>

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
