package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Model.OrderAddress;
import com.Project.Bookstore.Model.OrderItem;
import com.Project.Bookstore.Model.OrderStatusHistory;
import com.Project.Bookstore.Model.Payment;
import com.Project.Bookstore.Service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    @GetMapping("/{orderId}/status-history")
    public ResponseEntity<List<OrderStatusHistory>> getStatusHistory(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getStatusHistory(orderId));
    }

    @GetMapping("/{orderId}/address")
    public ResponseEntity<OrderAddress> getOrderAddress(@PathVariable Integer orderId) {
        OrderAddress address = orderService.getOrderAddress(orderId);
        if (address == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(address);
    }

    @GetMapping("/{orderId}/payment")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Integer orderId) {
        return orderService.getPaymentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
