import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import { createPortal } from "react-dom";
import noevent from "../assets/illustrations/noevent.svg";

// ── Icons ────────────────────────────────────────────────────────
const GridIcon = () => (
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
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ListIcon = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ImageIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity="0.3"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
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
const SortIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="9" y1="18" x2="15" y2="18" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_az", label: "Name A–Z" },
  { value: "name_za", label: "Name Z–A" },
];

const sortEvents = (events, sort) => {
  const arr = [...events];
  switch (sort) {
    case "oldest":
      return arr.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    case "name_az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "name_za":
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return arr.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
  }
};

// ── Sort Dropdown ──────────────────────────────────────────────
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function handleScroll() {
      setOpen(false);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-md transition-all duration-150 ${open ? "bg-accent/15 text-accent" : "text-text-sm hover:text-text"}`}
      >
        <SortIcon />
        <span className="hidden sm:inline text-xs">{current?.label}</span>
        <ChevronIcon />
      </button>
      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0"
              style={{ zIndex: 99 }}
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed w-48 p-1 shadow-glass-lg"
              style={{
                top: coords.top,
                right: coords.right,
                zIndex: 100,
                background: "rgba(255,252,248,0.75)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "1rem",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors hover:bg-parchment/60 font-sans ${value === opt.value ? "text-accent font-medium" : "text-text-sm"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

// ── Event Card — Grid mode ───────────────────────────────────────
function GridCard({ event, isOwner }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/ceremony/${event.id}`)}
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-lg cursor-pointer"
    >
      <div
        className="relative w-full bg-gradient-to-br from-parchment to-cream overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {event.cover_url ? (
          <img
            src={event.cover_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-parchment to-cream flex items-center justify-center">
            <ImageIcon />
          </div>
        )}
        {isOwner && (
          <span className="absolute top-3 right-3 badge bg-accent/20 text-accent border border-accent/30 text-[10px] backdrop-blur-sm z-10">
            Owner
          </span>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <div>
            <h3 className="font-display text-lg font-medium text-white leading-tight line-clamp-1 drop-shadow-sm">
              {event.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-white/80 text-xs drop-shadow-sm">
              <CalendarIcon />
              <span>{formatDate(event.created_at)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ceremony/${event.id}`);
              }}
              className="btn-secondary flex-1 justify-center text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Album
            </button>
            {isOwner ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/ceremony/${event.id}/manage`);
                }}
                className="btn-primary flex-1 justify-center text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Manage
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/ceremony/${event.id}/my-media`);
                }}
                className="flex-1 justify-center text-xs py-2 px-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 active:scale-95 text-white flex items-center gap-1.5"
                style={{ background: "#8DAA84", border: "none" }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                My Media
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Event Card — List mode ────────────────────────────────────────
function ListCard({ event, isOwner }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/ceremony/${event.id}`)}
      className="group relative flex items-center rounded-2xl overflow-hidden hover:shadow-glass-lg cursor-pointer"
      style={{ height: "72px" }}
    >
      <div className="relative flex-shrink-0 w-24 h-full">
        {event.cover_url ? (
          <img
            src={event.cover_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-parchment to-cream flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="relative flex-1 h-full flex items-center gap-3 px-4 min-w-0">
        {event.cover_url ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${event.cover_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(18px) brightness(0.7)",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-parchment to-cream" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderLeft: "1px solid rgba(255,255,255,0.25)",
          }}
        />
        <div className="relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-display text-sm font-medium text-white truncate leading-tight drop-shadow-sm">
              {event.name}
            </h3>
            {isOwner && (
              <span className="flex-shrink-0 badge bg-accent/20 text-accent border border-accent/30 text-[10px] backdrop-blur-sm">
                Owner
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-white/80 text-xs drop-shadow-sm">
            <CalendarIcon />
            <span>{formatDate(event.created_at)}</span>
          </div>
        </div>
        <div className="relative z-10 flex gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ceremony/${event.id}`);
            }}
            title="View Album"
            className="btn-secondary flex items-center justify-center rounded-full"
            style={{ width: "36px", height: "36px", padding: 0 }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          {isOwner ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ceremony/${event.id}/manage`);
              }}
              title="Manage"
              className="btn-primary flex items-center justify-center rounded-full"
              style={{ width: "36px", height: "36px", padding: 0 }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ceremony/${event.id}/my-media`);
              }}
              title="My Media"
              className="flex items-center justify-center rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                width: "36px",
                height: "36px",
                padding: 0,
                background: "#8DAA84",
                color: "#fff",
                border: "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── List Create Button ────────────────────────────────────────────
function ListCreateButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-accent/50 transition-all duration-200 px-4 text-text-sm hover:text-accent"
      style={{ height: "72px" }}
    >
      <div className="w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
        <PlusIcon />
      </div>
      <span className="text-sm font-medium">Create new event</span>
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ isOwner }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <img src={noevent} alt="" className="w-32 h-32 object-contain" />
      <div>
        <p className="text-text-sm text-sm">
          {isOwner
            ? "You haven't created any events yet."
            : "You haven't joined any events yet."}
        </p>
        {isOwner && (
          <button
            onClick={() => navigate("/ceremony/create")}
            className="btn-primary mt-4 mx-auto"
          >
            <PlusIcon /> Create your first event
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("newest");
  const [userEmail, setUserEmail] = useState("");

  const fetchData = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const userId = session.user.id;
    const { data: owned } = await supabase
      .from("ceremonies")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    const { data: uploads } = await supabase
      .from("media")
      .select("ceremony_id, ceremonies(*)")
      .eq("uploader_id", userId);
    const seen = new Set();
    const ownedIds = new Set((owned || []).map((e) => e.id));
    const joined = [];
    for (const row of uploads || []) {
      const c = row.ceremonies;
      if (c && !ownedIds.has(c.id) && !seen.has(c.id)) {
        seen.add(c.id);
        joined.push(c);
      }
    }
    setMyEvents(owned || []);
    setJoinedEvents(joined);
    setUserEmail(session.user.email || "");
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return (
      <div className="min-h-svh flex items-center justify-center">
        <Loader />
      </div>
    );

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "ME";
  const sortedMyEvents = sortEvents(myEvents, sortMode);
  const sortedJoinedEvents = sortEvents(joinedEvents, sortMode);
  const hasAnyEvents = myEvents.length > 0 || joinedEvents.length > 0;

  return (
    <div className="min-h-svh relative bg-ivory">
      <div
        className="fixed inset-0 z-0"
        style={{
          pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(210,200,188,0.22) 1px,transparent 1px),linear-gradient(90deg,rgba(210,200,188,0.22) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)",
        }}
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
              <LogoIcon />
              <span className="font-display text-lg font-light text-text-h tracking-wide">
                ShareAlbum
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/ceremony/create")}
                className="btn-primary text-sm hidden sm:inline-flex"
              >
                <PlusIcon /> New Event
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-xs font-medium text-accent border border-accent/20 hover:border-accent/50 transition-all"
              >
                {initials}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-light text-text-h">
                Your Albums
              </h1>
              <p className="text-text-sm mt-1 text-sm">
                Manage and browse all your shared memories.
              </p>
            </div>
            {hasAnyEvents && (
              <div
                className="relative flex items-center gap-0.5 p-1 rounded-xl flex-shrink-0"
                style={{
                  background: "rgba(255,252,248,0.6)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  zIndex: 40,
                }}
              >
                <SortDropdown value={sortMode} onChange={setSortMode} />
                <div
                  className="w-px h-4 mx-0.5"
                  style={{ background: "rgba(0,0,0,0.1)" }}
                />
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all duration-150 ${viewMode === "grid" ? "bg-accent/15 text-accent" : "text-text-sm hover:text-text"}`}
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all duration-150 ${viewMode === "list" ? "bg-accent/15 text-accent" : "text-text-sm hover:text-text"}`}
                >
                  <ListIcon />
                </button>
              </div>
            )}
          </div>

          <section className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-2xl font-light text-text-h">
                My Events
              </h2>
              {myEvents.length > 0 && (
                <span className="badge-gold text-xs">{myEvents.length}</span>
              )}
            </div>
            {myEvents.length === 0 ? (
              <EmptyState isOwner />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedMyEvents.map((e) => (
                  <GridCard key={e.id} event={e} isOwner />
                ))}
                <button
                  onClick={() => navigate("/ceremony/create")}
                  className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-accent/50 transition-all duration-200 text-text-sm hover:text-accent gap-3"
                  style={{ aspectRatio: "16/9" }}
                >
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center transition-transform group-hover:scale-110">
                    <PlusIcon />
                  </div>
                  <span className="text-sm font-medium">Create new event</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sortedMyEvents.map((e) => (
                  <ListCard key={e.id} event={e} isOwner />
                ))}
                <ListCreateButton
                  onClick={() => navigate("/ceremony/create")}
                />
              </div>
            )}
          </section>

          {joinedEvents.length > 0 && <div className="divider mb-14 -mt-8" />}

          {joinedEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-2xl font-light text-text-h">
                  Joined Events
                </h2>
                <span className="badge-gold text-xs">
                  {joinedEvents.length}
                </span>
              </div>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedJoinedEvents.map((e) => (
                    <GridCard key={e.id} event={e} isOwner={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sortedJoinedEvents.map((e) => (
                    <ListCard key={e.id} event={e} isOwner={false} />
                  ))}
                </div>
              )}
            </section>
          )}

          <button
            onClick={() => navigate("/ceremony/create")}
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary shadow-glass-lg flex items-center justify-center z-40"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </main>
      </div>
    </div>
  );
}
