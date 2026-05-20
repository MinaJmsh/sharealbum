import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // where to go after login — default to dashboard
  const from = location.state?.from || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate(from, { replace: true });
    }
  }

  return (
    <div className="min-h-svh flex">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden px-12 py-14"
        style={{
          background:
            "linear-gradient(160deg, #EDE8DE 0%, #E8C5C0 45%, #D4B896 100%)",
        }}
      >
        {/* Floating blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #C8D5C0, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-20 right-[-40px] w-64 h-64 rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, #D4B896, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #E8C5C0, transparent 70%)",
            }}
          />
        </div>

        {/* Logo / brand */}
        <div className="relative z-10">
          <span className="font-display text-2xl font-light tracking-wide text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>

        {/* Center quote */}
        <div className="relative z-10 space-y-4">
          <div className="w-10 h-[2px] bg-gold-deep/60 mb-6" />
          <p className="font-display text-4xl font-light leading-snug text-text-h text-balance">
            Every moment deserves to be remembered
          </p>
          <p className="text-sm text-text font-sans font-light leading-relaxed max-w-xs">
            Create a shared album for your ceremony and let guests contribute
            their photos — all in one place.
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-gold-deep/40" />
          <div className="w-2 h-2 rounded-full bg-pink-muted/40" />
          <div className="w-2 h-2 rounded-full bg-sage-muted/40" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 lg:hidden">
          <span className="font-display text-xl font-light text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>

        <div className="w-full max-w-sm animate-fade-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-light text-text-h mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-text-sm text-sm font-sans">
              Sign in to manage your events and photos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="glass-sm px-4 py-3 border-pink-dust/60 text-pink-muted text-sm font-sans animate-fade-in">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
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
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-sm font-sans">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm font-sans text-text">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent hover:text-gold-deep font-medium underline-offset-2 hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
