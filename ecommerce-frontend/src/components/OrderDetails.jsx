
import "./OrderDetails.css";

function OrderDetails({
  order = {},
  formatPrice,
  onBack,
  onContinueShopping,
}) {
  const price = (value) => {
    if (formatPrice) {
      return formatPrice(value);
    }

    return Number(value || 0).toLocaleString("en-IN");
  };

  const orderId =
    order.id ||
    order.orderId ||
    "ORD-001";

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

  const items =
    Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.products)
      ? order.products
      : [];

  const getItemName = (item) =>
    item.name ||
    item.productName ||
    item.title ||
    "Product";

  const getItemPrice = (item) =>
    item.price ??
    item.productPrice ??
    0;

  const getItemQuantity = (item) =>
    item.quantity ??
    1;

  return (
    <div className="order-details-page">

      {/* BACKGROUND */}
      <div className="details-bg-glow details-glow-one"></div>
      <div className="details-bg-glow details-glow-two"></div>

      {/* HEADER */}
      <header className="details-header">

        <button
          type="button"
          className="details-back-btn"
          onClick={onBack}
        >
          ← Back to Orders
        </button>

        <div className="details-header-title">
          <span>SHOPVIA ACCOUNT</span>

          <h1>Order Details</h1>

          <p>
            Complete information about your purchase.
          </p>
        </div>

        <button
          type="button"
          className="details-shop-btn"
          onClick={onContinueShopping}
        >
          Continue Shopping →
        </button>

      </header>

      {/* MAIN */}
      <main className="details-container">

        {/* ORDER TITLE CARD */}
        <section className="details-title-card">

          <div>
            <span className="details-label">
              ORDER
            </span>

            <h2>
              #{orderId}
            </h2>

            <p>
              {orderDate
                ? new Date(orderDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Recently placed"}
            </p>
          </div>

          <span
            className={`details-status ${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            ✓ {status}
          </span>

        </section>

        {/* STATUS TRACKER */}
        <section className="delivery-card">

          <div className="delivery-card-header">
            <div>
              <span className="details-label">
                DELIVERY
              </span>

              <h2>
                Order Progress
              </h2>
            </div>

            <span className="delivery-truck">
              🚚
            </span>
          </div>

          <div className="delivery-progress">

            <div className="progress-step completed">
              <div className="progress-icon">
                ✓
              </div>

              <div>
                <strong>Order Confirmed</strong>
                <small>
                  Your order has been confirmed.
                </small>
              </div>
            </div>

            <div className="progress-line active"></div>

            <div className="progress-step completed">
              <div className="progress-icon">
                ✓
              </div>

              <div>
                <strong>Processing</strong>
                <small>
                  Your order is being prepared.
                </small>
              </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
              <div className="progress-icon">
                3
              </div>

              <div>
                <strong>Shipped</strong>
                <small>
                  Package will be shipped soon.
                </small>
              </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
              <div className="progress-icon">
                4
              </div>

              <div>
                <strong>Delivered</strong>
                <small>
                  Estimated delivery soon.
                </small>
              </div>
            </div>

          </div>

        </section>

        {/* ORDER INFORMATION */}
        <section className="details-info-grid">

          <div className="details-info-card">
            <span>ORDER DATE</span>

            <strong>
              {orderDate
                ? new Date(orderDate).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Recently"}
            </strong>
          </div>

          <div className="details-info-card">
            <span>PAYMENT STATUS</span>

            <strong className="payment-green">
              ✓ {paymentStatus}
            </strong>
          </div>

          <div className="details-info-card">
            <span>ORDER TOTAL</span>

            <strong>
              ₹{price(amount)}
            </strong>
          </div>

        </section>

        {/* PRODUCTS */}
        <section className="products-details-card">

          <div className="details-section-heading">
            <div>
              <span className="details-label">
                PURCHASE
              </span>

              <h2>
                Ordered Items
              </h2>
            </div>

            <span className="items-count">
              {items.length} Item
              {items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {items.length > 0 ? (
            <div className="ordered-items">

              {items.map((item, index) => {

                const itemName =
                  getItemName(item);

                const itemPrice =
                  getItemPrice(item);

                const quantity =
                  getItemQuantity(item);

                const itemImage =
                  item.image ||
                  item.productImage ||
                  null;

                return (
                  <div
                    className="ordered-item"
                    key={
                      item.id ||
                      item.productId ||
                      index
                    }
                  >

                    <div className="ordered-item-image">

                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}

                    </div>

                    <div className="ordered-item-info">

                      <span>
                        PRODUCT
                      </span>

                      <h3>
                        {itemName}
                      </h3>

                      <p>
                        Quantity: {quantity}
                      </p>

                    </div>

                    <div className="ordered-item-price">

                      <strong>
                        ₹{price(
                          itemPrice * quantity
                        )}
                      </strong>

                      <small>
                        ₹{price(itemPrice)} × {quantity}
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="no-items">
              <span>📦</span>

              <p>
                Product details are not available
                for this order.
              </p>
            </div>
          )}

        </section>

        {/* BOTTOM GRID */}
        <div className="details-bottom-grid">

          {/* PAYMENT */}
          <section className="details-white-card">

            <div className="white-card-icon">
              💳
            </div>

            <div>
              <span>PAYMENT INFORMATION</span>

              <h3>
                Payment Successful
              </h3>

              <p>
                Payment status:{" "}
                <strong>
                  {paymentStatus}
                </strong>
              </p>
            </div>

          </section>

          {/* DELIVERY */}
          <section className="details-white-card">

            <div className="white-card-icon">
              📍
            </div>

            <div>
              <span>DELIVERY INFORMATION</span>

              <h3>
                Standard Delivery
              </h3>

              <p>
                Your order will be delivered
                to your registered address.
              </p>
            </div>

          </section>

        </div>

        {/* SUMMARY */}
        <section className="details-summary">

          <div className="summary-heading">
            <span className="details-label">
              BILLING
            </span>

            <h2>
              Order Summary
            </h2>
          </div>

          <div className="details-summary-row">
            <span>Items Total</span>

            <strong>
              ₹{price(amount)}
            </strong>
          </div>

          <div className="details-summary-row">
            <span>Delivery</span>

            <strong className="free-text">
              FREE
            </strong>
          </div>

          <div className="details-summary-divider"></div>

          <div className="details-total-row">
            <span>Total Amount</span>

            <strong>
              ₹{price(amount)}
            </strong>
          </div>

        </section>

        {/* ACTIONS */}
        <div className="details-actions">

          <button
            type="button"
            className="details-primary-btn"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>

          <button
            type="button"
            className="details-secondary-btn"
            onClick={onBack}
          >
            ← Back to Orders
          </button>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="details-footer">

        <div className="details-footer-brand">

          <div className="details-logo">
            S
          </div>

          <div>
            <strong>SHOPVIA</strong>

            <small>
              SMART COMMERCE
            </small>
          </div>

        </div>

        <p>
          © 2026 SHOPVIA. Built for a smarter
          shopping experience.
        </p>

      </footer>

    </div>
  );
}

export default OrderDetails;

