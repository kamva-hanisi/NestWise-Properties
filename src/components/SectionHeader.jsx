function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default SectionHeader;
