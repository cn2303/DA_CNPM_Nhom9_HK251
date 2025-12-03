package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reviewid")
    private Integer reviewId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;

    // Convenience getters for JSON serialization
    @JsonProperty("userId")
    public Integer getUserId() {
        return user != null ? user.getUserId() : null;
    }

    @JsonProperty("userName")
    public String getUserName() {
        return user != null ? user.getUserName() : null;
    }

    @JsonProperty("userFullName")
    public String getUserFullName() {
        return user != null ? user.getFullName() : null;
    }

    @JsonProperty("bookId")
    public Integer getBookId() {
        return book != null ? book.getBookId() : null;
    }
}
