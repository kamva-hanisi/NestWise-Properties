import { Link } from "react-router-dom";

function PropertyCard({ property, isFavorite, onFavorite }) {
  return (
    <article className="property-card">
      <Link to={`/properties/${property.id}`} className="property-image-link">
        <img src={property.image} alt={property.title} />
      </Link>
      <div className="property-card-body">
        <div className="property-meta">
          <span>{property.status}</span>
          <strong>{property.formattedPrice}</strong>
        </div>
        <h3>
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="location">{property.location}</p>
        <dl>
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
        </dl>
        <div className="card-actions">
          <Link className="button button-secondary" to={`/properties/${property.id}`}>
            View Details
          </Link>
          <button
            className="button button-ghost"
            type="button"
            onClick={() => onFavorite(property.id)}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
