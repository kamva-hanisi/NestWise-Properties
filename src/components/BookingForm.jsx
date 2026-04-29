import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function BookingForm({ property, action = "viewing" }) {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    action,
    viewingDate: "",
    message: `I am interested in ${property.title}.`
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const requestUrl = `/request/${property.id}?action=${encodeURIComponent(
    form.action
  )}&date=${encodeURIComponent(form.viewingDate)}&message=${encodeURIComponent(
    form.message
  )}`;

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h3>Client account required</h3>
        <p>Sign in or create an account before booking, renting, or buying.</p>
        <div className="auth-actions">
          <Link className="button button-primary" to="/signin">
            Sign In
          </Link>
          <Link className="button button-ghost" to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="booking-form">
      <p className="signed-in-note">Booking as {user.name}</p>
      <label>
        <span>Request Type</span>
        <select name="action" value={form.action} onChange={handleChange}>
          <option value="viewing">Book Viewing</option>
          <option value="buy">Buy House</option>
          <option value="rent">Rent House</option>
        </select>
      </label>
      <label>
        <span>Preferred Date</span>
        <input
          name="viewingDate"
          type="date"
          value={form.viewingDate}
          onChange={handleChange}
        />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" value={form.message} onChange={handleChange} />
      </label>
      <Link className="button button-primary" to={requestUrl}>
        Continue to Personal Details
      </Link>
    </form>
  );
}

export default BookingForm;
