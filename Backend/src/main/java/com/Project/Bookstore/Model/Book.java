package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Book{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String language;
    private String author;
    private String publisher;
    private String description;
    private int price;
    private int quantity;
    private int publicationYear;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Category> categories = new ArrayList<>();
}