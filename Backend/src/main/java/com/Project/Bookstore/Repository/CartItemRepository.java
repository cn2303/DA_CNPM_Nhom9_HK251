package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Cart;
import com.Project.Bookstore.Model.CartItem;
import com.Project.Bookstore.Model.CartItemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItemId> {
    
    List<CartItem> findByCart(Cart cart);
    
    List<CartItem> findByCart_CartId(Integer cartId);
    
    Optional<CartItem> findByCart_CartIdAndBook_BookId(Integer cartId, Integer bookId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.cartId = :cartId AND ci.book.bookId = :bookId")
    void deleteByCartIdAndBookId(@Param("cartId") Integer cartId, @Param("bookId") Integer bookId);
    
    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.cartId = :cartId")
    void deleteAllByCartId(@Param("cartId") Integer cartId);
}
