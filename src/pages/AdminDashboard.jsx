import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { deleteAdminClient, getAdminDashboard, updateBookingStatus } from "../services/api.js";

const statusOptions = [
  "Pending agent review",
  "Viewing scheduled",
  "Approved",
  "Completed",
  "Declined"
];

const timeAgo = (value) => {
  if (!value) return "Never";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return `${Math.floor(hours / 24)} day ago`;
};

const requestLabel = {
  viewing: "Bookings",
  rent: "Renting",
  buy: "Buying"
};

function AdminDashboard() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [dashboard, setDashboard] = useState({
    stats: {},
    bookings: [],
    clients: [],
    renters: [],
    buyers: [],
    inquiries: [],
    ownerPosts: []
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

  const handleDeleteClient = async (clientId, clientName) => {
    const confirmed = window.confirm(
      `Delete ${clientName}'s account and all of their requests?`
    );

    if (!confirmed) return;

    try {
      await deleteAdminClient(clientId);
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

  const renderRequests = (action) => {
    const items = dashboard.bookings.filter((booking) => booking.action === action);

    return (
      <div className="detail-panel admin-request-panel">
        <h2>{requestLabel[action]}</h2>
        {!items.length ? (
          <p className="status">No {requestLabel[action].toLowerCase()} requests yet.</p>
        ) : (
          <div className="admin-table admin-table-rich">
            {items.map((booking) => (
              <article key={booking.id}>
                <div>
                  <strong>{booking.property?.title || "Property"}</strong>
                  <span>{booking.property?.location}</span>
                  <span>Preferred: {booking.viewingDate || "No date selected"}</span>
                </div>
                <div>
                  <strong>{booking.personalDetails?.fullName || booking.client?.name}</strong>
                  <span>{booking.personalDetails?.email || booking.client?.email}</span>
                  <span>{booking.personalDetails?.phone || booking.client?.phone}</span>
                  <span>Last seen: {timeAgo(booking.client?.lastSeenAt)}</span>
                </div>
                <div>
                  <span>Occupation: {booking.personalDetails?.occupation || "Not provided"}</span>
                  <span>Income: {booking.personalDetails?.monthlyIncome || "Not provided"}</span>
                  <span>Address: {booking.personalDetails?.currentAddress || "Not provided"}</span>
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
    );
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
      <AdminHeader logout={logout} showDashboard={false} />
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
          <div>
            <strong>{dashboard.stats.ownerPosts || 0}</strong>
            <span>Owner Posts</span>
          </div>
        </div>

        <div className="admin-request-stack">
          {renderRequests("viewing")}
          {renderRequests("rent")}
          {renderRequests("buy")}
        </div>

        <div className="admin-layout">
          <div className="admin-side">
            <div className="detail-panel">
              <h2>Owner Property Posts</h2>
              {!dashboard.ownerPosts.length ? (
                <p className="status">No owner property posts yet.</p>
              ) : (
                <div className="client-list">
                  {dashboard.ownerPosts.map((post) => (
                    <article key={post.id}>
                      <strong>{post.title}</strong>
                      <span>{post.listingGoal === "rent-out" ? "Rent out" : "Sell"}</span>
                      <span>{post.propertyType}</span>
                      <span>{post.location}</span>
                      <span>Expected: {post.expectedPrice}</span>
                      <span>Owner: {post.client?.name || "Client"}</span>
                    </article>
                  ))}
                </div>
              )}
            </div>

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
                      <span>{client.phone || "No phone"}</span>
                      <span>Last seen: {timeAgo(client.lastSeenAt)}</span>
                      <button
                        className="button button-danger"
                        type="button"
                        onClick={() => handleDeleteClient(client.id, client.name)}
                      >
                        Delete Client
                      </button>
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
