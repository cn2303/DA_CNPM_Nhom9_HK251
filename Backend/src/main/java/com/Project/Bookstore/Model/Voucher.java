package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Voucher")
public class Voucher {
    @Id
    @Column(name = "Code",length = 50)
    private String code;
    @Column(name = "startdate")
    private LocalDate startDate;
    @Column(name = "enddate")
    private LocalDate endDate;
    @Column(name = "Percent")
    private Integer percent;
    @Column(name = "maxordervalue")
    private BigDecimal maxValue;
    @Column(name = "minordervalue")
    private BigDecimal minValue;
    @Column(name = "Quantity")
    private  Integer quantity;
    @Column(name = "Description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private User user;
}
