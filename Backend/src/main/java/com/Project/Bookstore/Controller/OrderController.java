package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Model.OrderStatus;
import com.Project.Bookstore.Service.BookService;
import com.Project.Bookstore.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.LongSummaryStatistics;
@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/order")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @GetMapping
    public List<Order> getAllOrders() {
        return this.orderService.getAllOrder();
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Integer id) {
        try{
            Order order = this.orderService.getOrderById(id);
            return ResponseEntity.ok().body(order);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody Order order) {
        try{
            Order order1 = this.orderService.saveOrder(order);
            return ResponseEntity.ok().body(order1);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping
    public ResponseEntity<?> updateOrder(@RequestBody Order order) {
        try{
            Order order1 = this.orderService.updateOrder(order);
            return ResponseEntity.ok().body(order1);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/user/{id}")
    public List<Order> getOrdersByCustomer(@PathVariable Integer id) {
        return this.orderService.getOrderByUserId(id);
    }
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable OrderStatus status) {
        return this.orderService.getOrderByStatus(status);
    }
    @GetMapping("/user/{id}/status/{status}")
    public List<Order> getOrdersByStatusAndUser(@PathVariable Integer id, @PathVariable OrderStatus status) {
        return this.orderService.getOrderByStatusAndUser(status, id);
    }
    @PutMapping("/{id}/status/{status}")
    public Order updateOrderStatus(@PathVariable Integer id, @PathVariable OrderStatus status) {
        return this.orderService.changeOrderStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id) {
        try{
            this.orderService.deleteOrderById(id);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
