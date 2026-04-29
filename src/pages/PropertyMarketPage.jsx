import { useEffect, useState } from "react";
import PropertyGrid from "../components/PropertyGrid.jsx";
import SearchForm, { defaultSearch } from "../components/SearchForm.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { getProperties } from "../services/api.js";

function PropertyMarketPage({ status, eyebrow, title, text }) {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ ...defaultSearch, status });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const loadProperties = async (nextFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const data = await getProperties({ ...nextFilters, status });
      setProperties(data.properties);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties({ ...defaultSearch, status });
  }, [status]);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadProperties(filters);
  };

  const handleReset = () => {
    const resetFilters = { ...defaultSearch, status };
    setFilters(resetFilters);
    loadProperties(resetFilters);
  };

  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        text={`${properties.length} ${status.toLowerCase()} listings from the backend. ${text}`}
      />

      <SearchForm
        filters={filters}
        setFilters={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
        lockedStatus={status}
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

export default PropertyMarketPage;
