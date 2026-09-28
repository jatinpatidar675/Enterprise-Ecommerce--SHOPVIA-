import "./RegisterPage.css";
import { useState } from "react";
import API from "../api";

function RegisterPage({ onRegisterSuccess, onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phone.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      };

      console.log("Register request:", registerData);

      /*
       * IMPORTANT:
       * Backend endpoint is:
       * POST /api/users/register
       *
       * NOT /api/auth/register
       */

      const response = await API.post(
        "/users/register",
        registerData
      );

      console.log("Register response:", response.data);

      setSuccess(
        "Account created successfully! Please sign in."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
      });

      // Give user a moment to see success message
      setTimeout(() => {
        onRegisterSuccess();
      }, 800);
    } catch (err) {
      console.error("Registration Error:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      console.error(
        "Status:",
        err.response?.status
      );

      if (err.response) {
        const backendData = err.response.data;

        const message =
          backendData?.message ||
          backendData?.error ||
          (
            typeof backendData === "string"
              ? backendData
              : null
          ) ||
          `Registration failed (${err.response.status}).`;

        setError(message);
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
    <div className="register-page">

      <div className="register-background">
        <div className="register-glow glow-one"></div>
        <div className="register-glow glow-two"></div>
      </div>

      <div className="register-container">

        {/* LEFT SIDE */}

        <div className="register-brand">

          <div className="register-logo">
            S
          </div>

          <h1>
            SHOPVIA
          </h1>

          <span>
            SMART COMMERCE
          </span>

          <div className="register-tagline">
            Create your account and
            <br />
            start shopping smarter.
          </div>

          <div className="register-features">

            <div>
              <span>✓</span>

              <div>
                <strong>
                  Secure Shopping
                </strong>

                <small>
                  Your data stays protected
                </small>
              </div>
            </div>

            <div>
              <span>✓</span>

              <div>
                <strong>
                  Best Products
                </strong>

                <small>
                  Discover products you love
                </small>
              </div>
            </div>

            <div>
              <span>✓</span>

              <div>
                <strong>
                  Fast Delivery
                </strong>

                <small>
                  Quick delivery across India
                </small>
              </div>
            </div>

          </div>
        </div>

        {/* REGISTER CARD */}

        <div className="register-card">

          <div className="register-header">

            <div className="mini-logo">
              S
            </div>

            <h2>
              Create Account
            </h2>

            <p>
              Join SHOPVIA and start shopping
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-error">
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-success">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="input-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span>
                  👤
                </span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="input-group">

              <label>
                Phone Number
              </label>

              <div className="input-wrapper">

                <span>
                  📱
                </span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

              </div>

            </div>

            {/* TERMS */}

            <div className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions
                and Privacy Policy
              </span>

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-loader"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          {/* BACK TO LOGIN */}

          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={onLogin}
            >
              Back to Sign In
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;