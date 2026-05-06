import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "nestwise_properties",
  waitForConnections: true,
  connectionLimit: 10
});

const toIso = (value) => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const toSqlDate = (value) => {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 19).replace("T", " ");
};

const mapUser = (row) => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  phone: row.phone || "",
  passwordHash: row.password_hash,
  role: row.role,
  preferences: {
    emailUpdates: Boolean(row.email_updates),
    smsUpdates: Boolean(row.sms_updates),
    preferredMarket: row.preferred_market || "buy",
    preferredProvince: row.preferred_province || ""
  },
  lastSeenAt: toIso(row.last_seen_at),
  createdAt: toIso(row.created_at)
});

const mapBooking = (row) => ({
  id: Number(row.id),
  userId: Number(row.user_id),
  propertyId: Number(row.property_id),
  action: row.action,
  viewingDate: row.viewing_date || "",
  message: row.message || "",
  personalDetails: {
    fullName: row.personal_full_name || "",
    email: row.personal_email || "",
    phone: row.personal_phone || "",
    idNumber: row.personal_id_number || "",
    occupation: row.occupation || "",
    employer: row.employer || "",
    monthlyIncome: row.monthly_income || "",
    currentAddress: row.current_address || "",
    moveInDate: row.move_in_date || "",
    householdSize: row.household_size || "",
    notes: row.personal_notes || ""
  },
  financing: {
    method: row.financing_method || "",
    depositReady: Boolean(row.deposit_ready),
    preApproved: Boolean(row.pre_approved)
  },
  emergencyContact: {
    name: row.emergency_name || "",
    phone: row.emergency_phone || "",
    relationship: row.emergency_relationship || ""
  },
  status: row.status,
  createdAt: toIso(row.created_at)
});

const mapInquiry = (row) => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  phone: row.phone || "",
  message: row.message,
  propertyId: row.property_id === null ? null : Number(row.property_id),
  status: row.status,
  createdAt: toIso(row.created_at)
});

const mapOwnerPost = (row) => ({
  id: Number(row.id),
  userId: Number(row.user_id),
  listingGoal: row.listing_goal,
  propertyType: row.property_type,
  title: row.title,
  location: row.location,
  expectedPrice: String(Number(row.expected_price)),
  bedrooms: row.bedrooms || "",
  bathrooms: row.bathrooms || "",
  ownerNotes: row.owner_notes || "",
  contactPreference: row.contact_preference || "phone",
  status: row.status,
  createdAt: toIso(row.created_at)
});

const mapProperty = (row) => ({
  id: Number(row.id),
  title: row.title,
  location: row.location,
  city: row.city,
  province: row.province,
  type: row.type,
  status: row.status,
  price: Number(row.price),
  beds: Number(row.beds),
  baths: Number(row.baths),
  size: row.size || "",
  area: row.area || "",
  image: row.image || "",
  featured: Boolean(row.featured)
});

const mapAgent = (row) => ({
  id: Number(row.id),
  name: row.name,
  role: row.role,
  image: row.image || ""
});

export const readStore = async () => {
  const [users] = await pool.query("SELECT * FROM users ORDER BY created_at ASC");
  const [bookings] = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
  const [inquiries] = await pool.query("SELECT * FROM inquiries ORDER BY created_at DESC");
  const [ownerPosts] = await pool.query("SELECT * FROM owner_posts ORDER BY created_at DESC");

  return {
    users: users.map(mapUser),
    bookings: bookings.map(mapBooking),
    inquiries: inquiries.map(mapInquiry),
    ownerPosts: ownerPosts.map(mapOwnerPost)
  };
};

