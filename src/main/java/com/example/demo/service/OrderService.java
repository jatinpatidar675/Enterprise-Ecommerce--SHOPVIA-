
package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Cart;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // =========================
    // PLACE ORDER
    // =========================

    @Transactional
    public Order placeOrder(Long userId) {

        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;

        // =========================
        // CHECK STOCK & CALCULATE TOTAL
        // =========================

        for (Cart cart : cartItems) {

            Product product = productRepository.findById(cart.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            if (cart.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid cart quantity for product "
                        + product.getName()
                );
            }

            if (cart.getQuantity() > product.getQuantity()) {

                throw new RuntimeException(
                        "Only " + product.getQuantity()
                        + " items available for product "
                        + product.getName()
                );
            }

            totalAmount += product.getPrice() * cart.getQuantity();
        }

        // =========================
        // CREATE ORDER
        // =========================

        Order order = new Order();

        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // =========================
        // CREATE ORDER ITEMS
        // REDUCE PRODUCT STOCK
        // =========================

        for (Cart cart : cartItems) {

            Product product = productRepository.findById(cart.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            // Create OrderItem
            OrderItem orderItem = new OrderItem();

            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(product.getPrice());

            orderItemRepository.save(orderItem);

            // Reduce product stock
            product.setQuantity(
                    product.getQuantity() - cart.getQuantity()
            );

            productRepository.save(product);
        }

        // =========================
        // CLEAR CART
        // =========================

        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    // =========================
    // GET USER ORDERS
    // =========================

    public List<Order> getOrdersByUser(Long userId) {

        return orderRepository.findByUserId(userId);
    }

    // =========================
    // GET ORDER BY ID
    // =========================

    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));
    }

    // =========================
    // GET ORDER ITEMS
    // =========================

    public List<OrderItem> getOrderItems(Long orderId) {

        return orderItemRepository.findByOrderId(orderId);
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    @Transactional
    public Order updateOrderStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // =========================
        // REFUND ORDER
        // =========================

        if ("REFUNDED".equalsIgnoreCase(status)
                && !"REFUNDED".equalsIgnoreCase(order.getStatus())) {

            List<OrderItem> items =
                    orderItemRepository.findByOrderId(id);

            for (OrderItem item : items) {

                Product product = productRepository
                        .findById(item.getProductId())
                        .orElseThrow(() ->
                                new RuntimeException("Product not found"));

                // Restore product stock
                product.setQuantity(
                        product.getQuantity() + item.getQuantity()
                );

                productRepository.save(product);
            }
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // =========================
    // DELETE ORDER
    // =========================

    @Transactional
    public void deleteOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        List<OrderItem> items =
                orderItemRepository.findByOrderId(id);

        orderItemRepository.deleteAll(items);

        orderRepository.delete(order);
    }
}

