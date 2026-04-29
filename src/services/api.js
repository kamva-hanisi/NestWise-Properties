const API_BASE = "/api";

const request = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const getProperties = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  return request(`/properties${query ? `?${query}` : ""}`);
};

export const getProperty = (id) => request(`/properties/${id}`);

export const getAbout = () => request("/about");

export const createInquiry = (payload) =>
  request("/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
