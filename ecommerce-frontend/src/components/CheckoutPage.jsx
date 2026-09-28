
import "./CheckoutPage.css";
import { useState } from "react";

function CheckoutPage({
  cartItems = [],
  products = [],
  onBackToCart,
  onOrderSuccess,
}) {
  // =====================================================
  // SAFE CART ARRAY
  // =====================================================

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // =====================================================
  // ADDRESS STATE
  // =====================================================

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // =====================================================
  // GET PRODUCT
  // =====================================================

  const getProductById = (productId) => {
    return products.find(
      (product) => Number(product.id) === Number(productId)
    );
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = safeCartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = safeCartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // =====================================================
  // DELIVERY
  // =====================================================

  const delivery = 0;

  // =====================================================
  // TOTAL
  // =====================================================

  const total = subtotal + delivery;

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error while user is typing
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // VALIDATE ADDRESS
  // =====================================================

  const validateAddress = () => {
    const newErrors = {};

    const fullName = address.fullName.trim();
    const phone = address.phone.trim();
    const addressText = address.address.trim();
    const city = address.city.trim();
    const pincode = address.pincode.trim();

    // Full Name
    if (!fullName) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.length < 3) {
      newErrors.fullName = "Please enter a valid full name.";
    }

    // Phone
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    // Address
    if (!addressText) {
      newErrors.address = "Delivery address is required.";
    } else if (addressText.length < 10) {
      newErrors.address =
        "Please enter a complete delivery address.";
    }

    // City
    if (!city) {
      newErrors.city = "City is required.";
    }

    // Pincode
    if (!pincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = () => {
    // First validate address
    const isValid = validateAddress();

    if (!isValid) {
      alert("Please fill all delivery details correctly.");
      return;
    }

    // Only after validation order will be placed
    const orderData = {
      id: Date.now(),
      totalAmount: total,
      paymentStatus: "Paid",
      status: "Confirmed",

      // Delivery information
      customerName: address.fullName.trim(),
      phone: address.phone.trim(),
      deliveryAddress: address.address.trim(),
      city: address.city.trim(),
      pincode: address.pincode.trim(),
    };

    console.log("Order placed:", orderData);

    if (onOrderSuccess) {
      onOrderSuccess(orderData);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (safeCartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Please add some products before proceeding
            to checkout.
          </p>

          <button
            type="button"
            className="checkout-back-btn"
            onClick={onBackToCart}
          >
            ← Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // CHECKOUT UI
  // =====================================================

  return (
    <div className="checkout-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="checkout-header">
        <div>
          <span className="checkout-label">
            SHOPVIA CHECKOUT
          </span>

          <h1>Complete Your Order</h1>

          <p>
            Review your order and confirm your purchase.
          </p>
        </div>

        <button
          type="button"
          className="checkout-back-top"
          onClick={onBackToCart}
        >
          ← Back to Cart
        </button>
      </div>

      {/* =================================================
          MAIN CHECKOUT
      ================================================= */}

      <div className="checkout-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="checkout-left">

          {/* DELIVERY ADDRESS */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                1
              </div>

              <div>
                <h2>Delivery Address</h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>

            </div>

            <div className="address-grid">

              {/* FULL NAME */}

              <div className="input-group">
                <label>
                  Full Name
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={
                    errors.fullName ? "input-error" : ""
                  }
                />

                {errors.fullName && (
                  <small className="field-error">
                    {errors.fullName}
                  </small>
                )}
              </div>

              {/* PHONE */}

              <div className="input-group">
                <label>
                  Phone Number
                  <span className="required">*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  className={
                    errors.phone ? "input-error" : ""
                  }
                />

                {errors.phone && (
                  <small className="field-error">
                    {errors.phone}
                  </small>
                )}
              </div>

              {/* ADDRESS */}

              <div className="input-group full-width">
                <label>
                  Address
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="address"
                  value={address.address}
                  onChange={handleInputChange}
                  placeholder="House No., Street, Area"
                  className={
                    errors.address ? "input-error" : ""
                  }
                />

                {errors.address && (
                  <small className="field-error">
                    {errors.address}
                  </small>
                )}
              </div>

              {/* CITY */}

              <div className="input-group">
                <label>
                  City
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={
                    errors.city ? "input-error" : ""
                  }
                />

                {errors.city && (
                  <small className="field-error">
                    {errors.city}
                  </small>
                )}
              </div>

              {/* PINCODE */}

              <div className="input-group">
                <label>
                  Pincode
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  className={
                    errors.pincode ? "input-error" : ""
                  }
                />

                {errors.pincode && (
                  <small className="field-error">
                    {errors.pincode}
                  </small>
                )}
              </div>

            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                2
              </div>

              <div>
                <h2>Payment Method</h2>

                <p>
                  Choose your preferred payment method.
                </p>
              </div>

            </div>

            <div className="payment-options">

              <label className="payment-option active">

                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                />

                <div className="payment-icon">
                  💳
                </div>

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <small>
                    UPI, Debit Card, Credit Card
                  </small>
                </div>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                />

                <div className="payment-icon">
                  💵
                </div>

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives
                  </small>
                </div>

              </label>

            </div>
          </div>

          {/* SECURITY */}

          <div className="checkout-security">

            <span>🔒</span>

            <div>
              <strong>
                Secure Checkout
              </strong>

              <p>
                Your personal and payment information
                is protected.
              </p>
            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE - ORDER SUMMARY
        ================================================= */}

        <div className="checkout-right">

          <div className="checkout-summary">

            <div className="summary-title">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Your Order
              </h2>

              <p>
                {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </p>

            </div>

            {/* ITEMS */}

            <div className="checkout-items">

              {safeCartItems.map((item) => {

                const product =
                  getProductById(item.productId);

                const itemTotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div className="checkout-item-image">

                      {product?.image ? (
                        <img
                          src={`http://localhost:8080/images/${product.image}`}
                          alt={
                            product.name || "Product"
                          }
                        />
                      ) : (
                        <span>
                          🛍️
                        </span>
                      )}

                    </div>

                    <div className="checkout-item-info">

                      <h3>
                        {product?.name ||
                          `Product #${item.productId}`}
                      </h3>

                      <p>
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹{formatPrice(itemTotal)}
                    </strong>

                  </div>
                );
              })}

            </div>

            {/* PRICE */}

            <div className="checkout-price-section">

              <div className="checkout-price-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="checkout-price-row">
                <span>Subtotal</span>

                <strong>
                  ₹{formatPrice(subtotal)}
                </strong>
              </div>

              <div className="checkout-price-row">
                <span>Delivery</span>

                <strong className="free">
                  FREE
                </strong>
              </div>

              <div className="checkout-divider"></div>

              <div className="checkout-total">
                <span>Total</span>

                <strong>
                  ₹{formatPrice(total)}
                </strong>
              </div>

            </div>

            {/* PLACE ORDER */}

            <button
              type="button"
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order · ₹{formatPrice(total)}
            </button>

            <p className="checkout-note">
              By placing your order, you agree to
              SHOPVIA's Terms & Conditions.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;

