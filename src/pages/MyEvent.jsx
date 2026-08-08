import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import Loader from "../components/common/Loader";
import ProfileMenu from "../components/common/ProfileMenu";

function getStoragePath(url) {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null;
}

function getFilePreview(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.muted = true;
      video.onloadeddata = () => {
        video.currentTime = 0.5;
      };
      video.onseeked = () => {
        try {
          const c = document.createElement("canvas");
          c.width = 200;
          c.height =
            Math.round((video.videoHeight / video.videoWidth) * 200) || 150;
          c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve({ preview: c.toDataURL(), isVideo: true });
        } catch {
          URL.revokeObjectURL(url);
          resolve({ preview: null, isVideo: true });
        }
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ preview: null, isVideo: true });
      };
    } else {
      const r = new FileReader();
      r.onload = (e) => resolve({ preview: e.target.result, isVideo: false });
      r.onerror = () => resolve({ preview: null, isVideo: false });
      r.readAsDataURL(file);
    }
  });
}

/* ─── QR Sheet ─────────────────────────────────────────────────── */
function QRSheet({ ceremony, onClose }) {
  const qrRef = useRef(null);
  const qrUrl = ceremony.qr_code;

  function downloadQR() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const size = 400;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${ceremony.name.replace(/\s+/g, "-")}-qr.png`;
      a.click();
    };
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
  }

  async function shareQR() {
    if (navigator.share) {
      try {
        await navigator.share({ title: ceremony.name, url: qrUrl });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(qrUrl);
    alert("Link copied to clipboard!");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/20 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative glass-lg w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-dust via-accent to-sage-light" />
        <div className="px-6 pt-5 pb-7 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-display text-lg font-medium text-text-h">
              Event QR code
            </h3>
            <button onClick={onClose} className="btn-ghost px-2 py-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div ref={qrRef} className="glass p-4 rounded-2xl shadow-soft">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              bgColor="transparent"
              fgColor="#3d2e1e"
              level="M"
            />
          </div>
          <p className="text-xs text-text-sm font-sans text-center break-all opacity-70">
            {qrUrl}
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={downloadQR}
              className="btn-secondary flex-1 justify-center text-sm gap-2"
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
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download
            </button>
            <button
              onClick={shareQR}
              className="btn-secondary flex-1 justify-center text-sm gap-2"
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
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Saving Dialog ─────────────────────────────────────────────── */
function SavingDialog({ status }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-xs shadow-glass-lg p-8 flex flex-col items-center gap-4">
        <Loader />
        <div className="text-center">
          <p className="font-display text-lg font-light text-text-h">
            Saving changes
          </p>
          <p className="text-sm text-text-sm font-sans mt-1">{status}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Media Dialog ───────────────────────────────────────── */
function DeleteMediaDialog({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/10 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-lg p-6 w-full max-w-sm shadow-glass-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-medium text-text-h font-display">
              Delete this item?
            </h3>
            <p className="text-xs text-text-sm font-sans mt-0.5">
              This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary flex-1 justify-center text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn flex-1 justify-center text-sm bg-rose-400 text-white hover:bg-rose-500 active:scale-95 shadow-soft"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete EVENT Dialog ───────────────────────────────────────── */
function DeleteEventDialog({ eventName, onConfirm, onCancel, loading, step }) {
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
                  <svg
                    className="w-5 h-5 text-rose-400"
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
                </div>
                <div>
                  <h3 className="text-base font-medium text-text-h font-display">
                    Delete this event?
                  </h3>
                  <p className="text-sm text-text-sm font-sans mt-1 leading-relaxed">
                    <span className="font-medium text-text-h">
                      "{eventName}"
                    </span>{" "}
                    and all its media will be permanently deleted from storage.
                    Guests who shared photos will lose access to them.
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
                  to permanently remove this event.
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
                  {loading ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  ) : (
                    "Delete forever"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Event Success Dialog ──────────────────────────────── */
function DeleteEventSuccessDialog({ eventName, onDone }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/20 backdrop-blur-md" />
      <div className="relative glass-lg w-full max-w-sm shadow-glass-lg overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-sage-light via-accent to-pink-dust" />
        <div className="px-6 pt-6 pb-8 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-sage-light/30 border border-sage-light/50 flex items-center justify-center">
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
          </div>
          <div>
            <h2 className="font-display text-2xl font-light text-text-h">
              Event deleted
            </h2>
            <p className="text-sm text-text-sm font-sans mt-2 leading-relaxed">
              <span className="font-medium text-text-h">"{eventName}"</span> and
              all its media have been permanently removed.
            </p>
          </div>
          <button
            onClick={onDone}
            className="btn-primary w-full justify-center gap-2"
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
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
              />
            </svg>
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Discard Dialog ────────────────────────────────────────────── */
function DiscardDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/10 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-lg p-6 w-full max-w-sm shadow-glass-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-medium text-text-h font-display">
              Unsaved changes
            </h3>
            <p className="text-xs text-text-sm font-sans mt-0.5">
              Your edits haven't been saved yet.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1 justify-center text-sm"
          >
            Keep editing
          </button>
          <button
            onClick={onConfirm}
            className="btn flex-1 justify-center text-sm bg-amber-400 text-white hover:bg-amber-500 active:scale-95 shadow-soft"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Upload Progress mini-dialog ───────────────────────────────── */
function UploadingDialog({ current, total }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-xs shadow-glass-lg p-8 flex flex-col items-center gap-4">
        <Loader />
        <div className="text-center">
          <p className="font-display text-lg font-light text-text-h">
            Uploading media
          </p>
          <p className="text-sm text-text-sm font-sans mt-1">
            {current} of {total} files…
          </p>
        </div>
        <div className="w-full h-1.5 rounded-full bg-parchment overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${Math.round((current / total) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── New-media thumbnail ───────────────────────────────────────── */
function NewMediaThumb({ item, onRemove }) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-parchment border border-border shadow-soft">
      {item.preview ? (
        <img src={item.preview} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-text-sm"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
      )}
      {item.isVideo && (
        <div className="absolute top-1 left-1 badge bg-black/40 text-white border-white/20 text-[10px] px-1 py-0.5 backdrop-blur-sm">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── Existing Media Card ───────────────────────────────────────── */
function MediaCard({ item, onDelete }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border shadow-soft group break-inside-avoid mb-3">
      {item.file_type === "video" ? (
        <video
          src={item.file_url}
          className="w-full object-cover block"
          muted
          playsInline
          preload="metadata"
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={item.file_url}
          alt=""
          className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      {item.file_type === "video" && (
        <div className="absolute top-2 left-2 badge bg-black/40 text-white border-white/20 backdrop-blur-sm text-[10px]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>{" "}
          Video
        </div>
      )}
      <button
        onClick={() => onDelete(item)}
        className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-soft hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all"
        title="Delete"
      >
        <svg
          className="w-3.5 h-3.5 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── Column count hook ─────────────────────────────────────────── */
function useColumns() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1280) setCols(4);
      else if (w >= 768) setCols(3);
      else setCols(2);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

const SKELETON_HEIGHTS = [
  [240, 160, 300, 180],
  [180, 260, 140, 220],
  [200, 320, 160, 200],
  [280, 160, 240, 180],
];
function SkeletonGrid({ columns }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: columns }, (_, ci) => (
        <div key={ci} className="flex-1 flex flex-col">
          {SKELETON_HEIGHTS[ci % SKELETON_HEIGHTS.length].map((h, i) => (
            <div
              key={i}
              className="skeleton w-full rounded-2xl mb-3"
              style={{ height: h }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function MyEvent() {
  const { id: ceremonyId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const user = session?.user;
  const columns = useColumns();

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  const [ceremony, setCeremony] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null); // single media item
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteEventStep, setDeleteEventStep] = useState(null); // null | "warn" | "confirm"
  const [deleteEventLoading, setDeleteEventLoading] = useState(false);
  const [deleteEventSuccess, setDeleteEventSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  // Editable fields
  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [newMediaFiles, setNewMediaFiles] = useState([]); // pending uploads

  const coverInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  // Track if fields differ from saved state
  const [savedName, setSavedName] = useState("");

  const isDirty =
    name !== savedName || coverFile !== null || newMediaFiles.length > 0;

  // Block browser refresh when dirty
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function tryNavigate(dest) {
    if (isDirty) {
      setPendingNav(dest);
      setShowDiscard(true);
    } else navigate(dest);
  }

  function confirmDiscard() {
    setShowDiscard(false);
    navigate(pendingNav ?? `/ceremony/${ceremonyId}`);
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: cer, error: cerErr }, { data: med, error: medErr }] =
        await Promise.all([
          supabase.from("ceremonies").select("*").eq("id", ceremonyId).single(),
          supabase
            .from("media")
            .select("*")
            .eq("ceremony_id", ceremonyId)
            .order("created_at", { ascending: false }),
        ]);
      if (cerErr) throw cerErr;
      if (medErr) throw medErr;
      if (cer.owner_id !== user?.id) {
        navigate(`/ceremony/${ceremonyId}/my-media`, { replace: true });
        return;
      }
      setCeremony(cer);
      setName(cer.name ?? "");
      setSavedName(cer.name ?? "");
      setCoverPreview(cer.cover_url ?? null);
      setMedia(med ?? []);
    } catch {
      setError("Failed to load event. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ceremonyId, user?.id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const r = new FileReader();
    r.onload = (ev) => setCoverPreview(ev.target.result);
    r.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleNewMediaAdd(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const processed = [];
    for (const f of files) {
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/"))
        continue;
      if (f.size > 10 * 1024 * 1024) continue;
      const { preview, isVideo } = await getFilePreview(f);
      processed.push({ id: crypto.randomUUID(), file: f, preview, isVideo });
    }
    setNewMediaFiles((prev) => {
      const names = new Set(prev.map((p) => p.file.name));
      return [...prev, ...processed.filter((p) => !names.has(p.file.name))];
    });
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Event name cannot be empty.");
      return;
    }
    setError(null);
    setSaving(true);
    setSaveStatus("Saving changes…");
    try {
      let coverUrl = ceremony.cover_url;
      if (coverFile) {
        setSaveStatus("Uploading cover image…");
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${user.id}/${Date.now()}.${ext}`;
        const { data: cd, error: cErr } = await supabase.storage
          .from("media")
          .upload(path, coverFile, { contentType: coverFile.type });
        if (cErr) throw cErr;
        coverUrl = supabase.storage.from("media").getPublicUrl(cd.path)
          .data.publicUrl;
      }
      setSaveStatus("Updating event…");
      const { error: updErr } = await supabase
        .from("ceremonies")
        .update({ name: name.trim(), cover_url: coverUrl })
        .eq("id", ceremonyId);
      if (updErr) throw updErr;
      setCeremony((prev) => ({
        ...prev,
        name: name.trim(),
        cover_url: coverUrl,
      }));
      setSavedName(name.trim());
      setCoverFile(null);
      setSaving(false);

      // Upload new media files if any
      if (newMediaFiles.length > 0) {
        setUploadingMedia(true);
        setUploadProgress({ current: 0, total: newMediaFiles.length });
        const uploaded = [];
        for (let i = 0; i < newMediaFiles.length; i++) {
          const { file, isVideo } = newMediaFiles[i];
          setUploadProgress({ current: i + 1, total: newMediaFiles.length });
          const ext = file.name.split(".").pop();
          const path = `${ceremonyId}/${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const { data: fd, error: fErr } = await supabase.storage
            .from("media")
            .upload(path, file, { contentType: file.type });
          if (fErr) continue;
          const fileUrl = supabase.storage.from("media").getPublicUrl(fd.path)
            .data.publicUrl;
          const { data: row } = await supabase
            .from("media")
            .insert({
              ceremony_id: ceremonyId,
              uploader_id: user.id,
              file_url: fileUrl,
              file_type: isVideo ? "video" : "image",
            })
            .select()
            .single();
          if (row) uploaded.push(row);
        }
        setMedia((prev) => [...uploaded, ...prev]);
        setNewMediaFiles([]);
        setUploadingMedia(false);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e?.message ?? "Failed to save. Please try again.");
      setSaving(false);
      setUploadingMedia(false);
    }
  }

  async function handleDeleteMedia() {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      const path = getStoragePath(toDelete.file_url);
      if (path) await supabase.storage.from("media").remove([path]);
      await supabase.from("media").delete().eq("id", toDelete.id);
      setMedia((prev) => prev.filter((m) => m.id !== toDelete.id));
      setToDelete(null);
    } catch {
      setError("Failed to delete media.");
      setToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleDeleteEvent(action) {
    if (action === "proceed") {
      setDeleteEventStep("confirm");
      return;
    }
    setDeleteEventLoading(true);
    try {
      const { data: allMedia } = await supabase
        .from("media")
        .select("file_url")
        .eq("ceremony_id", ceremonyId);

      if (allMedia && allMedia.length > 0) {
        const paths = allMedia
          .map((m) => getStoragePath(m.file_url))
          .filter(Boolean);
        for (let i = 0; i < paths.length; i += 100) {
          await supabase.storage.from("media").remove(paths.slice(i, i + 100));
        }
      }

      await supabase.from("media").delete().eq("ceremony_id", ceremonyId);

      if (ceremony?.cover_url) {
        const coverPath = getStoragePath(ceremony.cover_url);
        if (coverPath) await supabase.storage.from("media").remove([coverPath]);
      }

      await supabase.from("ceremonies").delete().eq("id", ceremonyId);

      setDeleteEventStep(null);
      setDeleteEventSuccess(true);
    } catch (e) {
      setError(e?.message ?? "Failed to delete event. Please try again.");
      setDeleteEventStep(null);
    } finally {
      setDeleteEventLoading(false);
    }
  }

  // Masonry columns
  const cols = Array.from({ length: columns }, () => []);
  media.forEach((item, i) => cols[i % columns].push(item));

  return (
    <div className="min-h-svh bg-ivory">
      {saving && <SavingDialog status={saveStatus} />}
      {uploadingMedia && (
        <UploadingDialog
          current={uploadProgress.current}
          total={uploadProgress.total}
        />
      )}
      {showQR && ceremony && (
        <QRSheet ceremony={ceremony} onClose={() => setShowQR(false)} />
      )}
      {toDelete && (
        <DeleteMediaDialog
          onConfirm={handleDeleteMedia}
          onCancel={() => setToDelete(null)}
          loading={deleteLoading}
        />
      )}
      {deleteEventStep && (
        <DeleteEventDialog
          eventName={ceremony?.name ?? ""}
          step={deleteEventStep}
          onConfirm={handleDeleteEvent}
          onCancel={() => {
            if (!deleteEventLoading) setDeleteEventStep(null);
          }}
          loading={deleteEventLoading}
        />
      )}
      {deleteEventSuccess && (
        <DeleteEventSuccessDialog
          eventName={ceremony?.name ?? ""}
          onDone={() => navigate("/dashboard", { replace: true })}
        />
      )}
      {showDiscard && (
        <DiscardDialog
          onConfirm={confirmDiscard}
          onCancel={() => setShowDiscard(false)}
        />
      )}
      {menuOpen && (
        <ProfileMenu user={user} onClose={() => setMenuOpen(false)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 glass-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => tryNavigate(-1)}
            className="btn-ghost px-2 py-1.5"
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs text-text-sm font-sans">Owner</p>
            <h2 className="text-lg font-light text-text-h font-display leading-tight">
              {loading ? (
                <span className="skeleton inline-block w-28 h-5 rounded" />
              ) : (
                "Manage event"
              )}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!loading && ceremony && (
            <button
              onClick={() => setShowQR(true)}
              className="btn-secondary gap-2 text-sm"
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
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                />
              </svg>
              QR Code
            </button>
          )}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-accent/30 transition-colors"
          >
            <span className="text-xs font-medium text-gold-deep font-sans">
              {initials}
            </span>
          </button>
        </div>
      </header>

      <main className="page pt-6 pb-28 max-w-2xl">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50/60 border border-rose-200/50 text-sm text-rose-500 font-sans flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-sm p-5 flex flex-col gap-3">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-7">
            {/* Name */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Event name <span className="text-rose-400">*</span>
                </label>
                <p className="text-xs text-text-sm font-sans mb-2">
                  The title shown to all guests in the gallery.
                </p>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            {/* Cover */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Cover photo
                </label>
                <p className="text-xs text-text-sm font-sans mb-3">
                  Appears at the top of your event gallery.
                </p>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
              {coverPreview ? (
                <div
                  className="relative rounded-2xl overflow-hidden border border-border shadow-soft"
                  style={{ maxHeight: 240 }}
                >
                  <img
                    src={coverPreview}
                    alt="cover"
                    className="w-full object-cover"
                    style={{ maxHeight: 240 }}
                  />
                  <div className="absolute inset-0 flex items-end justify-end p-2">
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-border hover:border-accent/40 hover:bg-parchment/30 transition-all py-10 flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-parchment flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-text-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-sans text-text-sm">
                    Tap to add cover photo
                  </span>
                </button>
              )}
            </div>

            {/* Add media section */}
            <div className="glass-sm p-5 flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-text-h font-sans block mb-0.5">
                  Add media
                </label>
                <p className="text-xs text-text-sm font-sans mb-3">
                  Add more photos or videos to the event. These will be saved
                  when you tap Save changes. Max 10 MB per file.
                </p>
              </div>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleNewMediaAdd}
              />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {newMediaFiles.map((item) => (
                  <NewMediaThumb
                    key={item.id}
                    item={item}
                    onRemove={(id) =>
                      setNewMediaFiles((p) => p.filter((f) => f.id !== id))
                    }
                  />
                ))}
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-parchment/30 flex flex-col items-center justify-center gap-1.5 transition-all text-text-sm hover:text-text"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span className="text-[11px] font-sans">Add</span>
                </button>
              </div>
              {newMediaFiles.length > 0 && (
                <p className="text-xs text-text-sm font-sans">
                  {newMediaFiles.length} file
                  {newMediaFiles.length !== 1 ? "s" : ""} queued — will upload
                  on Save
                </p>
              )}
            </div>

            {/* Existing media grid */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-medium text-text-h font-sans">
                  All media
                </h3>
                <p className="text-xs text-text-sm font-sans mt-0.5">
                  {media.length} {media.length === 1 ? "item" : "items"} — as
                  owner you can delete any file
                </p>
              </div>
              {media.length === 0 ? (
                <div className="glass-sm p-8 flex flex-col items-center gap-3 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-parchment border border-border flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-text-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-text-sm font-sans text-center">
                    No media yet. Share the QR code with guests to start
                    collecting memories.
                  </p>
                </div>
              ) : (
                <div className="flex gap-3">
                  {cols.map((col, ci) => (
                    <div key={ci} className="flex-1 flex flex-col">
                      {col.map((item) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          onDelete={setToDelete}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="glass-sm p-5 flex flex-col gap-3 border border-rose-200/50">
              <div>
                <h3 className="text-sm font-medium text-rose-400 font-sans">
                  Danger zone
                </h3>
                <p className="text-xs text-text-sm font-sans mt-0.5">
                  Deleting this event is permanent. All media will be removed
                  from storage.
                </p>
              </div>
              <button
                onClick={() => setDeleteEventStep("warn")}
                className="btn flex items-center gap-2 text-sm text-rose-400 border border-rose-200/60 bg-rose-50/30 hover:bg-rose-50/60 hover:border-rose-300 active:scale-95 transition-all self-start"
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete this event
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      {!loading && (
        <div className="fixed bottom-0 inset-x-0 z-30 glass-sm border-t border-border px-4 py-4 flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => tryNavigate(`/ceremony/${ceremonyId}`)}
            className="btn-secondary gap-2 text-sm"
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.58-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            View gallery
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1 justify-center gap-2"
          >
            {saved ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Saved!
              </>
            ) : (
              <>
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
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
