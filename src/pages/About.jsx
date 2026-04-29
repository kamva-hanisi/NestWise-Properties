import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader.jsx";
import { getAbout } from "../services/api.js";

function About() {
  const [about, setAbout] = useState({ stats: [], values: [], agents: [] });

  useEffect(() => {
    getAbout().then(setAbout).catch(() => setAbout({ stats: [], values: [], agents: [] }));
  }, []);

  return (
    <>
      <section className="page-hero about-hero">
        <div className="container">
          <p className="eyebrow">About NestWise</p>
          <h1>Your trusted partner in real estate.</h1>
          <p>
            We help individuals and families buy, sell, and rent homes with clear
            guidance and a client-first process.
          </p>
        </div>
      </section>

      <section className="section container about-section">
        <img src="/images/about/hand.jpg" alt="A real estate handshake" />
        <div>
          <p className="eyebrow">Who We Are</p>
          <h2>Find your dream home with NestWise Properties.</h2>
          <p>
            NestWise Properties is a forward-thinking real estate agency focused on
            practical support, local knowledge, and property services that match each
            client carefully.
          </p>
          <div className="value-grid">
            {about.values.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section container team-section">
        <SectionHeader eyebrow="Meet Our Experts" title="People ready to help you move." />
        <div className="team-grid">
          {about.agents.map((agent) => (
            <article className="team-card" key={agent.id}>
              <img src={agent.image} alt={agent.name} />
              <div>
                <h3>{agent.name}</h3>
                <p>{agent.role}</p>
              </div>
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
    </>
  );
}

export default About;
