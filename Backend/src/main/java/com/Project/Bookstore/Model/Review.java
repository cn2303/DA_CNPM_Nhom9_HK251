package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime createdAt;
    private String comment;
    private int star;
    @ManyToOne
    private Customer customer;
    @ManyToOne
    private Book book;
}
