package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "orderaddress")
@Data
public class OrderAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderaddrid")
    private Integer orderAddrId;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(name = "addressdetail", length = 255)
    private String addressDetail;

    @Column(name = "phone", length = 20)
    private String phone;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "orderid", nullable = false)
    private Order order;
}
