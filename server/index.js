import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { agents, properties } from "./data/properties.js";
import { readStore, updateStore } from "./data/store.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const AUTH_SECRET = process.env.AUTH_SECRET || "nestwise-dev-secret-change-me";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nestwise.co.za";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const toMoney = (value) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);

const normalize = (value = "") => String(value).trim().toLowerCase();

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash = "") => {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) return false;

  const comparisonHash = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(comparisonHash));
};

const signToken = (user) => {
  const payload = Buffer.from(
    JSON.stringify({ userId: user.id, role: user.role, issuedAt: Date.now() })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");

  return `${payload}.${signature}`;
};

const verifyToken = (token = "") => {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role || "client",
  lastSeenAt: user.lastSeenAt || user.createdAt,
  createdAt: user.createdAt,
  preferences: user.preferences || {
    emailUpdates: true,
    smsUpdates: false,
    preferredMarket: "buy",
    preferredProvince: ""
  }
});

const getUserFromRequest = (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const session = verifyToken(token);

  if (!session) return null;

  return readStore().users.find((user) => user.id === session.userId);
};

const requireAuth = (req, res, next) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  req.user = user;
  updateStore((data) => {
    const storedUser = data.users.find((item) => item.id === user.id);

    if (storedUser) {
      storedUser.lastSeenAt = new Date().toISOString();
    }

    return data;
  });
  return next();
};

const ensureAdminUser = () => {
  updateStore((data) => {
    const adminExists = data.users.some((user) => normalize(user.email) === normalize(ADMIN_EMAIL));

    if (!adminExists) {
      data.users.push({
        id: 1,
        name: "NestWise Admin",
        email: normalize(ADMIN_EMAIL),
        phone: "",
        passwordHash: hashPassword(ADMIN_PASSWORD),
        role: "admin",
        createdAt: new Date().toISOString()
      });
    }

    return data;
  });
};

ensureAdminUser();

const requireAdmin = (req, res, next) => {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
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
  const data = readStore();

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

  const exists = data.users.some((user) => normalize(user.email) === cleanEmail);

  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = {
    id: Date.now(),
    name,
    email: cleanEmail,
    phone: phone || "",
    passwordHash: hashPassword(password),
    role: "client",
    createdAt: new Date().toISOString()
  };
  const token = signToken(user);

  updateStore((store) => {
    store.users.push(user);
    return store;
  });

  return res.status(201).json({
    message: "Account created successfully.",
    token,
    user: publicUser(user)
  });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body;
  const user = readStore().users.find((item) => normalize(item.email) === normalize(email));

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user);

  return res.json({
    message: "Signed in successfully.",
    token,
    user: publicUser(user)
  });
});

app.get("/api/admin/dashboard", requireAdmin, (_req, res) => {
  const data = readStore();
  const clientUsers = data.users.filter((user) => user.role !== "admin");
  const enrichedBookings = data.bookings.map((booking) => ({
    ...booking,
    client: publicUser(data.users.find((user) => user.id === booking.userId)),
    property: properties.find((property) => property.id === booking.propertyId)
  }));
  const enrichedInquiries = data.inquiries.map((inquiry) => ({
    ...inquiry,
    property: properties.find((property) => property.id === Number(inquiry.propertyId))
  }));
  const enrichedOwnerPosts = (data.ownerPosts || []).map((post) => ({
    ...post,
    client: publicUser(data.users.find((user) => user.id === post.userId))
  }));

  return res.json({
    stats: {
      clients: clientUsers.length,
      bookings: data.bookings.length,
      renters: data.bookings.filter((booking) => booking.action === "rent").length,
      buyers: data.bookings.filter((booking) => booking.action === "buy").length,
      pending: data.bookings.filter((booking) => booking.status === "Pending agent review").length,
      properties: properties.length,
      inquiries: data.inquiries.length,
      ownerPosts: (data.ownerPosts || []).length
    },
    bookings: enrichedBookings,
    clients: clientUsers.map(publicUser),
    renters: enrichedBookings.filter((booking) => booking.action === "rent"),
    buyers: enrichedBookings.filter((booking) => booking.action === "buy"),
    inquiries: enrichedInquiries,
    ownerPosts: enrichedOwnerPosts
  });
});

app.patch("/api/admin/bookings/:id", requireAdmin, (req, res) => {
  const data = readStore();
  const booking = data.bookings.find((item) => item.id === Number(req.params.id));

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  booking.status = req.body.status || booking.status;
  updateStore(() => data);

  return res.json({
    message: "Booking status updated.",
    booking
  });
});

