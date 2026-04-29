const defaultSearch = {
  location: "",
  type: "",
  maxPrice: "",
  status: ""
};

function SearchForm({ filters, setFilters, onSubmit, onReset, lockedStatus = "" }) {
  const current = filters || defaultSearch;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((state) => ({ ...state, [name]: value }));
  };

  return (
    <form className="search-panel" onSubmit={onSubmit}>
      <label>
        <span>Location</span>
        <input
          name="location"
          value={current.location}
          onChange={handleChange}
          placeholder="King William's Town"
        />
      </label>
      <label>
        <span>Property Type</span>
        <select name="type" value={current.type} onChange={handleChange}>
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
          value={current.maxPrice}
          onChange={handleChange}
          inputMode="numeric"
          placeholder="850000"
        />
      </label>
      <label>
        <span>Status</span>
        <select
          name="status"
          value={lockedStatus || current.status}
          onChange={handleChange}
          disabled={Boolean(lockedStatus)}
        >
          <option value="">Any status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>
      </label>
      <div className="search-actions">
        <button className="button button-primary" type="submit">
          Search
        </button>
        <button className="button button-ghost" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export { defaultSearch };
export default SearchForm;
