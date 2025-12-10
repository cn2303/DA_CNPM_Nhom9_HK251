package com.Project.Bookstore.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Service.CartService;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
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