app.delete("/api/admin/clients/:id", requireAdmin, (req, res) => {
  const clientId = Number(req.params.id);
  const data = readStore();
  const client = data.users.find((user) => user.id === clientId);

  if (!client || client.role === "admin") {
    return res.status(404).json({ message: "Client not found." });
  }

  updateStore((store) => ({
    ...store,
    users: store.users.filter((user) => user.id !== clientId),
    bookings: store.bookings.filter((booking) => booking.userId !== clientId)
  }));

  return res.json({
    message: "Client account and requests deleted."
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.patch("/api/auth/profile", requireAuth, (req, res) => {
  const { name, phone, preferences } = req.body;
  const data = readStore();
  const user = data.users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "Account not found." });
  }

  if (name) user.name = name;
  user.phone = phone || "";
  user.preferences = {
    ...(user.preferences || {}),
    ...(preferences || {})
  };

  updateStore(() => data);

  return res.json({
    message: "Settings updated.",
    user: publicUser(user)
  });
});

app.patch("/api/auth/password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const data = readStore();
  const user = data.users.find((item) => item.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "Account not found." });
  }

  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters." });
  }

  user.passwordHash = hashPassword(newPassword);
  updateStore(() => data);

  return res.json({ message: "Password changed successfully." });
});

app.delete("/api/auth/account", requireAuth, (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin accounts cannot be deleted here." });
  }

  updateStore((data) => ({
    ...data,
    users: data.users.filter((user) => user.id !== req.user.id),
    bookings: data.bookings.filter((booking) => booking.userId !== req.user.id)
  }));

  return res.json({ message: "Your account and booking requests have been deleted." });
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
  const userBookings = readStore().bookings
    .filter((booking) => booking.userId === req.user.id)
    .map((booking) => ({
      ...booking,
      property: properties.find((property) => property.id === booking.propertyId)
    }));

  return res.json({ count: userBookings.length, bookings: userBookings });
});

app.get("/api/owner-posts", requireAuth, (req, res) => {
  const posts = (readStore().ownerPosts || []).filter((post) => post.userId === req.user.id);

  return res.json({ count: posts.length, posts });
});

app.post("/api/owner-posts", requireAuth, (req, res) => {
  const {
    listingGoal,
    propertyType,
    title,
    location,
    expectedPrice,
    bedrooms,
    bathrooms,
    ownerNotes,
    contactPreference
  } = req.body;

  if (!listingGoal || !propertyType || !title || !location || !expectedPrice) {
    return res.status(400).json({
      message: "Please provide listing goal, property type, title, location, and expected price."
    });
  }

  const post = {
    id: Date.now(),
    userId: req.user.id,
    listingGoal,
    propertyType,
    title,
    location,
    expectedPrice,
    bedrooms: bedrooms || "",
    bathrooms: bathrooms || "",
    ownerNotes: ownerNotes || "",
    contactPreference: contactPreference || "phone",
    status: "New owner request",
    createdAt: new Date().toISOString()
  };

  updateStore((data) => {
    data.ownerPosts = data.ownerPosts || [];
    data.ownerPosts.push(post);
    return data;
  });

  return res.status(201).json({
    message: "Your property post has been sent to NestWise.",
    post
  });
});

app.post("/api/bookings", requireAuth, (req, res) => {
  const {
    propertyId,
    action,
    viewingDate,
    message,
    personalDetails = {},
    financing = {},
    emergencyContact = {}
  } = req.body;
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
    personalDetails: {
      fullName: personalDetails.fullName || req.user.name,
      email: normalize(personalDetails.email || req.user.email),
      phone: personalDetails.phone || req.user.phone || "",
      idNumber: personalDetails.idNumber || "",
      occupation: personalDetails.occupation || "",
      employer: personalDetails.employer || "",
      monthlyIncome: personalDetails.monthlyIncome || "",
      currentAddress: personalDetails.currentAddress || "",
      moveInDate: personalDetails.moveInDate || "",
      householdSize: personalDetails.householdSize || "",
      notes: personalDetails.notes || ""
    },
    financing: {
      method: financing.method || "",
      depositReady: Boolean(financing.depositReady),
      preApproved: Boolean(financing.preApproved)
    },
    emergencyContact: {
      name: emergencyContact.name || "",
      phone: emergencyContact.phone || "",
      relationship: emergencyContact.relationship || ""
    },
    status: "Pending agent review",
    createdAt: new Date().toISOString()
  };

  updateStore((data) => {
    data.bookings.push(booking);
    return data;
  });

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

  const inquiry = {
    id: Date.now(),
    name,
    email: normalize(email),
    phone: phone || "",
    message,
    propertyId: propertyId || null,
    status: "New",
    createdAt: new Date().toISOString()
  };

  updateStore((data) => {
    data.inquiries.push(inquiry);
    return data;
  });

  return res.status(201).json({
    message: "Thank you. A NestWise agent will contact you soon.",
    inquiry
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
