package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItem {
    @EmbeddedId
    private CartItemId id;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "id")
    private Book book;

    @ManyToOne
    @MapsId("cartId")
    @JoinColumn(name = "id")
    private Cart cart;

    private int quantity;
}
