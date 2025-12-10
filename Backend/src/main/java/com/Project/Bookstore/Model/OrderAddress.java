package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderaddress")
public class OrderAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderaddrID")
    private Integer id;
    @Column(name = "City")
    private String city;
    @Column(name = "Ward")
    private String ward;
    @Column(name = "addressdetail")
    private String addressDetail;
    @Column(name = "Phone")
    private String phone;
}
