package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "\"Order\"")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderid")
    private Integer orderId;

    @Column(name = "orderdate")
    private LocalDateTime orderDate;

    @Column(name = "paymentmethod", length = 50)
    private String paymentMethod;

    @Column(name = "currentstatus", length = 50)
    private String currentStatus;

    @Column(name = "shippingfee", precision = 15, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "subtotalprice", precision = 15, scale = 2)
    private BigDecimal subTotalPrice;

    @Column(name = "discounttotal", precision = 15, scale = 2)
    private BigDecimal discountTotal;

    @Column(name = "grandtotalprice", precision = 15, scale = 2)
    private BigDecimal grandTotalPrice;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vouchercode")
    private Voucher voucher;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @JsonIgnore
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private OrderAddress orderAddress;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderStatusHistory> orderStatusHistories;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Payment> payments;
}
