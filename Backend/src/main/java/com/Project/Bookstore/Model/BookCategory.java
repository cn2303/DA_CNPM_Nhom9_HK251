package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bookcategory")
@Data
public class BookCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookcategoryid")
    private Integer bookCategoryId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;
}
