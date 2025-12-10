package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.*;
import com.Project.Bookstore.Repository.BookRepository;
import com.Project.Bookstore.Repository.CartRepository;
import com.Project.Bookstore.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    @Autowired
    public CartService(CartRepository cartRepository,  BookRepository bookRepository,  UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }
    public List<Cart> getAllCart() {
        return this.cartRepository.findAll();
    }
    public Cart getCartById(Integer id) {
        return this.cartRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Cart not found"));
    }

    public Cart saveCart(Cart cart) {
        User user = this.userRepository.findById(cart.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cart.setUser(user);
        return this.cartRepository.save(cart);
    }


    @Transactional
    public Cart updateCart(Cart inputCart) {

        Cart existingCart = cartRepository.findById(inputCart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        existingCart.getCartItems().clear();

        if (inputCart.getCartItems() != null) {
            for (CartItem inputItem : inputCart.getCartItems()) {

                CartItem newItem = new CartItem();
                //set quantity
                newItem.setQuantity(inputItem.getQuantity());
                //set book
                Book realBook = bookRepository.findById(inputItem.getBook().getId())
                        .orElseThrow(() -> new RuntimeException("Book not found"));
                newItem.setBook(realBook);
                //set cart
                newItem.setCart(existingCart);
                //set id
                newItem.setId(new CartItemId(existingCart.getId(), realBook.getId()));

                existingCart.getCartItems().add(newItem);
            }
        }
        return cartRepository.save(existingCart);
    }

    public void deleteCartById(Integer id) {
        if(!this.cartRepository.existsById(id)) {
            throw new RuntimeException("Cart not found");
        }
        this.cartRepository.deleteById(id);
    }
    @Transactional
    public Cart addToCart(Integer cartId, Integer bookId) {
        Cart updatedCart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        Book book = this.bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        for(CartItem inputItem : updatedCart.getCartItems()) {
            if(inputItem.getBook().getId().equals(book.getId())) {
                inputItem.setQuantity(inputItem.getQuantity() + 1);
                return this.cartRepository.save(updatedCart);
            }
        }
        CartItem cartItem = new CartItem();
        cartItem.setQuantity(1);
        cartItem.setBook(book);
        cartItem.setCart(updatedCart);
        cartItem.setId(new CartItemId(updatedCart.getId(), book.getId()));
        updatedCart.getCartItems().add(cartItem);
        return cartRepository.save(updatedCart);
    }
}
