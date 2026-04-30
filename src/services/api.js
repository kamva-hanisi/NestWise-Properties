const API_BASE = "/api";

const request = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

const authHeaders = () => {
  const token = localStorage.getItem("nestwise:token");

  return token ? { Authorization: `Bearer ${token}` } : {};
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

export const signUp = (payload) =>
  request("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

export const signIn = (payload) =>
  request("/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

export const getMe = () =>
  request("/auth/me", {
    headers: authHeaders()
  });

export const updateProfile = (payload) =>
  request("/auth/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

export const changePassword = (payload) =>
  request("/auth/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

export const deleteAccount = () =>
  request("/auth/account", {
    method: "DELETE",
    headers: authHeaders()
  });

export const createBooking = (payload) =>
  request("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

export const getBookings = () =>
  request("/bookings", {
    headers: authHeaders()
  });

export const getOwnerPosts = () =>
  request("/owner-posts", {
    headers: authHeaders()
  });

export const createOwnerPost = (payload) =>
  request("/owner-posts", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

export const getAdminDashboard = () =>
  request("/admin/dashboard", {
    headers: authHeaders()
  });

export const updateBookingStatus = (id, status) =>
  request(`/admin/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status })
  });

export const deleteAdminClient = (id) =>
  request(`/admin/clients/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
