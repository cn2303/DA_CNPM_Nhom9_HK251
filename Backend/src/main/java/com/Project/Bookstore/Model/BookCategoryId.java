package com.Project.Bookstore.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class BookCategoryId {
    @Column(name = "BookID")
    private Integer bookId;

    @Column(name = "CategoryID")
    private Integer categoryId;

    public BookCategoryId(){}
    public BookCategoryId(Integer bookId, Integer categoryId) {
        this.bookId = bookId;
        this.categoryId = categoryId;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookCategoryId that = (BookCategoryId) o;
        return Objects.equals(bookId, that.bookId)
                && Objects.equals(categoryId, that.categoryId);
    }
    @Override
    public int hashCode() {
        return Objects.hash(bookId, categoryId);
    }
}
