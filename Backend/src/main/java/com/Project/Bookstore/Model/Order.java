package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private OrderStatus status;
    private LocalDateTime orderDate;
    private int shippingFee;
    private int discount;
    private List<Book> bookList;
    @ManyToOne
    private Customer customer;
    @OneToOne
    private OrderAddress orderAddress;
    @ManyToOne
    private Voucher voucher;
    @OneToOne
    private Payment payment;
    //xem lai
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<OrderItem> orderItemList = new ArrayList<>();
}
