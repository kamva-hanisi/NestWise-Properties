import { useState } from "react";
import { createInquiry } from "../services/api.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  propertyId: "",
  message: ""
};

function ContactForm({ properties = [], selectedProperty }) {
  const [form, setForm] = useState({
    ...emptyForm,
    propertyId: selectedProperty ? String(selectedProperty.id) : "",
    message: selectedProperty ? `I am interested in ${selectedProperty.title}.` : ""
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
      const data = await createInquiry(form);
      setNotice(data.message);
      setForm(emptyForm);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        <span>Property</span>
        <select name="propertyId" value={form.propertyId} onChange={handleChange}>
          <option value="">General inquiry</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.title}
            </option>
          ))}
        </select>
      </label>
      <label className="full">
        <span>Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us what you are looking for"
          required
        />
      </label>
      <button className="button button-primary" type="submit">
        Send Inquiry
      </button>
      {notice && <p className="alert alert-success">{notice}</p>}
      {error && <p className="alert alert-error">{error}</p>}
    </form>
  );
}

export default ContactForm;
