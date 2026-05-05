import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  preferences: {
    emailUpdates: true,
    smsUpdates: false,
    preferredMarket: "buy",
    preferredProvince: ""
  }
};

function AuthPage({ mode }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("preferences.")) {
      const key = name.replace("preferences.", "");
      setForm((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          [key]: type === "checkbox" ? checked : value
        }
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate("/account");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <section className="section container auth-page">
      <div className="auth-card">
        <p className="eyebrow">Client Account</p>
        <h1>{isSignup ? "Create your NestWise account" : "Sign in to NestWise"}</h1>
        <p>
          {isSignup
            ? "Create an account to book viewings, rent homes, and request to buy properties."
            : "Access your bookings and send buy or rent requests as a registered client."}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>
                <span>Full Name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                <span>Phone</span>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>
              <label>
                <span>Preferred Market</span>
                <select
                  name="preferences.preferredMarket"
                  value={form.preferences.preferredMarket}
                  onChange={handleChange}
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
                  value={form.preferences.preferredProvince}
                  onChange={handleChange}
                  placeholder="Eastern Cape"
                />
              </label>
              <div className="signup-checks">
                <label className="setting-check">
                  <input
                    name="preferences.emailUpdates"
                    type="checkbox"
                    checked={form.preferences.emailUpdates}
                    onChange={handleChange}
                  />
                  <span>Email updates</span>
                </label>
                <label className="setting-check">
                  <input
                    name="preferences.smsUpdates"
                    type="checkbox"
                    checked={form.preferences.smsUpdates}
                    onChange={handleChange}
                  />
                  <span>SMS updates</span>
                </label>
              </div>
            </>
          )}
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="button button-primary" type="submit">
            {isSignup ? "Create Account" : "Sign In"}
          </button>
          {error && <p className="alert alert-error">{error}</p>}
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isSignup ? "/signin" : "/signup"}>
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default AuthPage;
