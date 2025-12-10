package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Integer id;
    @OneToOne
    @JoinColumn(name = "OrderID")
    private Order order;

    @Column(name = "transactioncode")
    private String transactionCode;
    @Column(name = "paidat")
    private LocalDateTime paidAt;
    @Column(name = "paystatus")
    private PaymentStatus payStatus;
    @Column(name = "Amount")
    private Integer amount;
    @Column(name = "Gateway")
    private String gateWay;
    @Column(name = "gatewayresponse")
    private String GateWayResponse;
}
