package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "address")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addressid")
    private Integer addressId;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(name = "addressdetail", length = 255)
    private String addressDetail;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "isdefault")
    private Boolean isDefault;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;
}
