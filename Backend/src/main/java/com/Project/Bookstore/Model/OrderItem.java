package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "orderitem")
@Data
public class OrderItem {

    @EmbeddedId
    private OrderItemId id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "linetotalprice", precision = 15, scale = 2)
    private BigDecimal lineTotalPrice;

    @JsonIgnore
    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "orderid", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("bookId")
    @JoinColumn(name = "bookid", nullable = false)
    private Book book;

    // Convenience getters for JSON serialization
    @JsonProperty("bookId")
    public Integer getBookId() {
        return book != null ? book.getBookId() : (id != null ? id.getBookId() : null);
    }

    @JsonProperty("bookTitle")
    public String getBookTitle() {
        return book != null ? book.getTitle() : null;
    }

    @JsonProperty("bookPrice")
    public BigDecimal getBookPrice() {
        return book != null ? book.getPrice() : null;
    }

    @JsonProperty("bookImageUrl")
    public String getBookImageUrl() {
        return book != null ? book.getImageUrl() : null;
    }

    @JsonProperty("orderId")
    public Integer getOrderId() {
        return order != null ? order.getOrderId() : (id != null ? id.getOrderId() : null);
    }
}
