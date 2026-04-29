import { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm.jsx";
import { getProperties } from "../services/api.js";

function Contact() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties().then((data) => setProperties(data.properties)).catch(() => setProperties([]));
  }, []);

  return (
    <section className="section contact-section page-contact">
      <div className="container contact-layout">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Let us find your perfect property.</h1>
          <p>
            Send a message to the Express backend and a NestWise agent will receive
            your inquiry details.
          </p>
        </div>
        <ContactForm properties={properties} />
      </div>
    </section>
  );
}

export default Contact;
