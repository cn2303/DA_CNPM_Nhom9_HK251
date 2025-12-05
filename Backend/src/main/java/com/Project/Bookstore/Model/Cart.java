package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CartID")
    private Integer id;

    //@OneToOne(fetch = FetchType.LAZY)
    @OneToOne
    @JoinColumn(name = "UserID", unique = true)
    private User user;
    //Xem lai
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL,  orphanRemoval = true)
    @JsonIgnoreProperties("cart")
    private List<CartItem> cartItems = new ArrayList<>();
}
