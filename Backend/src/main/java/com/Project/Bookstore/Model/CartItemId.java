package com.Project.Bookstore.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;


@Getter
@Setter
@Embeddable

public class    CartItemId implements Serializable {

    @Column(name = "CartID")
    private Integer cartId;

    @Column(name = "BookID")
    private Integer bookId;

    public CartItemId() {}

    public CartItemId(Integer cartId, Integer bookId) {
        this.cartId = cartId;
        this.bookId = bookId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItemId that = (CartItemId) o;
        return Objects.equals(cartId, that.cartId) &&
                Objects.equals(bookId, that.bookId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cartId, bookId);
    }
}
