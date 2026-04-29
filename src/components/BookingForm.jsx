import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createBooking } from "../services/api.js";

function BookingForm({ property, action = "viewing" }) {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    action,
    viewingDate: "",
    message: `I am interested in ${property.title}.`
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const data = await createBooking({ ...form, propertyId: property.id });
      setNotice(data.message);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

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
    <form className="booking-form" onSubmit={handleSubmit}>
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
      <button className="button button-primary" type="submit">
        Send Request
      </button>
      {notice && <p className="alert alert-success">{notice}</p>}
      {error && <p className="alert alert-error">{error}</p>}
    </form>
  );
}

export default BookingForm;
