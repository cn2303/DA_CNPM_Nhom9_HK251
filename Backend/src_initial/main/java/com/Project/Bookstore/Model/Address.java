package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ward;
    private String city;
    private String addressDetail;
    private String phone;
    private boolean isDefault;
    @ManyToOne
    private Customer customer;
}
