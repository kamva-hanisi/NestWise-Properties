import { useEffect, useMemo, useState } from "react";
import PropertyGrid from "../components/PropertyGrid.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { getProperties } from "../services/api.js";

function Favorites() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    getProperties()
      .then((data) => setProperties(data.properties))
      .finally(() => setLoading(false));
  }, []);

  const savedProperties = useMemo(
    () => properties.filter((property) => favorites.includes(property.id)),
    [favorites, properties]
  );

  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow="Favorites"
        title="Your saved properties"
        text="Saved homes are kept in your browser with localStorage."
      />
      {loading ? (
        <p className="status">Loading saved properties...</p>
      ) : (
        <PropertyGrid
          properties={savedProperties}
          favorites={favorites}
          onFavorite={toggleFavorite}
        />
      )}
    </section>
  );
}

export default Favorites;
