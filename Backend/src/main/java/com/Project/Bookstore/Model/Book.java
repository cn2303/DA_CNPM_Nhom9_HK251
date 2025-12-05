    package com.Project.Bookstore.Model;

    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import jakarta.persistence.*;
    import lombok.*;

    import java.math.BigDecimal;
    import java.time.LocalDate;
    import java.util.ArrayList;
    import java.util.HashSet;
    import java.util.List;
    import java.util.Set;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "Book")
    public class Book{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "bookID")
        private Integer id;
        @Column(name = "ISBN")
        private String isbn;
        @Column(name = "Title")
        private String title;
        @Column(name = "Language")
        private String language;
        @Column(name = "authorname")
        private String author;
        @Column(name = "publishername")
        private String publisher;
        @Column(name = "Description")
        private String description;
        @Enumerated(EnumType.STRING)
        @Column(name = "Status")
        private BookStatus status;
        @Column(name = "numpage")
        private Integer NumPage;
        @Column(name = "Nation")
        private String Nation;
        @Column(name = "size")
        private String size;
        @Column(name = "Type")
        private String type;
        @Column(name = "Price")
        private BigDecimal price;
        @Column(name = "stockquantity")
        private Integer quantity;
        @Column(name = "publicationyear")
        private Integer publicationYear;
        @Column(name = "Avgrating")
        private BigDecimal AverageRating = BigDecimal.ZERO;
        @Column(name = "image_url")
        private String imageUrl;
        @OneToMany(mappedBy = "book",cascade = CascadeType.ALL,orphanRemoval = true)
        @JsonIgnoreProperties("book")
        private List<BookCategory> categories = new ArrayList<>();
    }