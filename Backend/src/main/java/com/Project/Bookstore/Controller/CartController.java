package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCartItemsByUserId(@PathVariable Integer userId) {
        return cartService.getCartItemsByUserId(userId);
    }
}
