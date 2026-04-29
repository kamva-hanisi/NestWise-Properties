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

const toMoney = (value) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);

const normalize = (value = "") => String(value).trim().toLowerCase();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NestWise Properties API" });
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
