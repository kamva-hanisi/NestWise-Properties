import { useEffect, useState } from "react";
import PropertyGrid from "../components/PropertyGrid.jsx";
import SearchForm, { defaultSearch } from "../components/SearchForm.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { getProperties } from "../services/api.js";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(defaultSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const loadProperties = async (nextFilters = {}) => {
    setLoading(true);
    setError("");

    try {
      const data = await getProperties(nextFilters);
      setProperties(data.properties);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadProperties(filters);
  };

  const handleReset = () => {
    setFilters(defaultSearch);
    loadProperties();
  };

  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow="Properties"
        title="Browse homes, rentals, and apartments"
        text={`${properties.length} properties loaded from the backend.`}
      />

      <SearchForm
        filters={filters}
        setFilters={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      <div className="page-results">
        {error && <p className="alert alert-error">{error}</p>}
        {loading ? (
          <p className="status">Loading properties...</p>
        ) : (
          <PropertyGrid
            properties={properties}
            favorites={favorites}
            onFavorite={toggleFavorite}
          />
        )}
      </div>
    </section>
  );
}

export default Properties;
