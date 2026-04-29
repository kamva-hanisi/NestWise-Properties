import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createBooking, getProperty } from "../services/api.js";

function RequestDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    action: params.get("action") || "viewing",
    viewingDate: params.get("date") || "",
    message: params.get("message") || "",
    personalDetails: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      idNumber: "",
      occupation: "",
      employer: "",
      monthlyIncome: "",
      currentAddress: "",
      moveInDate: "",
      householdSize: "",
      notes: ""
    },
    financing: {
      method: "",
      depositReady: false,
      preApproved: false
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });

  useEffect(() => {
    getProperty(id).then(setProperty).catch((apiError) => setError(apiError.message));
  }, [id]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const updateNested = (group, event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [name]: type === "checkbox" ? checked : value
      }
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createBooking({ ...form, propertyId: Number(id) });
      navigate("/account");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section className="section container page-section request-page">
      <SectionHeader
        eyebrow="Request Details"
        title="Complete your personal details"
        text="This gives the company enough information to follow up properly."
      />

      {error && <p className="alert alert-error">{error}</p>}

      <div className="request-summary">
        <img src={property?.image || "/images/house.png"} alt={property?.title || "Property"} />
        <div>
          <strong>{property?.title || "Selected property"}</strong>
          <span>{property?.location}</span>
          <span>{property?.formattedPrice}</span>
        </div>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="detail-panel settings-form">
          <h2>Request</h2>
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
        </div>

        <div className="detail-panel settings-form">
          <h2>Personal Details</h2>
          <label>
            <span>Full Name</span>
            <input
              name="fullName"
              value={form.personalDetails.fullName}
              onChange={(event) => updateNested("personalDetails", event)}
              required
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.personalDetails.email}
              onChange={(event) => updateNested("personalDetails", event)}
              required
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              name="phone"
              value={form.personalDetails.phone}
              onChange={(event) => updateNested("personalDetails", event)}
              required
            />
          </label>
          <label>
            <span>ID Number</span>
            <input
              name="idNumber"
              value={form.personalDetails.idNumber}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
          <label>
            <span>Current Address</span>
            <input
              name="currentAddress"
              value={form.personalDetails.currentAddress}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
          <label>
            <span>Move-in Date</span>
            <input
              name="moveInDate"
              type="date"
              value={form.personalDetails.moveInDate}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
        </div>

        <div className="detail-panel settings-form">
          <h2>Work & Finance</h2>
          <label>
            <span>Occupation</span>
            <input
              name="occupation"
              value={form.personalDetails.occupation}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
          <label>
            <span>Employer</span>
            <input
              name="employer"
              value={form.personalDetails.employer}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
          <label>
            <span>Monthly Income</span>
            <input
              name="monthlyIncome"
              value={form.personalDetails.monthlyIncome}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
          <label>
            <span>Payment Method</span>
            <select
              name="method"
              value={form.financing.method}
              onChange={(event) => updateNested("financing", event)}
            >
              <option value="">Select method</option>
              <option value="cash">Cash</option>
              <option value="bond">Home Loan / Bond</option>
              <option value="rental-income">Rental Income</option>
            </select>
          </label>
          <label className="setting-check">
            <input
              name="depositReady"
              type="checkbox"
              checked={form.financing.depositReady}
              onChange={(event) => updateNested("financing", event)}
            />
            <span>Deposit is ready</span>
          </label>
          <label className="setting-check">
            <input
              name="preApproved"
              type="checkbox"
              checked={form.financing.preApproved}
              onChange={(event) => updateNested("financing", event)}
            />
            <span>Pre-approved</span>
          </label>
        </div>

        <div className="detail-panel settings-form">
          <h2>Emergency Contact</h2>
          <label>
            <span>Name</span>
            <input
              name="name"
              value={form.emergencyContact.name}
              onChange={(event) => updateNested("emergencyContact", event)}
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              name="phone"
              value={form.emergencyContact.phone}
              onChange={(event) => updateNested("emergencyContact", event)}
            />
          </label>
          <label>
            <span>Relationship</span>
            <input
              name="relationship"
              value={form.emergencyContact.relationship}
              onChange={(event) => updateNested("emergencyContact", event)}
            />
          </label>
          <label>
            <span>Extra Notes</span>
            <textarea
              name="notes"
              value={form.personalDetails.notes}
              onChange={(event) => updateNested("personalDetails", event)}
            />
          </label>
        </div>

        <div className="request-actions">
          <Link className="button button-ghost" to={`/properties/${id}`}>
            Back
          </Link>
          <button className="button button-primary" type="submit">
            Submit Request
          </button>
        </div>
      </form>
    </section>
  );
}

export default RequestDetails;
