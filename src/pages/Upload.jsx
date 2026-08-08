import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { notify } from "../lib/toast";

/* ─── Helpers ─────────────────────────────────────────────────── */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFilePreview(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.onloadeddata = () => {
        video.currentTime = 0.5;
      };
      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 200;
          canvas.height =
            Math.round((video.videoHeight / video.videoWidth) * 200) || 150;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve({ preview: canvas.toDataURL(), isVideo: true });
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
      const reader = new FileReader();
      reader.onload = (e) =>
        resolve({ preview: e.target.result, isVideo: false });
      reader.onerror = () => resolve({ preview: null, isVideo: false });
      reader.readAsDataURL(file);
    }
  });
}

/* ─── Upload Progress Dialog ──────────────────────────────────── */
function UploadProgressDialog({ items, onDone }) {
  const total = items.length;
  const done = items.filter(
    (i) => i.status === "done" || i.status === "error",
  ).length;
  const errors = items.filter((i) => i.status === "error").length;
  const allFinished = done === total;
  const overallPct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/10 backdrop-blur-sm" />
      <div className="relative glass-lg w-full max-w-md shadow-glass-lg overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-medium text-text-h">
                {allFinished
                  ? errors === total
                    ? "Upload failed"
                    : errors > 0
                      ? "Partially uploaded"
                      : "Upload complete"
                  : "Uploading…"}
              </h3>
              <p className="text-xs text-text-sm font-sans mt-0.5">
                {done} of {total} {total === 1 ? "file" : "files"}
                {errors > 0 && ` · ${errors} failed`}
              </p>
            </div>
            {allFinished && (
              <button
                onClick={onDone}
                className="btn-primary text-sm px-4 py-2"
              >
                View media
              </button>
            )}
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-parchment overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto scrollbar-hide">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-6 py-3 border-b border-border/50 last:border-0"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-parchment flex-shrink-0">
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-text-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-h font-sans truncate">
                  {item.file.name}
                </p>
                <p className="text-[11px] text-text-sm font-sans">
                  {formatSize(item.file.size)}
                </p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1 rounded-full bg-parchment overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-rose-400 font-sans mt-0.5 truncate">
                    {item.error}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {item.status === "pending" && (
                  <div className="w-5 h-5 rounded-full border-2 border-border" />
                )}
                {item.status === "uploading" && (
                  <svg
                    className="w-5 h-5 text-accent animate-spin"
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
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {item.status === "done" && (
                  <svg
                    className="w-5 h-5 text-green-400"
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
                )}
                {item.status === "error" && (
                  <svg
                    className="w-5 h-5 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── File Thumbnail Card ─────────────────────────────────────── */
function FileCard({ item, selected, onToggle, onRemove }) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 select-none ${
        selected
          ? "border-accent shadow-glass"
          : "border-transparent shadow-soft hover:border-border"
      }`}
    >
      <div className="aspect-square bg-parchment">
        {item.preview ? (
          <img
            src={item.preview}
            alt={item.file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2">
            <svg
              className="w-7 h-7 text-text-sm"
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
            <p className="text-[10px] text-text-sm font-sans text-center truncate w-full px-1">
              {item.file.name}
            </p>
          </div>
        )}
      </div>

      {item.isVideo && (
        <div className="absolute top-1.5 left-1.5 badge bg-black/50 text-white border-white/20 text-[10px] px-1.5 py-0.5 backdrop-blur-sm">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Remove button (top-right X) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
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

      {/* Checkbox */}
      <div
        className={`absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          selected
            ? "bg-accent border-accent"
            : "bg-white/70 border-white/80 backdrop-blur-sm"
        }`}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </div>

      {/* Size label */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
        <p className="text-[10px] text-white/70 font-sans">
          {formatSize(item.file.size)}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export default function Upload() {
  const { id: ceremonyId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadItems, setUploadItems] = useState([]);
  const [processing, setProcessing] = useState(false);

  const fileInputRef = useRef(null);
  const user = session?.user;

  // Match bucket policy: image/* and video/* — no sub-type restrictions
  const ACCEPT = "image/*,video/*";
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB (matches bucket file_size_limit)

  async function processFiles(rawFiles) {
    setProcessing(true);
    const oversized = [];
    const unsupported = [];
    const valid = [];

    for (const f of rawFiles) {
      // Accept anything image/* or video/*
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
        unsupported.push(f.name);
        continue;
      }
      if (f.size > MAX_SIZE) {
        oversized.push(f.name);
        continue;
      }
      const { preview, isVideo } = await getFilePreview(f);
      valid.push({
        id: crypto.randomUUID(),
        file: f,
        preview,
        isVideo,
        selected: true,
      });
    }

    if (unsupported.length > 0) {
      notify.warning(
        "Unsupported files skipped",
        `${unsupported.length} file${unsupported.length > 1 ? "s" : ""} weren't photos or videos.`,
      );
    }
    if (oversized.length > 0) {
      notify.warning(
        "Files too large",
        `${oversized.length} file${oversized.length > 1 ? "s" : ""} exceed 10 MB and were skipped.`,
      );
    }

    let addedCount = 0;
    setFiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.file.name));
      const unique = valid.filter((v) => !existingNames.has(v.file.name));
      addedCount = unique.length;
      return [...prev, ...unique];
    });

    if (addedCount > 0) {
      notify.success(
        "Files added",
        `${addedCount} file${addedCount !== 1 ? "s" : ""} ready to upload.`,
      );
    }
    setProcessing(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }

  function handleFileInput(e) {
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  function toggleSelect(id) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)),
    );
  }

  function removeFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const selected = files.filter((f) => f.selected);
  const allSelected = files.length > 0 && selected.length === files.length;

  function toggleAll() {
    setFiles((prev) => prev.map((f) => ({ ...f, selected: !allSelected })));
  }

  async function startUpload() {
    if (!selected.length) return;
    setUploading(true);

    const items = selected.map((f) => ({
      id: f.id,
      file: f.file,
      preview: f.preview,
      isVideo: f.isVideo,
      status: "pending",
      progress: 0,
      error: null,
    }));
    setUploadItems(items);

    let succeeded = 0;
    let failed = 0;

    for (const item of items) {
      setUploadItems((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "uploading", progress: 10 } : p,
        ),
      );
      try {
        const ext = item.file.name.split(".").pop();
        const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
        const path = `${ceremonyId}/${user.id}/${filename}`;

        const { data: fileData, error: storageErr } = await supabase.storage
          .from("media")
          .upload(path, item.file, {
            upsert: false,
            cacheControl: "3600",
            contentType: item.file.type, // explicit MIME
          });

        if (storageErr) throw storageErr;

        setUploadItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, progress: 80 } : p)),
        );

        const { data: publicData } = supabase.storage
          .from("media")
          .getPublicUrl(fileData.path);

        const { error: dbErr } = await supabase.from("media").insert({
          ceremony_id: ceremonyId,
          uploader_id: user.id,
          file_url: publicData.publicUrl,
          file_type: item.isVideo ? "video" : "image",
        });

        if (dbErr) throw dbErr;

        setUploadItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: "done", progress: 100 } : p,
          ),
        );
        succeeded++;
      } catch (err) {
        setUploadItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status: "error",
                  error: err?.message ?? "Upload failed",
                }
              : p,
          ),
        );
        failed++;
      }
    }

    if (failed === 0) {
      notify.success(
        "Upload complete",
        `${succeeded} file${succeeded !== 1 ? "s" : ""} uploaded successfully.`,
      );
    } else if (succeeded === 0) {
      notify.error(
        "Upload failed",
        `All ${failed} file${failed !== 1 ? "s" : ""} failed to upload.`,
      );
    } else {
      notify.warning(
        "Partially uploaded",
        `${succeeded} succeeded, ${failed} failed.`,
      );
    }
  }

  const dropZoneClass = `
    relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed
    transition-all duration-300 cursor-pointer select-none
    ${dragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-accent/40 hover:bg-parchment/30"}
  `;

  return (
    <div className="min-h-svh bg-ivory">
      {uploading && (
        <UploadProgressDialog
          items={uploadItems}
          onDone={() => navigate(`/ceremony/${ceremonyId}/my-media`)}
        />
      )}

      <header className="sticky top-0 z-40 glass-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(`/ceremony/${ceremonyId}/my-media`)}
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
          <p className="text-xs text-text-sm font-sans">Add to album</p>
          <h2 className="text-lg font-light text-text-h font-display leading-tight">
            Upload media
          </h2>
        </div>
      </header>

      <main className="page pt-6 pb-28">
        {/* Drop zone */}
        <div
          className={dropZoneClass}
          style={{ minHeight: files.length === 0 ? 280 : 120 }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !processing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center gap-3 py-6 px-8 text-center pointer-events-none">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragging ? "bg-accent/20" : "bg-parchment"}`}
            >
              {processing ? (
                <svg
                  className="w-6 h-6 text-accent animate-spin"
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
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-6 h-6 transition-colors duration-300 ${dragging ? "text-accent" : "text-text-sm"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              )}
            </div>
            {files.length === 0 ? (
              <>
                <p className="font-display text-lg font-light text-text-h">
                  {processing
                    ? "Processing files…"
                    : dragging
                      ? "Drop to add"
                      : "Drag photos & videos here"}
                </p>
                <p className="text-sm text-text-sm font-sans">
                  or click to browse from your device
                </p>
                <p className="text-xs text-text-sm font-sans opacity-60">
                  Photos & videos · Max 10 MB per file
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-text-h font-sans">
                {processing
                  ? "Processing…"
                  : dragging
                    ? "Drop to add more"
                    : "Tap to add more files"}
              </p>
            )}
          </div>
        </div>

        {/* File grid */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm font-sans text-text-sm hover:text-text transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${allSelected ? "bg-accent border-accent" : "border-border"}`}
                >
                  {allSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </div>
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-text-sm font-sans">
                {selected.length} of {files.length} selected
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {files.map((item) => (
                <FileCard
                  key={item.id}
                  item={item}
                  selected={item.selected}
                  onToggle={toggleSelect}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      {files.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 glass-sm border-t border-border px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(`/ceremony/${ceremonyId}/my-media`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={startUpload}
            disabled={selected.length === 0}
            className={`btn flex-1 justify-center text-sm font-medium transition-all ${
              selected.length === 0
                ? "bg-parchment text-text-sm cursor-not-allowed"
                : "btn-primary"
            }`}
          >
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {selected.length > 0
              ? `Upload ${selected.length} ${selected.length === 1 ? "file" : "files"}`
              : "Nothing selected"}
          </button>
        </div>
      )}
    </div>
  );
}
