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
public class OrderItemId implements Serializable {

    @Column(name = "orderid")
    private Integer orderId;

    @Column(name = "bookid")
    private Integer bookId;
}
