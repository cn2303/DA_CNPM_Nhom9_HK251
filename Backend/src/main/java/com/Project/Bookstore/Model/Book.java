package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "book")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookid")
    private Integer bookId;

    @Column(name = "isbn", length = 20)
    private String isbn;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "publicationyear")
    private Integer publicationYear;

    @Column(name = "stockquantity")
    private Integer stockQuantity;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "namepage")
    private Integer namePage;

    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "nation", length = 50)
    private String nation;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "avgrating", precision = 3, scale = 2)
    private BigDecimal avgRating;

    @Column(name = "authorname", length = 255)
    private String authorName;

    @Column(name = "authorbio", columnDefinition = "TEXT")
    private String authorBio;

    @Column(name = "publishername", length = 255)
    private String publisherName;

    // URL ảnh sách (lưu sẵn link từ Cloudinary hoặc bất kỳ nguồn nào)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<BookCategory> bookCategories;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<CartItem> cartItems;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<Review> reviews;
}
