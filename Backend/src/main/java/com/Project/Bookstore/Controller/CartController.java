package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for cart operations.
 * 
 * Endpoints:
 * - GET  /api/carts/{userId}         : Get cart items for a user
 * - POST /api/carts/{userId}/items   : Add item to cart
 * - PUT  /api/carts/{userId}/items/{bookId} : Update item quantity
 * - DELETE /api/carts/{userId}/items/{bookId} : Remove item from cart
 * - DELETE /api/carts/{userId}/clear : Clear all items from cart
 */
@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Get all cart items for a user.
     * GET /api/carts/{userId}
     */
    @GetMapping("/{userId}")
    public List<CartItem> getCartItemsByUserId(@PathVariable Integer userId) {
        return cartService.getCartItemsByUserId(userId);
    }

    /**
     * Get the cart object for a user.
     * GET /api/carts/{userId}/cart
     */
    @GetMapping("/{userId}/cart")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Integer userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cart);
    }

    /**
     * Add item to cart.
     * POST /api/carts/{userId}/items
     * 
     * Body: { "bookId": 1, "quantity": 2 }
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable Integer userId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer bookId = body.get("bookId");
        Integer quantity = body.getOrDefault("quantity", 1);
        
        if (bookId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        CartItem item = cartService.addToCart(userId, bookId, quantity);
        if (item == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(item);
    }

    /**
     * Update item quantity in cart.
     * PUT /api/carts/{userId}/items/{bookId}
     * 
     * Body: { "quantity": 3 }
     */
    @PutMapping("/{userId}/items/{bookId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer bookId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer quantity = body.get("quantity");
        if (quantity == null) {
            return ResponseEntity.badRequest().build();
        }
        
        CartItem item = cartService.updateCartItemQuantity(userId, bookId, quantity);
        if (item == null && quantity > 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    /**
     * Remove item from cart.
     * DELETE /api/carts/{userId}/items/{bookId}
     */
    @DeleteMapping("/{userId}/items/{bookId}")
    public ResponseEntity<Map<String, String>> removeFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer bookId
    ) {
        boolean removed = cartService.removeFromCart(userId, bookId);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    /**
     * Clear all items from cart.
     * DELETE /api/carts/{userId}/clear
     */
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable Integer userId) {
        boolean cleared = cartService.clearCart(userId);
        if (!cleared) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
