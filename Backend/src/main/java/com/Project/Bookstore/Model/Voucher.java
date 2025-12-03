package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "voucher")
@Data
public class Voucher {

    @Id
    @Column(name = "code", length = 50)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start")
    private LocalDate start;

    @Column(name = "\"End\"")
    private LocalDate end;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "minordervalue", precision = 12, scale = 2)
    private BigDecimal minOrderValue;

    @Column(name = "maxordervalue", precision = 12, scale = 2)
    private BigDecimal maxOrderValue;

    @Column(name = "percent", precision = 5, scale = 2)
    private BigDecimal percent;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "userid")
    private User user;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "voucher", cascade = CascadeType.ALL)
    private List<Order> orders;
}
