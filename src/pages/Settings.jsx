import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { changePassword, deleteAccount, updateProfile } from "../services/api.js";

function Settings() {
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    preferences: {
      emailUpdates: user?.preferences?.emailUpdates ?? true,
      smsUpdates: user?.preferences?.smsUpdates ?? false,
      preferredMarket: user?.preferences?.preferredMarket || "buy",
      preferredProvince: user?.preferences?.preferredProvince || ""
    }
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [confirmDelete, setConfirmDelete] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
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

  const removeAccount = async () => {
    setNotice("");
    setError("");

    if (confirmDelete !== "DELETE") {
      setError("Type DELETE to confirm account deletion.");
      return;
    }

    try {
      await deleteAccount();
      logout();
      navigate("/");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section className="section container page-section settings-page">
      <SectionHeader
        eyebrow="Settings"
        title="Manage your client account"
        text="Update your details, preferences, password, or delete your account."
      />

      {(notice || error) && (
        <p className={`alert ${error ? "alert-error" : "alert-success"}`}>
          {error || notice}
        </p>
      )}

      <div className="settings-grid">
        <form className="detail-panel settings-form" onSubmit={saveProfile}>
          <h2>Profile</h2>
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

          <h2>Preferences</h2>
          <label>
            <span>Preferred Market</span>
            <select
              name="preferences.preferredMarket"
              value={profile.preferences.preferredMarket}
              onChange={handleProfileChange}
            >
              <option value="buy">Buying</option>
              <option value="rent">Renting</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>
            <span>Preferred Province</span>
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
            <span>Email updates</span>
          </label>
          <label className="setting-check">
            <input
              name="preferences.smsUpdates"
              type="checkbox"
              checked={profile.preferences.smsUpdates}
              onChange={handleProfileChange}
            />
            <span>SMS updates</span>
          </label>
          <button className="button button-primary" type="submit">
            Save Settings
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

          <div className="detail-panel danger-zone">
            <h2>Delete Account</h2>
            <p>
              This removes your client account and booking requests. Type DELETE to
              confirm.
            </p>
            <input
              value={confirmDelete}
              onChange={(event) => setConfirmDelete(event.target.value)}
              placeholder="DELETE"
            />
            <button className="button button-danger" type="button" onClick={removeAccount}>
              Delete My Account
            </button>
          </div>

          <Link className="button button-ghost" to="/account">
            Back to Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Settings;
