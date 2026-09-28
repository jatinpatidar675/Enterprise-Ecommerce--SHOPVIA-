import { useEffect, useState } from "react";
import API from "../api";
import "./CartPage.css";

function CartPage({ onClose, onCartUpdate }) {
  const USER_ID = 4;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // LOAD CART
  // =========================

  const loadCart = async () => {
    try {
      setError("");

      const response = await API.get(`/cart/${USER_ID}`);

      console.log("Cart from backend:", response.data);

      setCart(response.data);

      if (onCartUpdate) {
        onCartUpdate(response.data.length);
      }
    } catch (err) {
      console.error("Cart API Error:", err);

      if (err.response) {
        console.error("Backend response:", err.response.data);
        console.error("Status:", err.response.status);
      }

      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL CART LOAD
  // =========================

  useEffect(() => {
    let cancelled = false;

    const fetchInitialCart = async () => {
      try {
        const response = await API.get(`/cart/${USER_ID}`);

        if (cancelled) {
          return;
        }

        console.log("Cart from backend:", response.data);

        setCart(response.data);

        if (onCartUpdate) {
          onCartUpdate(response.data.length);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("Cart API Error:", err);

        if (err.response) {
          console.error(
            "Backend response:",
            err.response.data
          );

          console.error(
            "Status:",
            err.response.status
          );
        }

        setError("Unable to load your cart.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialCart();

    return () => {
      cancelled = true;
    };

    // onCartUpdate intentionally excluded because
    // parent creates this callback during render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (cartItem, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(cartItem.id);
      return;
    }

    try {
      setUpdatingId(cartItem.id);

      console.log(
        "Updating quantity:",
        cartItem.id,
        newQuantity
      );

      const response = await API.put(
        `/cart/${cartItem.id}?quantity=${newQuantity}`
      );

      console.log(
        "Quantity updated:",
        response.data
      );

      await loadCart();
    } catch (err) {
      console.error(
        "Quantity Update Error:",
        err
      );

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );

        console.error(
          "Status:",
          err.response.status
        );

        alert(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to update quantity."
        );
      } else {
        alert("Unable to update quantity.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = async (cartId) => {
    try {
      setUpdatingId(cartId);

      console.log(
        "Removing cart item:",
        cartId
      );

      const response = await API.delete(
        `/cart/${cartId}`
      );

      console.log(
        "Remove response:",
        response.data
      );

      await loadCart();
    } catch (err) {
      console.error(
        "Remove Cart Error:",
        err
      );

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );

        console.error(
          "Status:",
          err.response.status
        );
      }

      alert(
        "Unable to remove product from cart."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN");
  };

  // =========================
  // TOTAL ITEMS
  // =========================

  const totalItems = cart.reduce(
    (total, item) => {
      return total + Number(item.quantity);
    },
    0
  );

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = cart.reduce(
    (total, item) => {
      return (
        total +
        Number(item.price) *
          Number(item.quantity)
      );
    },
    0
  );

  // =========================
  // DELIVERY
  // =========================

  const delivery =
    subtotal >= 999 || subtotal === 0
      ? 0
      : 49;

  // =========================
  // GRAND TOTAL
  // =========================

  const grandTotal =
    subtotal + delivery;

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="cart-page">

        <div className="cart-loading">

          <div className="cart-loader"></div>

          <h3>
            Loading your cart...
          </h3>

          <p>
            Please wait while we fetch your
            products.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // ERROR SCREEN
  // =========================

  if (error) {
    return (
      <div className="cart-page">

        <div className="cart-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load cart
          </h2>

          <p>
            {error}
          </p>

          <button
            className="cart-primary-btn"
            onClick={() => {
              setLoading(true);
              loadCart();
            }}
          >
            Try Again
          </button>

          <button
            className="cart-back-btn"
            onClick={onClose}
          >
            ← Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-empty">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <button
            className="cart-primary-btn"
            onClick={onClose}
          >
            ← Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // MAIN CART PAGE
  // =========================

  return (
    <div className="cart-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="cart-header">

        <div>

          <span className="cart-label">
            SHOPVIA CART
          </span>

          <h1>
            Your Cart
          </h1>

          <p>
            Review your selected products
            before checkout
          </p>

        </div>

        <button
          className="close-cart"
          onClick={onClose}
        >
          ✕ Close
        </button>

      </div>

      {/* =========================
          CART LAYOUT
      ========================= */}

      <div className="cart-layout">

        {/* =========================
            PRODUCTS SECTION
        ========================= */}

        <div className="cart-products">

          {/* TABLE HEADER */}

          <div className="cart-products-header">

            <span>
              PRODUCT
            </span>

            <span>
              QUANTITY
            </span>

            <span>
              TOTAL
            </span>

          </div>

          {/* CART ITEMS */}

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              {/* =====================
                  PRODUCT INFORMATION
              ====================== */}

              <div className="cart-product-info">

                <div className="cart-product-image">

                  <span>
                    🛍️
                  </span>

                </div>

                <div className="cart-product-details">

                  <span>
                    PRODUCT
                  </span>

                  <h3>
                    {item.name ||
                      `Product #${item.productId}`}
                  </h3>

                  <p>
                    ₹
                    {formatPrice(item.price)}
                    {" "}per item
                  </p>

                  <button
                    className="remove-btn"
                    disabled={
                      updatingId === item.id
                    }
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    {updatingId === item.id
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>

              </div>

              {/* =====================
                  QUANTITY
              ====================== */}

              <div className="quantity-control">

                <button
                  disabled={
                    updatingId === item.id
                  }
                  onClick={() =>
                    updateQuantity(
                      item,
                      Number(item.quantity) - 1
                    )
                  }
                >
                  −
                </button>

                <span>
                  {updatingId === item.id
                    ? "..."
                    : item.quantity}
                </span>

                <button
                  disabled={
                    updatingId === item.id
                  }
                  onClick={() =>
                    updateQuantity(
                      item,
                      Number(item.quantity) + 1
                    )
                  }
                >
                  +
                </button>

              </div>

              {/* =====================
                  ITEM TOTAL
              ====================== */}

              <div className="cart-item-total">

                <strong>
                  ₹
                  {formatPrice(
                    Number(item.price) *
                      Number(item.quantity)
                  )}
                </strong>

              </div>

            </div>

          ))}

          {/* =========================
              CONTINUE SHOPPING
          ========================= */}

          <button
            className="continue-shopping"
            onClick={onClose}
          >
            ← Continue Shopping
          </button>

        </div>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="order-summary">

          <div className="summary-title">

            <span>
              ORDER SUMMARY
            </span>

            <h2>
              Order Summary
            </h2>

          </div>

          {/* ITEMS */}

          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              {totalItems}
            </strong>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {formatPrice(subtotal)}
            </strong>

          </div>

          {/* DELIVERY */}

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong className="free">

              {delivery === 0
                ? "FREE"
                : `₹${formatPrice(
                    delivery
                  )}`}

            </strong>

          </div>

          {/* DIVIDER */}

          <div className="summary-divider"></div>

          {/* TOTAL */}

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {formatPrice(grandTotal)}
            </strong>

          </div>

          {/* CHECKOUT */}

          <button
            className="checkout-btn"
            onClick={() =>
              alert(
                "Checkout page will be added next."
              )
            }
          >
            Proceed to Checkout →
          </button>

          {/* SECURITY */}

          <div className="secure-checkout">

            🔐 Secure Checkout

            <span>
              Your payment information is
              protected
            </span>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default CartPage;