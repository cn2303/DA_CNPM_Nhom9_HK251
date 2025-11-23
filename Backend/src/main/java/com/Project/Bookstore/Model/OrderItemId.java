package com.Project.Bookstore.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class OrderItemId implements Serializable {

    @Column(name = "id")
    private Long cartId;

    @Column(name = "id")
    private Long bookId;

    public OrderItemId() {}

    public OrderItemId(Long cartId, Long bookId) {
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
