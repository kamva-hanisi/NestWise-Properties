import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOwnerPost } from "../services/api.js";

function OwnerPost({ goal }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    listingGoal: goal,
    propertyType: "House",
    title: "",
    location: "",
    expectedPrice: "",
    bedrooms: "",
    bathrooms: "",
    ownerNotes: "",
    contactPreference: "phone"
  });

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const isRent = goal === "rent-out";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createOwnerPost(form);
      navigate("/account");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow={isRent ? "Rent Out Property" : "Sell Property"}
        title={isRent ? "Let NestWise rent out your property" : "Let NestWise sell your property"}
        text="Post your property details and the company will follow up with you."
      />

      {error && <p className="alert alert-error">{error}</p>}

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="detail-panel settings-form">
          <h2>Property Details</h2>
          <label>
            <span>Property Type</span>
            <select name="propertyType" value={form.propertyType} onChange={handleChange}>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </label>
          <label>
            <span>Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Modern family house"
              required
            />
          </label>
          <label>
            <span>Location</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, country"
              required
            />
          </label>
          <label>
            <span>{isRent ? "Expected Monthly Rent" : "Expected Selling Price"}</span>
            <input
              name="expectedPrice"
              value={form.expectedPrice}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="detail-panel settings-form">
          <h2>More Information</h2>
          <label>
            <span>Bedrooms</span>
            <input name="bedrooms" value={form.bedrooms} onChange={handleChange} />
          </label>
          <label>
            <span>Bathrooms</span>
            <input name="bathrooms" value={form.bathrooms} onChange={handleChange} />
          </label>
          <label>
            <span>Contact Preference</span>
            <select
              name="contactPreference"
              value={form.contactPreference}
              onChange={handleChange}
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>
            <span>Notes</span>
            <textarea
              name="ownerNotes"
              value={form.ownerNotes}
              onChange={handleChange}
              placeholder="Tell NestWise about the condition, availability, and special features."
            />
          </label>
        </div>

        <div className="request-actions">
          <Link className="button button-ghost" to="/account">
            Cancel
          </Link>
          <button className="button button-primary" type="submit">
            Submit Property
          </button>
        </div>
      </form>
    </section>
  );
}

export default OwnerPost;
