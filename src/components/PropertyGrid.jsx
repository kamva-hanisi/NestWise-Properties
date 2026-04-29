import PropertyCard from "./PropertyCard.jsx";

function PropertyGrid({ properties, favorites, onFavorite }) {
  if (!properties.length) {
    return <p className="status">No properties matched your search.</p>;
  }

  return (
    <div className="property-grid">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}

export default PropertyGrid;
