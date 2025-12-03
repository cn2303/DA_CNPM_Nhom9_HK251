package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Book book;
    //Xem lai
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();
}
