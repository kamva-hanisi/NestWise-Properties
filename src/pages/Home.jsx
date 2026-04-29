import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PropertyGrid from "../components/PropertyGrid.jsx";
import SearchForm, { defaultSearch } from "../components/SearchForm.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { getAbout, getProperties } from "../services/api.js";

function Home() {
  const [properties, setProperties] = useState([]);
  const [about, setAbout] = useState({ stats: [] });
  const [filters, setFilters] = useState(defaultSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const featured = useMemo(
    () => properties.filter((property) => property.featured).slice(0, 3),
    [properties]
  );

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
    getAbout().then(setAbout).catch(() => setAbout({ stats: [] }));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadProperties(filters);
  };

  const handleReset = () => {
    setFilters(defaultSearch);
    loadProperties();
  };

  return (
    <>
      <section className="hero-page">
        <div className="container hero-content">
          <p className="eyebrow">Buy, sell, or rent with confidence</p>
          <h1>Find Your Dream Home with Ease</h1>
          <p>
            Discover quality homes in strong locations, matched to your lifestyle,
            budget, and next move.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/properties">
              Explore Properties
            </Link>
            <Link className="button button-light" to="/contact">
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>

      <section className="search-band" aria-label="Property search">
        <div className="container">
          <SearchForm
            filters={filters}
            setFilters={setFilters}
            onSubmit={handleSearch}
            onReset={handleReset}
          />
        </div>
      </section>

      <section className="section container">
        <SectionHeader
          eyebrow="Popular Residence"
          title="Featured homes connected to the backend"
          text="Search above or browse selected properties from the Express API."
        />
        {error && <p className="alert alert-error">{error}</p>}
        {loading ? (
          <p className="status">Loading properties...</p>
        ) : (
          <PropertyGrid
            properties={featured}
            favorites={favorites}
            onFavorite={toggleFavorite}
          />
        )}
      </section>

      <section className="section services">
        <div className="container service-layout">
          <div>
            <p className="eyebrow">Why NestWise</p>
            <h2>Real estate help that feels clear from the first call.</h2>
            <p>
              NestWise supports buyers, renters, and sellers with practical
              guidance, transparent communication, and property options that fit.
            </p>
          </div>
          <div className="stats-grid">
            {about.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
