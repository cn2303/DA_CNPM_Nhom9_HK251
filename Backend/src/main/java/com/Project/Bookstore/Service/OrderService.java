package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Book;
import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Repository.BookRepository;
import com.Project.Bookstore.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    public List<Order> getAllOrder() {
        return this.orderRepository.findAll();
    }
    public Order getOrderById(Long id) {
        return this.orderRepository.findById(id).orElse(null);
    }
    public Order saveOrder(Order order) {
        return this.orderRepository.save(order);
    }
    public void deleteOrderById(Long id) {
        this.orderRepository.deleteById(id);
    }
}
