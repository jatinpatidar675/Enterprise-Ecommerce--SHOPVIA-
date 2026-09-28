
import "./MyOrders.css";

function MyOrders({
  orders = [],
  formatPrice,
  onBack,
  onContinueShopping,
  onViewOrder,
}) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  const price = (value) => {
    if (formatPrice) {
      return formatPrice(value);
    }

    return Number(value || 0).toLocaleString("en-IN");
  };

  return (
    <div className="my-orders-page">

      {/* BACKGROUND DECORATION */}
      <div className="orders-bg-glow glow-one"></div>
      <div className="orders-bg-glow glow-two"></div>

      {/* HEADER */}
      <header className="orders-header">

        <div className="orders-header-left">

          <button
            type="button"
            className="orders-back-btn"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <span className="orders-label">
              SHOPVIA ACCOUNT
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              Track and manage your recent purchases.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="orders-shop-btn"
          onClick={onContinueShopping}
        >
          Continue Shopping →
        </button>

      </header>

      {/* ORDER CONTENT */}
      <main className="orders-container">

        {/* ORDER COUNT */}
        <div className="orders-top-card">

          <div>
            <span className="orders-small-label">
              ORDER HISTORY
            </span>

            <h2>
              Your Purchases
            </h2>

            <p>
              {safeOrders.length} order
              {safeOrders.length !== 1 ? "s" : ""} placed
            </p>
          </div>

          <div className="orders-count">
            <strong>
              {safeOrders.length}
            </strong>

            <span>
              Orders
            </span>
          </div>

        </div>

        {/* EMPTY ORDERS */}
        {safeOrders.length === 0 && (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <button
              type="button"
              className="empty-shop-btn"
              onClick={onContinueShopping}
            >
              Start Shopping →
            </button>

          </div>
        )}

        {/* ORDERS */}
        {safeOrders.length > 0 && (
          <div className="orders-list">

            {safeOrders.map((order, index) => {

              const orderId =
                order.id ||
                order.orderId ||
                `ORD-${index + 1}`;

              const amount =
                order.totalAmount ??
                order.total ??
                order.amount ??
                0;

              const status =
                order.status ||
                "Confirmed";

              const paymentStatus =
                order.paymentStatus ||
                "Paid";

              const orderDate =
                order.createdAt ||
                order.orderDate ||
                order.date ||
                null;

              return (
                <div
                  className="order-card"
                  key={orderId}
                >

                  {/* ORDER HEADER */}
                  <div className="order-card-header">

                    <div>
                      <span className="order-number-label">
                        ORDER
                      </span>

                      <h3>
                        #{orderId}
                      </h3>
                    </div>

                    <span
                      className={`order-status ${
                        status
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      }`}
                    >
                      ✓ {status}
                    </span>

                  </div>

                  {/* ORDER INFORMATION */}
                  <div className="order-info-grid">

                    <div className="order-info-box">

                      <span>
                        ORDER DATE
                      </span>

                      <strong>
                        {orderDate
                          ? new Date(
                              orderDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Recently"}
                      </strong>

                    </div>

                    <div className="order-info-box">

                      <span>
                        PAYMENT
                      </span>

                      <strong className="payment-success">
                        ✓ {paymentStatus}
                      </strong>

                    </div>

                    <div className="order-info-box">

                      <span>
                        TOTAL AMOUNT
                      </span>

                      <strong>
                        ₹{price(amount)}
                      </strong>

                    </div>

                  </div>

                  {/* ORDER FOOTER */}
                  <div className="order-card-footer">

                    <div className="order-delivery">

                      <span className="delivery-icon">
                        🚚
                      </span>

                      <div>

                        <strong>
                          Delivery Status
                        </strong>

                        <small>
                          Your order is being processed.
                        </small>

                      </div>

                    </div>

                    {/* VIEW DETAILS */}
                    <button
                      type="button"
                      className="view-order-btn"
                      onClick={() => {
                        if (onViewOrder) {
                          onViewOrder(order);
                        }
                      }}
                    >
                      View Details →
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="orders-footer">

        <div className="orders-footer-brand">

          <div className="orders-logo">
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

export default MyOrders;

