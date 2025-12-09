package com.Project.Bookstore.Controller;


import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Cart> getAllCart() {
        return this.cartService.getAllCart();
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getCartById(@PathVariable Integer id) {
        try{
            Cart cart = this.cartService.getCartById(id);
            return ResponseEntity.ok(cart);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    //Ko su dung ham nay
    @PostMapping
    public ResponseEntity<?> addCart(@RequestBody Cart cart) {
        try{
            Cart savedCart = this.cartService.saveCart(cart);
            return ResponseEntity.ok(savedCart);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping
    public ResponseEntity<?> updateCart(@RequestBody Cart cart) {
        try{
            Cart updatedCart = this.cartService.updateCart(cart);
            return ResponseEntity.ok(updatedCart);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable Integer id) {
        try {
            this.cartService.deleteCartById(id);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/{cartId}/book/{bookId}")
    public ResponseEntity<?> addToCart(@PathVariable Integer cartId, @PathVariable Integer bookId) {
        try{
            Cart updatedCart = this.cartService.addToCart(cartId, bookId);
            return ResponseEntity.ok(updatedCart);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
