package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "orderstatushistory")
@Data
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "histid")
    private Integer histId;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "changedat")
    private LocalDateTime changedAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orderid", nullable = false)
    private Order order;
}
