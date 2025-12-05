package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Service.BookService;
import com.Project.Bookstore.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Integer id) {
        return this.orderService.getOrderById(id);
    }
    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Integer userId) {
        return this.orderService.getOrderByUserId(userId);
    }
    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        return this.orderService.saveOrder(order);
    }
    @PutMapping
    public Order updateOrder(@RequestBody Order order) {
        return this.orderService.saveOrder(order);
    }
    @GetMapping("/customer/{id}")
    public List<Order> getOrdersByCustomer(@PathVariable Integer id) {
        return this.orderService.getOrderByUserId(id);
    }
}
