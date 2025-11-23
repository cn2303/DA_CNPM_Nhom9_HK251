package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OrderItem {
    @EmbeddedId
    private OrderItemId id;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "id")
    private Order order;

    @ManyToOne
    @MapsId("id")
    @JoinColumn(name = "book_id")
    private Book book;

    private int quantity;

}
