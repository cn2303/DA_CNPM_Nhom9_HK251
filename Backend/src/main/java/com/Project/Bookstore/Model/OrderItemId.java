package com.Project.Bookstore.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Data
@Getter
@Setter
@Embeddable
public class OrderItemId implements Serializable {

    @Column(name = "OrderID")
    private Integer orderId;

    @Column(name = "BookID")
    private Integer bookId;

    public OrderItemId() {}

    public OrderItemId(Integer orderId, Integer bookId) {
        this.orderId = orderId;
        this.bookId = bookId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderItemId that = (OrderItemId) o;
        return Objects.equals(orderId, that.orderId) &&
                Objects.equals(bookId, that.bookId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, bookId);
    }
}
