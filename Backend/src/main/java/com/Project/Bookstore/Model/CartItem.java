package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cartitem")
public class CartItem {
    @EmbeddedId
    private CartItemId id = new CartItemId();

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "BookID")
    private Book book;

    @ManyToOne
    @MapsId("cartId")
    @JoinColumn(name = "CartID")
    @JsonIgnore
    private Cart cart;

    @Column(name = "quantity")
    private int quantity;
}
