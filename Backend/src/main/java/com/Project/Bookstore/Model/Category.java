package com.Project.Bookstore.Model;


import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    @ManyToMany(mappedBy = "categories")
    private Set<Book> books = new HashSet<>();
    public Category() {
    }
}
