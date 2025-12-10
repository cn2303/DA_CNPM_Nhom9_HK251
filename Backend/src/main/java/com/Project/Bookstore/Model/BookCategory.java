    package com.Project.Bookstore.Model;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    @Entity
    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "bookcategory")
    public class BookCategory {
        @EmbeddedId
        private BookCategoryId id = new  BookCategoryId();

        @ManyToOne
        @MapsId("bookId")
        @JoinColumn(name = "BookID")
        @JsonIgnore
        private Book book;

        @ManyToOne
        @MapsId("categoryId")
        @JoinColumn(name = "CategoryID")
        private Category category;
    }
