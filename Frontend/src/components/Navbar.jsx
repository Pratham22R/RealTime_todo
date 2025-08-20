import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import ActivityDrawer from "./Board/ActivityDrawer";
import ActivityLog from "./Board/ActivityLog";
import gsap from "gsap";

const Navbar = ({ user }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout } = useLogout();

  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);

  // Animate menu panel + links
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        panelRef.current,
        { x: "100%" },
        { x: 0, duration: 0.4, ease: "power3.out" }
      );

      gsap.fromTo(
        ".mobile-link",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: "power3.out" }
      );
    } else {
      // Animate out
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [menuOpen]);

  return (
    <>
      {/* STICKY NAVBAR */}
      <nav className="sticky mb-3 top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span role="img" aria-label="logo" className="text-2xl">
                📝
              </span>
              <span className="font-bold text-lg sm:text-xl text-gray-800">
                Teamlens
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-4">
              {location.pathname === "/board" && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition"
                >
                  Activity Log
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  {location.pathname !== "/dashboard" && (
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className={`px-4 py-2 rounded-xl font-medium transition ${location.pathname === "/dashboard"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <span className="hidden sm:inline text-gray-600">
                    Welcome, {user.username}!
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium shadow-sm hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-xl font-medium transition ${location.pathname === "/login"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-xl font-medium transition ${location.pathname === "/register"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Open menu"
              className="md:hidden grid gap-1.5 p-2"
              onClick={toggleMenu}
            >
              <span
                className={`h-0.5 w-6 rounded bg-gray-800 transform transition ${menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-6 rounded bg-gray-800 transition ${menuOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`h-0.5 w-6 rounded bg-gray-800 transform transition ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (animated with GSAP) */}
      {menuOpen && (
        <div className="fixed mb-4 inset-0 z-30 md:hidden flex">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/30"
            onClick={closeMenu}
          />
          {/* Slide-over Panel */}
          <div
            ref={panelRef}
            className="absolute right-0 top-12 h-full w-4/5 max-w-xs bg-white shadow-xl p-6 flex flex-col gap-4"
          >
            {location.pathname === "/board" && (
              <button
                onClick={() => {
                  setDrawerOpen(true);
                  closeMenu();
                }}
                className="mobile-link px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium"
              >
                Activity Log
              </button>
            )}

            {user ? (
              <>
                {location.pathname !== "/dashboard" && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="mobile-link px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="mobile-link text-gray-600">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={logout}
                  className="mobile-link px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="mobile-link px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mobile-link px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Activity Drawer */}
      <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ActivityLog />
      </ActivityDrawer>
    </>
  );
};

export default Navbar;
