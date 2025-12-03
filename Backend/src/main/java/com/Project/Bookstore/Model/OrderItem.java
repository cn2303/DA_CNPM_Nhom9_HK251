package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "orderitem")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderitemid")
    private Integer orderItemId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "linetotalprice", precision = 12, scale = 2)
    private BigDecimal lineTotalPrice;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orderid", nullable = false)
    private Order order;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;
}
