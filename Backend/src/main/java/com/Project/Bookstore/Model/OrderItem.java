package com.Project.Bookstore.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderitem")
public class OrderItem {
    @EmbeddedId
    private OrderItemId id = new OrderItemId();

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "OrderID")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "BookID")
    private Book book;

    @Column(name = "Quantity")
    private Integer quantity;
    @Column(name = "linetotalprice")
    private BigDecimal price;
}
