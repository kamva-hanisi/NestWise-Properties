import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = process.env.DB_FILE || path.join(__dirname, "db.json");

const defaultData = {
  users: [],
  bookings: [],
  inquiries: [],
  ownerPosts: []
};

const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
};

export const readStore = () => {
  ensureDb();

  try {
    return { ...defaultData, ...JSON.parse(fs.readFileSync(DB_PATH, "utf8")) };
  } catch {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
    return { ...defaultData };
  }
};

export const writeStore = (data) => {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  return data;
};

export const updateStore = (updater) => {
  const current = readStore();
  const next = updater(current) || current;
  return writeStore(next);
};
