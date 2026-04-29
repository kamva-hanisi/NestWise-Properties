import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContactForm from "../components/ContactForm.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { getProperties, getProperty } from "../services/api.js";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [singleProperty, list] = await Promise.all([
          getProperty(id),
          getProperties()
        ]);
        setProperty(singleProperty);
        setProperties(list.properties);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <p className="status container page-status">Loading property...</p>;
  }

  if (error || !property) {
    return (
      <section className="section container page-section">
        <p className="alert alert-error">{error || "Property not found."}</p>
        <Link className="button button-primary" to="/properties">
          Back to Properties
        </Link>
      </section>
    );
  }

  return (
    <section className="section container detail-page">
      <div className="detail-hero">
        <img src={property.image} alt={property.title} />
        <div>
          <p className="eyebrow">{property.status}</p>
          <h1>{property.title}</h1>
          <p>{property.location}</p>
          <strong>{property.formattedPrice}</strong>
          <button
            className="button button-ghost"
            type="button"
            onClick={() => toggleFavorite(property.id)}
          >
            {isFavorite(property.id) ? "Saved Property" : "Save Property"}
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-panel">
          <h2>Property Details</h2>
          <dl className="detail-list">
            <div>
              <dt>Type</dt>
              <dd>{property.type}</dd>
            </div>
            <div>
              <dt>Beds</dt>
              <dd>{property.beds}</dd>
            </div>
            <div>
              <dt>Baths</dt>
              <dd>{property.baths}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{property.size}</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>{property.area}</dd>
            </div>
            <div>
              <dt>Saved</dt>
              <dd>{favorites.includes(property.id) ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-panel">
          <h2>Book a Viewing</h2>
          <ContactForm properties={properties} selectedProperty={property} />
        </div>
      </div>
    </section>
  );
}

export default PropertyDetails;
