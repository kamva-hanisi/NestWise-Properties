import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Favorites", to: "/favorites" },
  { label: "Contact", to: "/contact" }
];

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="navbar container">
          <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
            NestWise Properties
          </NavLink>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "is-active" : "")}
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <span>NestWise Properties</span>
          <span>Designed by Kamva Hanisi</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
