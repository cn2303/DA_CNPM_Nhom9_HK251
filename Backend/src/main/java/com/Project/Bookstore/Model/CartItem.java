package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cartitem")
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartitemid")
    private Integer cartItemId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cartid", nullable = false)
    private Cart cart;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;
}
