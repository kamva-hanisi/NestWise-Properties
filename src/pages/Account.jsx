import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getBookings } from "../services/api.js";

const timeAgo = (value) => {
  if (!value) return "Never";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return `${Math.floor(hours / 24)} day ago`;
};

const statusClass = (status = "") =>
  status.toLowerCase().includes("approved")
    ? "approved"
    : status.toLowerCase().includes("declined")
      ? "declined"
      : "pending";

function Account() {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    getBookings()
      .then((data) => setBookings(data.bookings))
      .catch((apiError) => setError(apiError.message));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow="My Account"
        title={`Welcome, ${user.name}`}
        text="Manage your client requests for buying, renting, and property viewings."
      />

      <div className="account-grid">
        <div className="detail-panel">
          <h2>Client Details</h2>
          <p>{user.email}</p>
          {user.phone && <p>{user.phone}</p>}
          <p>Last seen: {timeAgo(user.lastSeenAt)}</p>
          <div className="auth-actions">
            <Link className="button button-primary" to="/buy">
              Buy House
            </Link>
            <Link className="button button-ghost" to="/rent">
              Rent House
            </Link>
            <Link className="button button-secondary" to="/settings">
              Settings
            </Link>
          </div>
        </div>

        <div className="detail-panel">
          <h2>My Requests</h2>
          {error && <p className="alert alert-error">{error}</p>}
          {!bookings.length ? (
            <p className="status">You have not sent any booking requests yet.</p>
          ) : (
            <div className="booking-list">
              {bookings.map((booking) => (
                <article key={booking.id}>
                  <strong>{booking.property?.title || "Property"}</strong>
                  <span>{booking.action}</span>
                  <p className={`request-status ${statusClass(booking.status)}`}>
                    {booking.status}
                  </p>
                  <p>{booking.viewingDate ? `Preferred date: ${booking.viewingDate}` : "No date selected"}</p>
                  {booking.personalDetails?.phone && <p>Phone: {booking.personalDetails.phone}</p>}
                  <p>Submitted: {timeAgo(booking.createdAt)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Account;
