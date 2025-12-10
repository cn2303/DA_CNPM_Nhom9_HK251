package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Integer id;

    @Column(name = "currentstatus")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @Column(name = "orderdate")
    private LocalDateTime orderDate;
    @Column(name = "paymentmethod")
    private String paymentMethod;
    @Column(name = "shippingfee")
    private BigDecimal shippingFee;
    @Column(name = "subtotalprice")
    private BigDecimal subtotalPrice;
    @Column(name = "discounttotal")
    private BigDecimal discountTotal;
    @Column(name = "grandtotalprice")
    private BigDecimal grandTotalPrice;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private User user;
    @OneToOne
    @JoinColumn(name = "orderaddressid")
    private OrderAddress orderAddress;
    @ManyToOne
    @JoinColumn(name = "vouchercode")
    private Voucher voucher;


//    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
//    @JsonIgnoreProperties("order")
//    private Payment payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL,  orphanRemoval = true)
    @JsonIgnoreProperties("order")
    private List<OrderItem> orderItemList = new ArrayList<>();
}
