package com.Project.Bookstore.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCategoryId implements Serializable {

    @Column(name = "bookid")
    private Integer bookId;

    @Column(name = "categoryid")
    private Integer categoryId;
}
