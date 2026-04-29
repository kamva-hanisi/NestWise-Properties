import { useEffect, useMemo, useState } from "react";

const API_BASE = "/api";

const navItems = [
  { label: "Properties", href: "#properties" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

const services = [
  "Personalised buying support",
  "Rental matching",
  "Property selling guidance",
  "Area and budget advice"
];

const defaultSearch = {
  location: "",
  type: "",
  maxPrice: "",
  status: ""
};

const defaultInquiry = {
  name: "",
  email: "",
  phone: "",
  message: "",
  propertyId: ""
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [about, setAbout] = useState({ stats: [], values: [], agents: [] });
  const [search, setSearch] = useState(defaultSearch);
  const [inquiry, setInquiry] = useState(defaultInquiry);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const response = await fetch(`${API_BASE}/properties?${params}`);
      if (!response.ok) throw new Error("Could not load properties.");

      const data = await response.json();
      setProperties(data.properties);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    fetch(`${API_BASE}/about`)
      .then((response) => response.json())
      .then(setAbout)
      .catch(() => setAbout({ stats: [], values: [], agents: [] }));
  }, []);

  const featuredCount = useMemo(
    () => properties.filter((property) => property.featured).length,
    [properties]
  );

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearch((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProperties(search);
  };

  const resetSearch = () => {
    setSearch(defaultSearch);
    fetchProperties();
  };

  const handleInquiryChange = (event) => {
    const { name, value } = event.target;
    setInquiry((current) => ({ ...current, [name]: value }));
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const response = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setNotice(data.message);
      setInquiry(defaultInquiry);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="navbar container">
          <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
            NestWise Properties
          </a>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a className="nav-action" href="#contact" onClick={() => setMenuOpen(false)}>
              Sign Up
            </a>
          </div>
        </nav>

        <section className="hero container" id="home">
          <p className="eyebrow">Buy, sell, or rent with confidence</p>
          <h1>Find Your Dream Home with Ease</h1>
          <p>
            Discover quality homes in strong locations, matched to your lifestyle,
            budget, and next move.
          </p>
          <a className="button button-primary" href="#properties">
            Explore Now
          </a>
        </section>
      </header>

      <main>
        <section className="search-band" aria-label="Property search">
          <form className="search-panel container" onSubmit={handleSearch}>
            <label>
              <span>Location</span>
              <input
                name="location"
                value={search.location}
                onChange={handleSearchChange}
                placeholder="King William's Town"
              />
            </label>
            <label>
              <span>Property Type</span>
              <select name="type" value={search.type} onChange={handleSearchChange}>
                <option value="">Any type</option>
                <option value="House">House</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Apartment">Apartment</option>
              </select>
            </label>
            <label>
              <span>Budget</span>
              <input
                name="maxPrice"
                value={search.maxPrice}
                onChange={handleSearchChange}
                inputMode="numeric"
                placeholder="850000"
              />
            </label>
            <label>
              <span>Status</span>
              <select name="status" value={search.status} onChange={handleSearchChange}>
                <option value="">Any status</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </label>
            <div className="search-actions">
              <button className="button button-primary" type="submit">
                Search
              </button>
              <button className="button button-ghost" type="button" onClick={resetSearch}>
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="section container properties-section" id="properties">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular Residence</p>
              <h2>Available properties from the NestWise API</h2>
            </div>
            <p>{featuredCount} featured homes currently highlighted.</p>
          </div>

          {error && <p className="alert alert-error">{error}</p>}
          {loading ? (
            <p className="status">Loading properties...</p>
          ) : (
            <div className="property-grid">
              {properties.map((property) => (
                <article className="property-card" key={property.id}>
                  <img src={property.image} alt={property.title} />
                  <div className="property-card-body">
                    <div className="property-meta">
                      <span>{property.status}</span>
                      <strong>{property.formattedPrice}</strong>
                    </div>
                    <h3>{property.title}</h3>
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
                    <a
                      className="button button-secondary"
                      href="#contact"
                      onClick={() =>
                        setInquiry((current) => ({
                          ...current,
                          propertyId: String(property.id),
                          message: `I am interested in ${property.title}.`
                        }))
                      }
                    >
                      Book Now
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section services" id="services">
          <div className="container service-layout">
            <div>
              <p className="eyebrow">Service</p>
              <h2>Real estate help that feels clear from the first call.</h2>
              <p>
                NestWise supports buyers, renters, and sellers with practical
                guidance, transparent communication, and property options that fit.
              </p>
            </div>
            <div className="service-list">
              {services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section container about-section" id="about">
          <img src="/images/about/hand.jpg" alt="A real estate handshake" />
          <div>
            <p className="eyebrow">Who We Are</p>
            <h2>Your trusted partner in real estate.</h2>
            <p>
              NestWise Properties helps individuals and families buy, sell, and
              rent homes with expert guidance and a practical, client-first process.
            </p>
            <div className="value-grid">
              {about.values.map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section container team-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Meet Our Experts</p>
              <h2>People ready to help you move.</h2>
            </div>
          </div>
          <div className="team-grid">
            {about.agents.map((agent) => (
              <article className="team-card" key={agent.id}>
                <img src={agent.image} alt={agent.name} />
                <h3>{agent.name}</h3>
                <p>{agent.role}</p>
              </article>
            ))}
          </div>
          <div className="stats-row">
            {about.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-layout">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Let us find your perfect property.</h2>
              <p>
                Send a message to the backend and a NestWise agent will receive your
                inquiry details.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleInquirySubmit}>
              <label>
                <span>Name</span>
                <input
                  name="name"
                  value={inquiry.name}
                  onChange={handleInquiryChange}
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={inquiry.email}
                  onChange={handleInquiryChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  name="phone"
                  value={inquiry.phone}
                  onChange={handleInquiryChange}
                  placeholder="+27..."
                />
              </label>
              <label>
                <span>Property</span>
                <select
                  name="propertyId"
                  value={inquiry.propertyId}
                  onChange={handleInquiryChange}
                >
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
                  value={inquiry.message}
                  onChange={handleInquiryChange}
                  placeholder="Tell us what you are looking for"
                  required
                />
              </label>
              <button className="button button-primary" type="submit">
                Send Inquiry
              </button>
              {notice && <p className="alert alert-success">{notice}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <span>NestWise Properties</span>
          <span>Designed by Kamva Hanisi</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
