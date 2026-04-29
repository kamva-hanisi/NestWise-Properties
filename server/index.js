import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { agents, properties } from "./data/properties.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const users = [];
const sessions = new Map();
const bookings = [];

const toMoney = (value) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);

const normalize = (value = "") => String(value).trim().toLowerCase();

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone
});

const getUserFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const userId = sessions.get(token);

  return users.find((user) => user.id === userId);
};

const requireAuth = (req, res, next) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  req.user = user;
  return next();
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NestWise Properties API" });
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, phone, password } = req.body;
  const cleanEmail = normalize(email);

  if (!name || !cleanEmail || !password) {
    return res.status(400).json({
      message: "Please provide your name, email, and password."
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters."
    });
  }

  const exists = users.some((user) => normalize(user.email) === cleanEmail);

  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = {
    id: Date.now(),
    name,
    email: cleanEmail,
    phone: phone || "",
    password,
    createdAt: new Date().toISOString()
  };
  const token = `token-${user.id}-${Math.random().toString(16).slice(2)}`;

  users.push(user);
  sessions.set(token, user.id);

  return res.status(201).json({
    message: "Account created successfully.",
    token,
    user: publicUser(user)
  });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => normalize(item.email) === normalize(email));

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = `token-${user.id}-${Math.random().toString(16).slice(2)}`;
  sessions.set(token, user.id);

  return res.json({
    message: "Signed in successfully.",
    token,
    user: publicUser(user)
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get("/api/properties", (req, res) => {
  const location = normalize(req.query.location);
  const type = normalize(req.query.type);
  const maxPrice = Number(req.query.maxPrice || 0);
  const status = normalize(req.query.status);

  const results = properties.filter((property) => {
    const matchesLocation =
      !location ||
      normalize(property.location).includes(location) ||
      normalize(property.city).includes(location) ||
      normalize(property.province).includes(location);
    const matchesType = !type || normalize(property.type).includes(type);
    const matchesPrice = !maxPrice || property.price <= maxPrice;
    const matchesStatus = !status || normalize(property.status) === status;

    return matchesLocation && matchesType && matchesPrice && matchesStatus;
  });

  res.json({
    count: results.length,
    properties: results.map((property) => ({
      ...property,
      formattedPrice: toMoney(property.price)
    }))
  });
});

app.get("/api/bookings", requireAuth, (req, res) => {
  const userBookings = bookings
    .filter((booking) => booking.userId === req.user.id)
    .map((booking) => ({
      ...booking,
      property: properties.find((property) => property.id === booking.propertyId)
    }));

  return res.json({ count: userBookings.length, bookings: userBookings });
});

app.post("/api/bookings", requireAuth, (req, res) => {
  const { propertyId, action, viewingDate, message } = req.body;
  const property = properties.find((item) => item.id === Number(propertyId));

  if (!property) {
    return res.status(404).json({ message: "Property not found." });
  }

  if (!["buy", "rent", "viewing"].includes(action)) {
    return res.status(400).json({ message: "Please choose buy, rent, or viewing." });
  }

  const booking = {
    id: Date.now(),
    userId: req.user.id,
    propertyId: property.id,
    action,
    viewingDate: viewingDate || "",
    message: message || "",
    status: "Pending agent review",
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);

  return res.status(201).json({
    message: `Your ${action} request has been sent to NestWise.`,
    booking
  });
});

app.get("/api/properties/:id", (req, res) => {
  const property = properties.find((item) => item.id === Number(req.params.id));

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  return res.json({ ...property, formattedPrice: toMoney(property.price) });
});

app.get("/api/about", (_req, res) => {
  res.json({
    stats: [
      { label: "Happy Homeowners", value: "500+" },
      { label: "Years of Industry Experience", value: "10+" },
      { label: "Customer Satisfaction", value: "100%" }
    ],
    values: ["Integrity", "Excellence", "Innovation", "Customer-Centric"],
    agents
  });
});

app.post("/api/inquiries", (req, res) => {
  const { name, email, phone, message, propertyId } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Please provide your name, email, and message."
    });
  }

  return res.status(201).json({
    message: "Thank you. A NestWise agent will contact you soon.",
    inquiry: {
      id: Date.now(),
      name,
      email,
      phone: phone || "",
      message,
      propertyId: propertyId || null,
      createdAt: new Date().toISOString()
    }
  });
});

const clientDist = path.resolve(__dirname, "../dist");
app.use(express.static(clientDist));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }

  return res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`NestWise API running on http://localhost:${PORT}`);
});
