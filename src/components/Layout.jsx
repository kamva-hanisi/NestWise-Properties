import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

const propertyLinks = [
  { label: "Buy Houses", to: "/buy/houses" },
  { label: "Rent Houses", to: "/rent/houses" },
  { label: "Buy Apartments", to: "/buy/apartments" },
  { label: "Rent Apartments", to: "/rent/apartments" },
  { label: "Sell My Property", to: "/post/sell" },
  { label: "Rent Out My Property", to: "/post/rent" }
];

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const closeMenu = () => {
    setMenuOpen(false);
    setPropertyOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="navbar container">
          <NavLink className="brand" to="/" onClick={closeMenu}>
            NestWise Properties
          </NavLink>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open);
              setPropertyOpen(false);
            }}
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
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "is-active" : "")}
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
            <div className={`nav-dropdown ${propertyOpen ? "is-open" : ""}`}>
              <button
                className="nav-dropdown-trigger"
                type="button"
                aria-expanded={propertyOpen}
                onClick={() => setPropertyOpen((open) => !open)}
              >
                Property Hub
              </button>
              <div className="nav-dropdown-menu">
                {propertyLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) => (isActive ? "is-active" : "")}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/account"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? "is-active" : "")}
                >
                  {user.name}
                </NavLink>
                <button className="nav-button" type="button" onClick={logout}>
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink
                to="/signin"
                onClick={closeMenu}
                className="nav-auth-button"
              >
                Sign In / Sign Up
              </NavLink>
            )}
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
