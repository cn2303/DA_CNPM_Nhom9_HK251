package com.Project.Bookstore.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
public class Voucher {
    @Id
    private Long code;
    private LocalDate startDate;
    private LocalDate endDate;
    private int percent;
    private int maxValue;
    private int minValue;
    private  int quantity;
    private String description;

    @ManyToOne
    private Admin admin;
}
