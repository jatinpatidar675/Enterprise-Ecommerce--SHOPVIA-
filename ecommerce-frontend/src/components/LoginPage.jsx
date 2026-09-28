
import { useState } from "react";
import API from "../api";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      console.log("Login response:", response.data);

      const data = response.data;

      if (!data || !data.token || !data.userId) {
        setError("Invalid response received from server.");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(data.userId));

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // Send login data to App.jsx
      onLoginSuccess(data);

    } catch (err) {
      console.error("Login Error:", err);
      console.error("Status:", err.response?.status);
      console.error("Backend response:", err.response?.data);

      if (err.response) {
        setError(
          err.response.data?.message ||
          err.response.data?.error ||
          "Invalid email or password."
        );
      } else {
        setError(
          "Unable to connect to backend. Please make sure Spring Boot is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">

      <div className="auth-background">
        <div className="auth-orb orb-one"></div>
        <div className="auth-orb orb-two"></div>
        <div className="auth-grid"></div>
      </div>

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-brand-section">

          <div className="auth-logo">
            <span>S</span>
          </div>

          <h1>
            Welcome back to
            <strong> SHOPVIA</strong>
          </h1>

          <p>
            Your smart shopping experience starts here.
            Discover premium products, exclusive deals
            and effortless checkout.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>🛍️</span>
              <div>
                <strong>Premium Products</strong>
                <small>Curated products for you</small>
              </div>
            </div>

            <div className="auth-feature">
              <span>🔒</span>
              <div>
                <strong>Secure Shopping</strong>
                <small>Your information stays protected</small>
              </div>
            </div>

            <div className="auth-feature">
              <span>⚡</span>
              <div>
                <strong>Fast Experience</strong>
                <small>Simple and seamless shopping</small>
              </div>
            </div>

          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="auth-card">

          <div className="auth-card-header">

            <span className="auth-label">
              SHOPVIA ACCOUNT
            </span>

            <h2>Sign in</h2>

            <p>
              Enter your credentials to continue shopping.
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div className="auth-error">
              <span>⚠</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <span>✉</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>
            </div>

            {/* OPTIONS */}
            <div className="auth-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert("Password reset feature coming soon.")
                }
              >
                Forgot password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-loader"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* REGISTER */}
          <div className="auth-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={onRegister}
              disabled={loading}
            >
              Create Account
            </button>

          </div>

          {/* FOOTER */}
          <div className="auth-footer">

            <span>© 2026 SHOPVIA</span>

            <span>Smart Commerce</span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;

