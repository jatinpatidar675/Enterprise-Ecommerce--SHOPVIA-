
package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Cart;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // =========================
    // ADD PRODUCT TO CART
    // =========================

    public Cart addToCart(Cart cart) {

        Product product = productRepository.findById(cart.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (cart.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        // Check if product already exists in user's cart
        List<Cart> existingCartItems =
                cartRepository.findByUserId(cart.getUserId());

        for (Cart existingCart : existingCartItems) {

            if (existingCart.getProductId()
                    .equals(cart.getProductId())) {

                int totalQuantity =
                        existingCart.getQuantity()
                        + cart.getQuantity();

                if (totalQuantity > product.getQuantity()) {

                    throw new RuntimeException(
                            "Only " + product.getQuantity()
                            + " items available in stock"
                    );
                }

                existingCart.setQuantity(totalQuantity);

                // Always take latest price from Product
                existingCart.setPrice(product.getPrice());

                return cartRepository.save(existingCart);
            }
        }

        // New product in cart
        if (cart.getQuantity() > product.getQuantity()) {

            throw new RuntimeException(
                    "Only " + product.getQuantity()
                    + " items available in stock"
            );
        }

        // Always take price from Product database
        cart.setPrice(product.getPrice());

        return cartRepository.save(cart);
    }

    // =========================
    // GET USER CART
    // =========================

    public List<Cart> getCartByUser(Long userId) {

        return cartRepository.findByUserId(userId);
    }

    // =========================
    // UPDATE CART QUANTITY
    // =========================

    public Cart updateQuantity(Long id, int quantity) {

        Cart cart = cartRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found")
                );

        if (quantity <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        Product product = productRepository.findById(cart.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );

        if (quantity > product.getQuantity()) {

            throw new RuntimeException(
                    "Only " + product.getQuantity()
                    + " items available in stock"
            );
        }

        cart.setQuantity(quantity);

        // Update price from Product database
        cart.setPrice(product.getPrice());

        return cartRepository.save(cart);
    }

    // =========================
    // REMOVE FROM CART
    // =========================

    public void removeFromCart(Long id) {

        cartRepository.deleteById(id);
    }
}
