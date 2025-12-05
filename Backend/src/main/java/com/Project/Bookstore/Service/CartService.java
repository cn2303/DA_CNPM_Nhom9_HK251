package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Model.OrderItem;
import com.Project.Bookstore.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    @Autowired
    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }
    public List<Cart> getAllCart() {
        return this.cartRepository.findAll();
    }
    public Cart getCartById(Integer id) {
        return this.cartRepository.findById(id).orElse(null);
    }
    public Cart saveCart(Cart cart) {
        return this.cartRepository.save(cart);
    }
    public void deleteCartById(Integer id) {
        this.cartRepository.deleteById(id);
    }
    public List<CartItem> getItemList(Integer id) {
        return this.getCartById(id).getCartItems();
    }
}
