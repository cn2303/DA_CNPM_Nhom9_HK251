package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bookcategory")
@Data
public class BookCategory {

    @EmbeddedId
    private BookCategoryId id;

    @JsonIgnore
    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;

    @JsonIgnore
    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;
}
