package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.br.CPF;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AddressID")
    private Integer id;

    @Column(name = "Ward")
    private String ward;
    @Column(name = "City")
    private String city;
    @Column(name = "addressdetail")
    private String addressDetail;
    @Column(name = "Phone")
    private String phone;
    @Column(name = "isdefault")
    private boolean Default;
    @ManyToOne
    @JoinColumn(name = "UserID")
    @JsonIgnoreProperties("addresses")
    private User user;
}
