import "./OrdersPage.css";
import { useEffect, useState } from "react";
import API from "../api";

function OrdersPage({ userId = 4, onBack }) {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// ================================
// FORMAT PRICE
// ================================
const formatPrice = (price) => {
return Number(price || 0).toLocaleString("en-IN");
};

// ================================
// FORMAT DATE
// ================================
const formatDate = (date) => {
if (!date) {
return "Date unavailable";
}


return new Date(date).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


};

// ================================
// FETCH ORDERS
// ================================
const fetchOrders = async () => {
try {
setLoading(true);
setError("");

  const response = await API.get(`/orders/user/${userId}`);

  console.log("Orders from backend:", response.data);

  if (Array.isArray(response.data)) {
    setOrders(response.data);
  } else {
    setOrders([]);
  }
} catch (err) {
  console.error("Orders API Error:", err);

  setOrders([]);

  setError(
    "Unable to load your orders. Please make sure Spring Boot is running."
  );
} finally {
  setLoading(false);
}


};

// ================================
// LOAD ORDERS
// ================================
useEffect(() => {
let cancelled = false;


const loadOrders = async () => {
  try {
    const response = await API.get(`/orders/user/${userId}`);

    if (cancelled) {
      return;
    }

    console.log("Orders from backend:", response.data);

    if (Array.isArray(response.data)) {
      setOrders(response.data);
    } else {
      setOrders([]);
    }

    setError("");
  } catch (err) {
    if (cancelled) {
      return;
    }

    console.error("Orders API Error:", err);

    setOrders([]);

    setError(
      "Unable to load your orders. Please make sure Spring Boot is running."
    );
  } finally {
    if (!cancelled) {
      setLoading(false);
    }
  }
};

loadOrders();

return () => {
  cancelled = true;
};


}, [userId]);

// ================================
// STATUS CLASS
// ================================
const getStatusClass = (status) => {
if (!status) {
return "status-default";
}


return `status-${status.toLowerCase()}`;


};

// ================================
// LOADING
// ================================
if (loading) {
return ( <div className="orders-page"> <div className="orders-loading"> <div className="orders-loader"></div>


      <h2>Loading Your Orders...</h2>

      <p>
        Please wait while we fetch your order history.
      </p>
    </div>
  </div>
);


}

// ================================
// MAIN PAGE
// ================================
return ( <div className="orders-page">


  {/* ================================
      HEADER
  ================================= */}

  <div className="orders-header">

    <div>
      <span className="orders-label">
        SHOPVIA ACCOUNT
      </span>

      <h1>
        My Orders
      </h1>

      <p>
        Track and manage all your SHOPVIA orders.
      </p>
    </div>

    <button
      type="button"
      className="orders-back-btn"
      onClick={onBack}
    >
      ← Continue Shopping
    </button>

  </div>

  {/* ================================
      ERROR
  ================================= */}

  {error && (
    <div className="orders-error">

      <div className="orders-error-icon">
        ⚠️
      </div>

      <div>
        <h3>
          Unable to load orders
        </h3>

        <p>
          {error}
        </p>
      </div>

      <button
        type="button"
        onClick={fetchOrders}
      >
        Try Again
      </button>

    </div>
  )}

  {/* ================================
      EMPTY ORDERS
  ================================= */}

  {!error && orders.length === 0 && (
    <div className="orders-empty">

      <div className="orders-empty-icon">
        📦
      </div>

      <h2>
        No Orders Yet
      </h2>

      <p>
        You haven't placed any orders yet.
        Start shopping and your orders will appear here.
      </p>

      <button
        type="button"
        className="orders-shop-btn"
        onClick={onBack}
      >
        Start Shopping →
      </button>

    </div>
  )}

  {/* ================================
      ORDERS
  ================================= */}

  {!error && orders.length > 0 && (
    <div className="orders-container">

      {/* SUMMARY */}

      <div className="orders-summary-card">

        <div className="summary-icon">
          📦
        </div>

        <div>
          <span>
            TOTAL ORDERS
          </span>

          <strong>
            {orders.length}
          </strong>
        </div>

      </div>

      {/* ORDER LIST */}

      <div className="orders-list">

        {orders.map((order) => (

          <div
            className="order-card"
            key={order.id}
          >

            {/* ORDER TOP */}

            <div className="order-card-top">

              <div className="order-info">

                <span>
                  ORDER ID
                </span>

                <h2>
                  #{order.id}
                </h2>

              </div>

              <div
                className={`order-status ${getStatusClass(
                  order.status
                )}`}
              >

                <span className="status-dot"></span>

                {order.status || "PLACED"}

              </div>

            </div>

            {/* ORDER BODY */}

            <div className="order-card-body">

              <div className="order-detail">

                <span>
                  📅 Order Date
                </span>

                <strong>
                  {formatDate(order.orderDate)}
                </strong>

              </div>

              <div className="order-detail">

                <span>
                  💰 Total Amount
                </span>

                <strong className="order-price">
                  ₹{formatPrice(order.totalAmount)}
                </strong>

              </div>

              <div className="order-detail">

                <span>
                  🚚 Delivery
                </span>

                <strong className="delivery-text">
                  Standard Delivery
                </strong>

              </div>

            </div>

            {/* ORDER FOOTER */}

            <div className="order-card-footer">

              <span>
                ✓ Order successfully placed
              </span>

              <button
                type="button"
                onClick={() =>
                  alert(
                    `Order #${order.id}\n\nStatus: ${
                      order.status
                    }\nTotal: ₹${formatPrice(
                      order.totalAmount
                    )}`
                  )
                }
              >
                View Order →
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )}

</div>


);
}

export default OrdersPage;
