package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paymentid")
    private Integer paymentId;

    @Column(name = "transactioncode", length = 100)
    private String transactionCode;

    @Column(name = "gatewayresponse", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "paidat")
    private LocalDateTime paidAt;

    @Column(name = "paystatus", length = 50)
    private String payStatus;

    @Column(name = "gateway", length = 50)
    private String gateway;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orderid", nullable = false)
    private Order order;
}
