package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "cartitem")
@Data
public class CartItem {

    @EmbeddedId
    private CartItemId id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @JsonIgnore
    @ManyToOne
    @MapsId("cartId")
    @JoinColumn(name = "cartid", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("bookId")
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;

    // Convenience getters for JSON serialization
    @JsonProperty("bookId")
    public Integer getBookId() {
        return book != null ? book.getBookId() : (id != null ? id.getBookId() : null);
    }

    @JsonProperty("bookTitle")
    public String getBookTitle() {
        return book != null ? book.getTitle() : null;
    }

    @JsonProperty("bookPrice")
    public BigDecimal getBookPrice() {
        return book != null ? book.getPrice() : null;
    }

    @JsonProperty("bookImageUrl")
    public String getBookImageUrl() {
        return book != null ? book.getImageUrl() : null;
    }

    @JsonProperty("cartId")
    public Integer getCartId() {
        return cart != null ? cart.getCartId() : (id != null ? id.getCartId() : null);
    }
}
