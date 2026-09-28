
import "./OrderSuccessPage.css";

function OrderSuccessPage({ order, onContinueShopping }) {
  return (
    <div className="success-page">
      <div className="success-card">

        {/* SUCCESS ICON */}
        <div className="success-icon">
          ✓
        </div>

        {/* TITLE */}
        <div className="success-content">
          <span className="success-label">
            ORDER CONFIRMED
          </span>

          <h1>
            Order Placed Successfully!
          </h1>

          <p>
            Thank you for shopping with SHOPVIA.
            Your order has been successfully placed.
          </p>
        </div>

        {/* ORDER DETAILS */}
        <div className="success-details">

          <div className="success-detail-item">
            <span>Order ID</span>
            <strong>
              {order?.id ? `#${order.id}` : "#SHOPVIA"}
            </strong>
          </div>

          <div className="success-detail-item">
            <span>Payment Status</span>
            <strong className="paid">
              {order?.paymentStatus || "Paid"}
            </strong>
          </div>

          <div className="success-detail-item">
            <span>Order Status</span>
            <strong className="confirmed">
              {order?.status || "Confirmed"}
            </strong>
          </div>

          {order?.totalAmount !== undefined && (
            <div className="success-detail-item">
              <span>Total Amount</span>
              <strong>
                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </strong>
            </div>
          )}

        </div>

        {/* MESSAGE */}
        <div className="delivery-message">
          <div className="delivery-icon">
            🚚
          </div>

          <div>
            <strong>
              Your order is on its way!
            </strong>

            <p>
              You will receive your order details shortly.
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          className="success-btn"
          onClick={onContinueShopping}
        >
          Continue Shopping →
        </button>

        <p className="success-footer">
          © 2026 SHOPVIA · Smart Commerce
        </p>

      </div>
    </div>
  );
}

export default OrderSuccessPage;
