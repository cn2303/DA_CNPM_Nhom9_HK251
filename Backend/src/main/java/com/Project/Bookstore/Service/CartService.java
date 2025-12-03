package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Repository.CartRepository;
import com.Project.Bookstore.Repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public Cart getCartByUserId(Integer userId) {
        return cartRepository.findByUser_UserId(userId).orElse(null);
    }

    public List<CartItem> getCartItemsByUserId(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
        if (cartOpt.isPresent()) {
            return cartItemRepository.findByCart(cartOpt.get());
        }
        return new ArrayList<>();
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart getCartById(Integer id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart saveCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public void deleteCartById(Integer id) {
        cartRepository.deleteById(id);
    }
}