export const writeStore = async (data) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM bookings");
    await connection.query("DELETE FROM inquiries");
    await connection.query("DELETE FROM owner_posts");
    await connection.query("DELETE FROM users");

    if (data.users?.length) {
      await connection.query(
        `INSERT INTO users (
          id, name, email, phone, password_hash, role,
          email_updates, sms_updates, preferred_market, preferred_province,
          last_seen_at, created_at
        ) VALUES ?`,
        [
          data.users.map((user) => [
            user.id,
            user.name,
            user.email,
            user.phone || "",
            user.passwordHash,
            user.role || "client",
            user.preferences?.emailUpdates ?? true,
            user.preferences?.smsUpdates ?? false,
            user.preferences?.preferredMarket || "buy",
            user.preferences?.preferredProvince || "",
            toSqlDate(user.lastSeenAt),
            toSqlDate(user.createdAt)
          ])
        ]
      );
    }

    if (data.bookings?.length) {
      await connection.query(
        `INSERT INTO bookings (
          id, user_id, property_id, action, viewing_date, message,
          personal_full_name, personal_email, personal_phone, personal_id_number,
          occupation, employer, monthly_income, current_address, move_in_date,
          household_size, personal_notes, financing_method, deposit_ready,
          pre_approved, emergency_name, emergency_phone, emergency_relationship,
          status, created_at
        ) VALUES ?`,
        [
          data.bookings.map((booking) => [
            booking.id,
            booking.userId,
            booking.propertyId,
            booking.action,
            booking.viewingDate || "",
            booking.message || "",
            booking.personalDetails?.fullName || "",
            booking.personalDetails?.email || "",
            booking.personalDetails?.phone || "",
            booking.personalDetails?.idNumber || "",
            booking.personalDetails?.occupation || "",
            booking.personalDetails?.employer || "",
            booking.personalDetails?.monthlyIncome || "",
            booking.personalDetails?.currentAddress || "",
            booking.personalDetails?.moveInDate || "",
            booking.personalDetails?.householdSize || "",
            booking.personalDetails?.notes || "",
            booking.financing?.method || "",
            booking.financing?.depositReady ?? false,
            booking.financing?.preApproved ?? false,
            booking.emergencyContact?.name || "",
            booking.emergencyContact?.phone || "",
            booking.emergencyContact?.relationship || "",
            booking.status || "Pending agent review",
            toSqlDate(booking.createdAt)
          ])
        ]
      );
    }

    if (data.inquiries?.length) {
      await connection.query(
        `INSERT INTO inquiries (
          id, name, email, phone, message, property_id, status, created_at
        ) VALUES ?`,
        [
          data.inquiries.map((inquiry) => [
            inquiry.id,
            inquiry.name,
            inquiry.email,
            inquiry.phone || "",
            inquiry.message,
            inquiry.propertyId || null,
            inquiry.status || "New",
            toSqlDate(inquiry.createdAt)
          ])
        ]
      );
    }

    if (data.ownerPosts?.length) {
      await connection.query(
        `INSERT INTO owner_posts (
          id, user_id, listing_goal, property_type, title, location,
          expected_price, bedrooms, bathrooms, owner_notes, contact_preference,
          status, created_at
        ) VALUES ?`,
        [
          data.ownerPosts.map((post) => [
            post.id,
            post.userId,
            post.listingGoal,
            post.propertyType,
            post.title,
            post.location,
            post.expectedPrice,
            post.bedrooms || "",
            post.bathrooms || "",
            post.ownerNotes || "",
            post.contactPreference || "phone",
            post.status || "New owner request",
            toSqlDate(post.createdAt)
          ])
        ]
      );
    }

    await connection.commit();
    return data;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateStore = async (updater) => {
  const current = await readStore();
  const next = updater(current) || current;
  return writeStore(next);
};

export const readProperties = async () => {
  const [rows] = await pool.query("SELECT * FROM properties ORDER BY id ASC");
  return rows.map(mapProperty);
};

export const readAgents = async () => {
  const [rows] = await pool.query("SELECT * FROM agents ORDER BY id ASC");
  return rows.map(mapAgent);
};

export const testConnection = () => pool.query("SELECT 1");
