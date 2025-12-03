package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Book;
import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Model.CartItemId;
import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Repository.BookRepository;
import com.Project.Bookstore.Repository.CartRepository;
import com.Project.Bookstore.Repository.CartItemRepository;
import com.Project.Bookstore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, 
                       CartItemRepository cartItemRepository,
                       BookRepository bookRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
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

    /**
     * Get or create a cart for a user.
     */
    @Transactional
    public Cart getOrCreateCart(Integer userId) {
        Optional<Cart> cartOpt = cartRepository.findByUser_UserId(userId);
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }
        
        // Create new cart for user
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    /**
     * Add a book to cart. If the book already exists, update quantity.
     */
    @Transactional
    public CartItem addToCart(Integer userId, Integer bookId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        if (cart == null) {
            return null;
        }

        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) {
            return null;
        }

        // Check if item already exists
        Optional<CartItem> existingItem = cartItemRepository
                .findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setId(new CartItemId(cart.getCartId(), bookId));
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(quantity);
            return cartItemRepository.save(newItem);
        }
    }

    /**
     * Update quantity of an item in cart.
     */
    @Transactional
    public CartItem updateCartItemQuantity(Integer userId, Integer bookId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        if (cart == null) {
            return null;
        }

        Optional<CartItem> itemOpt = cartItemRepository
                .findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                cartItemRepository.delete(item);
                return null;
            }
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }
        return null;
    }

    /**
     * Remove an item from cart.
     */
    @Transactional
    public boolean removeFromCart(Integer userId, Integer bookId) {
        Cart cart = getCartByUserId(userId);
        if (cart == null) {
            return false;
        }

        Optional<CartItem> itemOpt = cartItemRepository
                .findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

        if (itemOpt.isPresent()) {
            cartItemRepository.delete(itemOpt.get());
            return true;
        }
        return false;
    }

    /**
     * Clear all items from a user's cart.
     */
    @Transactional
    public boolean clearCart(Integer userId) {
        Cart cart = getCartByUserId(userId);
        if (cart == null) {
            return false;
        }

        cartItemRepository.deleteAllByCartId(cart.getCartId());
        return true;
    }
}
