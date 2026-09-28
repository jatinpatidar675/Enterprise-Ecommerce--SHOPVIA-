import "./ProfilePage.css";

function ProfilePage({
user,
userId,
onBack,
onOrders,
onContinueShopping,
onLogout,
}) {

// =====================================================
// USER DATA
// =====================================================

const userName =
user?.name ||
user?.fullName ||
"Shopvia User";

const userEmail =
user?.email ||
"Email not available";

const userPhone =
user?.phone ||
"Phone not available";

const userRole =
user?.role ||
"USER";

const accountId =
user?.id ||
userId ||
"USER";

// =====================================================
// INITIALS
// =====================================================

const initials = userName
.split(" ")
.filter(Boolean)
.map((word) => word.charAt(0))
.join("")
.slice(0, 2)
.toUpperCase();

// =====================================================
// PROFILE PAGE
// =====================================================

return ( <div className="profile-page">

```
  {/* BACKGROUND */}

  <div className="profile-bg-glow profile-glow-one"></div>

  <div className="profile-bg-glow profile-glow-two"></div>

  {/* HEADER */}

  <header className="profile-header">

    <div className="profile-header-left">

      <button
        type="button"
        className="profile-back-btn"
        onClick={onBack}
      >
        ← Back
      </button>

      <div>

        <span className="profile-label">
          SHOPVIA ACCOUNT
        </span>

        <h1>
          My Profile
        </h1>

        <p>
          Manage your account information and preferences.
        </p>

      </div>

    </div>

    <button
      type="button"
      className="profile-shop-btn"
      onClick={onContinueShopping}
    >
      Continue Shopping →
    </button>

  </header>

  {/* MAIN */}

  <main className="profile-container">

    {/* PROFILE HERO */}

    <section className="profile-hero-card">

      <div className="profile-avatar">
        {initials}
      </div>

      <div className="profile-hero-info">

        <span className="profile-small-label">
          WELCOME BACK
        </span>

        <h2>
          {userName}
        </h2>

        <p>
          {userEmail}
        </p>

        <span className="profile-role">
          {userRole}
        </span>

      </div>

      <div className="profile-account-id">

        <span>
          ACCOUNT ID
        </span>

        <strong>
          #{accountId}
        </strong>

      </div>

    </section>

    {/* PERSONAL INFORMATION */}

    <section className="profile-card">

      <div className="profile-card-heading">

        <div className="profile-heading-icon">
          👤
        </div>

        <div>

          <span className="profile-small-label">
            PERSONAL INFORMATION
          </span>

          <h2>
            Account Details
          </h2>

        </div>

      </div>

      <div className="profile-info-grid">

        <div className="profile-info-box">

          <span>
            FULL NAME
          </span>

          <strong>
            {userName}
          </strong>

        </div>

        <div className="profile-info-box">

          <span>
            EMAIL ADDRESS
          </span>

          <strong>
            {userEmail}
          </strong>

        </div>

        <div className="profile-info-box">

          <span>
            PHONE NUMBER
          </span>

          <strong>
            {userPhone}
          </strong>

        </div>

        <div className="profile-info-box">

          <span>
            ACCOUNT ROLE
          </span>

          <strong>
            {userRole}
          </strong>

        </div>

      </div>

    </section>

    {/* ACCOUNT ACTIONS */}

    <section className="profile-card">

      <div className="profile-card-heading">

        <div className="profile-heading-icon">
          ⚙️
        </div>

        <div>

          <span className="profile-small-label">
            ACCOUNT
          </span>

          <h2>
            Account Actions
          </h2>

        </div>

      </div>

      <div className="profile-actions-grid">

        {/* ORDERS */}

        <button
          type="button"
          className="profile-action-card"
          onClick={onOrders}
        >

          <span className="profile-action-icon">
            📦
          </span>

          <div>

            <strong>
              My Orders
            </strong>

            <small>
              View and track your purchases
            </small>

          </div>

          <span className="profile-action-arrow">
            →
          </span>

        </button>

        {/* SHOPPING */}

        <button
          type="button"
          className="profile-action-card"
          onClick={onContinueShopping}
        >

          <span className="profile-action-icon">
            🛍️
          </span>

          <div>

            <strong>
              Continue Shopping
            </strong>

            <small>
              Explore our latest products
            </small>

          </div>

          <span className="profile-action-arrow">
            →
          </span>

        </button>

      </div>

    </section>

    {/* SECURITY */}

    <section className="profile-security">

      <div className="security-icon">
        🔒
      </div>

      <div>

        <strong>
          Your Account is Secure
        </strong>

        <p>
          Your account information is protected
          and securely managed by SHOPVIA.
        </p>

      </div>

    </section>

    {/* LOGOUT */}

    <div className="profile-logout-section">

      <button
        type="button"
        className="profile-logout-btn"
        onClick={() => {

          const confirmed = window.confirm(
            "Are you sure you want to logout?"
          );

          if (confirmed && onLogout) {
            onLogout();
          }

        }}
      >
        Logout
      </button>

    </div>

  </main>

  {/* FOOTER */}

  <footer className="profile-footer">

    <div className="profile-footer-brand">

      <div className="profile-logo">
        S
      </div>

      <div>

        <strong>
          SHOPVIA
        </strong>

        <small>
          SMART COMMERCE
        </small>

      </div>

    </div>

    <p>
      © 2026 SHOPVIA. Built for a smarter shopping experience.
    </p>

  </footer>

</div>


);
}

export default ProfilePage;
