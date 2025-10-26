import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/white_dressi_logo.png";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedStyleTest, setHasCompletedStyleTest] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("styleTestCompleted") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromStorage = () => {
      const completed = localStorage.getItem("styleTestCompleted") === "true";
      setHasCompletedStyleTest(completed);
    };

    const handleStatusEvent = (event: Event) => {
      const custom = event as CustomEvent<{ completed?: boolean }>;
      if (custom.detail && typeof custom.detail.completed === "boolean") {
        setHasCompletedStyleTest(custom.detail.completed);
      } else {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("styleTestStatusChange", handleStatusEvent as EventListener);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("styleTestStatusChange", handleStatusEvent as EventListener);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isAdmin = user?.isAdmin === true;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black border-b border-white/10">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Dressi Logo"
            className="h-20 w-25 object-contain"
          />
        </Link>
        <div className="hidden items-center gap-3 sm:flex sm:gap-6">
          {!hasCompletedStyleTest && (
            <Link
              to="/style-discovery"
              className="text-white text-base font-medium px-2 py-1 rounded transition hover:bg-neutral-900"
            >
              Style Discovery
            </Link>
          )}

          {hasCompletedStyleTest && (
            <Link
              to="/curated"
              className="text-white text-base font-medium px-2 py-1 rounded transition hover:bg-neutral-900"
            >
              Curated
            </Link>
          )}

          {user ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="text-white text-base font-medium px-2 py-1 rounded transition hover:bg-neutral-900"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                to="/profile"
                className="bg-pink-500 text-white text-base font-semibold px-4 py-1.5 rounded transition hover:bg-pink-400 shadow"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-white text-base font-medium px-2 py-1 rounded transition hover:bg-neutral-900"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white text-base font-medium px-2 py-1 rounded transition hover:bg-neutral-900"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-pink-500 text-white text-base font-semibold px-4 py-1.5 rounded transition hover:bg-pink-400 shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {mobileOpen ? (
        <div className="border-t border-white/10 bg-black/95 px-4 pb-6 pt-4 shadow-lg backdrop-blur sm:hidden">
          <div className="space-y-2">
            {!hasCompletedStyleTest ? (
              <Link
                to="/style-discovery"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-white transition hover:bg-neutral-900"
              >
                Style Discovery
              </Link>
            ) : (
              <Link
                to="/curated"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-white transition hover:bg-neutral-900"
              >
                Curated
              </Link>
            )}

            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-white transition hover:bg-neutral-900"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border border-pink-500/60 bg-pink-500 px-3 py-2 text-base font-semibold text-white shadow hover:bg-pink-400 transition"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-white transition hover:bg-neutral-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-white transition hover:bg-neutral-900"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border border-pink-500/60 bg-pink-500 px-3 py-2 text-base font-semibold text-white shadow hover:bg-pink-400 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
