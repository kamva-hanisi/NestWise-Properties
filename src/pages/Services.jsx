import SectionHeader from "../components/SectionHeader.jsx";

const services = [
  {
    title: "Buy a Property",
    text: "Shortlist properties, compare locations, and book viewings with an agent."
  },
  {
    title: "Rent a Home",
    text: "Match your budget and lifestyle to rental listings that are ready to view."
  },
  {
    title: "Sell Your Home",
    text: "Prepare pricing, listing details, buyer communication, and viewing support."
  },
  {
    title: "Property Advice",
    text: "Get guidance on budget, location, property type, and long-term value."
  }
];

function Services() {
  return (
    <section className="section container page-section">
      <SectionHeader
        eyebrow="Services"
        title="Support for every property move"
        text="Choose the path that fits what you need right now."
      />
      <div className="feature-grid">
        {services.map((service) => (
          <article className="feature-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;
