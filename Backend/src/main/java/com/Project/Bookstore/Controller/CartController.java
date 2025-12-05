package com.Project.Bookstore.Controller;


import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public List<Cart> getAllCart() {
        return this.cartService.getAllCart();
    }
    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Integer id) {
        return this.cartService.getCartById(id);
    }
    @PostMapping
    public Cart addCart(@RequestBody Cart cart) {
        return this.cartService.saveCart(cart);
    }
    @PutMapping
    public Cart updateCart(@RequestBody Cart cart) {
        return this.cartService.saveCart(cart);
    }
}
