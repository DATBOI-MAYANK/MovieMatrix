import { useState, useEffect } from "react";
import { Menu, Search } from "lucide-react";

/*
  Tailwind-based responsive Navbar

  - Uses Tailwind utility classes for layout and styling
  - Responsive behavior:
    - On md+ screens: shows horizontal nav links and search box
    - On small screens: shows a menu button that toggles a vertical mobile menu
  - Search input is a controlled component (uses useState)
  - Accessible buttons and aria attributes included
*/

export function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = ["Home", "Trending", "Popular", "Movies", "TV-Shows"];

  // Close the mobile menu automatically when the viewport reaches md (>= 768px).
  // Use matchMedia to reliably detect breakpoint changes and clean up listeners.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) {
        setMobileOpen(false);
      }
    };

    // Ensure correct initial state
    handler();

    // Prefer the modern event API but fall back for older browsers
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else if (mq.addListener) {
      mq.addListener(handler);
    }

    // Also keep resize as a fallback
    window.addEventListener("resize", handler);

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else if (mq.removeListener) {
        mq.removeListener(handler);
      }
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <header className="bg-black text-white border-b border-white/20">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: brand / menu */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <Menu aria-hidden="true" size={24} />
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Brand (optional, but keeps structure) */}
          <div className="text-lg font-semibold">MovieMatrix</div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6 ml-4 text-lg">
            {links.map((label) => (
              <li
                key={label}
                className="hover:cursor-pointer hover:text-gray-300 transition-colors"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: search */}
        <div className="flex items-center gap-3">
          <label htmlFor="nav-search" className="sr-only">
            Search movies and shows
          </label>

          <div className="relative">
            <input
              id="nav-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-3 pr-10 py-2 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 w-48 md:w-64"
            />
            <button
              type="button"
              onClick={() => {
                /* Implement search action here or lift state up via props */
                // For now we just keep it controlled.
              }}
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100/60"
            >
              <Search size={20} color="gray" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu (collapsible) */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            <ul className="flex flex-col gap-2">
              {links.map((label) => (
                <li
                  key={label}
                  className="py-2 px-2 rounded-md hover:bg-white/5 hover:cursor-pointer"
                >
                  {label}
                </li>
              ))}
            </ul>

            {/* Mobile search (same controlled input) */}
            <div className="pt-2">
              <label htmlFor="mobile-search" className="sr-only">
                Search movies and shows
              </label>
              <div className="relative">
                <input
                  id="mobile-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-3 pr-10 py-2 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  <Search size={20} color="gray" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
