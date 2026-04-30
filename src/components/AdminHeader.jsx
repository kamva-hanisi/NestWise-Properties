import { useState } from "react";
import { Link } from "react-router-dom";

function AdminHeader({ logout, showDashboard = true }) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="admin-topbar">
      <div className="container">
        <strong>NestWise Admin</strong>
        <div className="admin-menu-wrap">
          <button
            className={`admin-menu-toggle ${open ? "is-open" : ""}`}
            type="button"
            aria-label="Toggle admin menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`admin-menu ${open ? "is-open" : ""}`}>
            {showDashboard && (
              <Link to="/admin" onClick={closeMenu}>
                Dashboard
              </Link>
            )}
            <Link to="/admin/settings" onClick={closeMenu}>
              Settings
            </Link>
            <a href="/" onClick={closeMenu}>
              Client Site
            </a>
            <button
              className="nav-button"
              type="button"
              onClick={() => {
                closeMenu();
                logout();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
