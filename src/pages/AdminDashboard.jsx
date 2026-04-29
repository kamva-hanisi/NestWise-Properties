import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getAdminDashboard, updateBookingStatus } from "../services/api.js";

const statusOptions = [
  "Pending agent review",
  "Viewing scheduled",
  "Approved",
  "Completed",
  "Declined"
];

function AdminDashboard() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [form, setForm] = useState({
    email: "admin@nestwise.co.za",
    password: "admin123"
  });
  const [dashboard, setDashboard] = useState({
    stats: {},
    bookings: [],
    clients: [],
    renters: [],
    buyers: [],
    inquiries: []
  });
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  const isAdmin = user?.role === "admin";

  const loadDashboard = async () => {
    setError("");

    try {
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadDashboard();
    }
  }, [isAuthenticated, isAdmin]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      loadDashboard();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAuthError("");

    try {
      const data = await login(form);

      if (data.user.role !== "admin") {
        logout();
        setAuthError("This account is not an admin account.");
      }
    } catch (apiError) {
      setAuthError(apiError.message);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="container">
            <strong>NestWise Admin</strong>
            <a href="/">Client Site</a>
          </div>
        </header>
        <main className="admin-login-page container">
          <section className="auth-card admin-login-card">
            <p className="eyebrow">Admin Side</p>
            <h1>Company admin login</h1>
            <p>Sign in here to view client accounts, bookings, renters, buyers, and inquiries.</p>
            <p className="demo-admin">Demo admin: admin@nestwise.co.za / admin123</p>
            <form className="auth-form" onSubmit={handleAdminLogin}>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <button className="button button-primary" type="submit">
                Open Admin Dashboard
              </button>
              {authError && <p className="alert alert-error">{authError}</p>}
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container">
          <strong>NestWise Admin</strong>
          <div>
            <a href="/">Client Site</a>
            <button className="nav-button" type="button" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <section className="section container page-section admin-page">
        <SectionHeader
          eyebrow="Admin Side"
          title="Everything about clients and requests"
          text="Review bookings, clients, renters, buyers, inquiries, and request status."
        />

        {error && <p className="alert alert-error">{error}</p>}

        <div className="admin-stats">
          <div>
            <strong>{dashboard.stats.clients || 0}</strong>
            <span>Clients</span>
          </div>
          <div>
            <strong>{dashboard.stats.bookings || 0}</strong>
            <span>Bookings</span>
          </div>
          <div>
            <strong>{dashboard.stats.renters || 0}</strong>
            <span>Rent Requests</span>
          </div>
          <div>
            <strong>{dashboard.stats.buyers || 0}</strong>
            <span>Buy Requests</span>
          </div>
          <div>
            <strong>{dashboard.stats.pending || 0}</strong>
            <span>Pending</span>
          </div>
          <div>
            <strong>{dashboard.stats.properties || 0}</strong>
            <span>Properties</span>
          </div>
          <div>
            <strong>{dashboard.stats.inquiries || 0}</strong>
            <span>Inquiries</span>
          </div>
        </div>

        <div className="admin-layout">
          <div className="detail-panel">
            <h2>Bookings</h2>
            {!dashboard.bookings.length ? (
              <p className="status">No booking requests yet.</p>
            ) : (
              <div className="admin-table">
                {dashboard.bookings.map((booking) => (
                  <article key={booking.id}>
                    <div>
                      <strong>{booking.property?.title || "Property"}</strong>
                      <span>{booking.client?.name || "Client"}</span>
                    </div>
                    <div>
                      <span>{booking.action}</span>
                      <span>{booking.viewingDate || "No date selected"}</span>
                    </div>
                    <select
                      value={booking.status}
                      onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="admin-side">
            <div className="detail-panel">
              <h2>Clients</h2>
              {!dashboard.clients.length ? (
                <p className="status">No client accounts yet.</p>
              ) : (
                <div className="client-list">
                  {dashboard.clients.map((client) => (
                    <article key={client.id}>
                      <strong>{client.name}</strong>
                      <span>{client.email}</span>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="detail-panel">
              <h2>Renters & Buyers</h2>
              <p>{dashboard.renters.length} renter requests</p>
              <p>{dashboard.buyers.length} buyer requests</p>
            </div>

            <div className="detail-panel">
              <h2>Contact Inquiries</h2>
              {!dashboard.inquiries.length ? (
                <p className="status">No public inquiries yet.</p>
              ) : (
                <div className="client-list">
                  {dashboard.inquiries.map((inquiry) => (
                    <article key={inquiry.id}>
                      <strong>{inquiry.name}</strong>
                      <span>{inquiry.email}</span>
                      <p>{inquiry.message}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
