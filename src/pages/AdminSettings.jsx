import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { changePassword, updateProfile } from "../services/api.js";

function AdminSettings() {
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    preferences: {
      emailUpdates: user?.preferences?.emailUpdates ?? true,
      smsUpdates: user?.preferences?.smsUpdates ?? false,
      preferredMarket: user?.preferences?.preferredMarket || "both",
      preferredProvince: user?.preferences?.preferredProvince || ""
    }
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="container">
            <strong>NestWise Admin</strong>
            <a href="/">Client Site</a>
          </div>
        </header>
        <section className="section container page-section">
          <p className="alert alert-error">Admin access required.</p>
        </section>
      </div>
    );
  }

  const handleProfileChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("preferences.")) {
      const key = name.replace("preferences.", "");
      setProfile((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          [key]: type === "checkbox" ? checked : value
        }
      }));
      return;
    }

    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const data = await updateProfile(profile);
      updateUser(data.user);
      setNotice(data.message);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const data = await changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setNotice(data.message);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container">
          <strong>NestWise Admin</strong>
          <div>
            <Link to="/admin">Dashboard</Link>
            <a href="/">Client Site</a>
            <button className="nav-button" type="button" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="section container page-section settings-page">
        <SectionHeader
          eyebrow="Admin Settings"
          title="Manage admin account"
          text="Update admin details, dashboard preferences, and password."
        />

        {(notice || error) && (
          <p className={`alert ${error ? "alert-error" : "alert-success"}`}>
            {error || notice}
          </p>
        )}

        <div className="settings-grid">
          <form className="detail-panel settings-form" onSubmit={saveProfile}>
            <h2>Admin Profile</h2>
            <label>
              <span>Full Name</span>
              <input name="name" value={profile.name} onChange={handleProfileChange} required />
            </label>
            <label>
              <span>Email</span>
              <input value={user.email} disabled />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" value={profile.phone} onChange={handleProfileChange} />
            </label>

            <h2>Dashboard Preferences</h2>
            <label>
              <span>Default Market View</span>
              <select
                name="preferences.preferredMarket"
                value={profile.preferences.preferredMarket}
                onChange={handleProfileChange}
              >
                <option value="both">Both</option>
                <option value="buy">Buy Requests</option>
                <option value="rent">Rent Requests</option>
              </select>
            </label>
            <label>
              <span>Focus Province</span>
              <input
                name="preferences.preferredProvince"
                value={profile.preferences.preferredProvince}
                onChange={handleProfileChange}
                placeholder="Eastern Cape"
              />
            </label>
            <label className="setting-check">
              <input
                name="preferences.emailUpdates"
                type="checkbox"
                checked={profile.preferences.emailUpdates}
                onChange={handleProfileChange}
              />
              <span>Email alerts for new requests</span>
            </label>
            <label className="setting-check">
              <input
                name="preferences.smsUpdates"
                type="checkbox"
                checked={profile.preferences.smsUpdates}
                onChange={handleProfileChange}
              />
              <span>SMS alerts for urgent bookings</span>
            </label>
            <button className="button button-primary" type="submit">
              Save Admin Settings
            </button>
          </form>

          <div className="settings-side">
            <form className="detail-panel settings-form" onSubmit={savePassword}>
              <h2>Password</h2>
              <label>
                <span>Current Password</span>
                <input
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
              <label>
                <span>New Password</span>
                <input
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
              <button className="button button-secondary" type="submit">
                Change Password
              </button>
            </form>

            <div className="detail-panel">
              <h2>Protected Admin Account</h2>
              <p>
                Admin accounts cannot be deleted from settings. Use environment
                configuration or backend data management for admin access changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminSettings;
