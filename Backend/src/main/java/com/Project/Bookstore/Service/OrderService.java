package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Model.OrderAddress;
import com.Project.Bookstore.Model.OrderItem;
import com.Project.Bookstore.Model.OrderStatusHistory;
import com.Project.Bookstore.Model.Payment;
import com.Project.Bookstore.Repository.OrderAddressRepository;
import com.Project.Bookstore.Repository.OrderItemRepository;
import com.Project.Bookstore.Repository.OrderRepository;
import com.Project.Bookstore.Repository.OrderStatusHistoryRepository;
import com.Project.Bookstore.Repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderAddressRepository orderAddressRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final PaymentRepository paymentRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderAddressRepository orderAddressRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderAddressRepository = orderAddressRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUser_UserId(userId);
    }

    public List<OrderItem> getOrderItems(Integer orderId) {
        return orderItemRepository.findByOrder_OrderId(orderId);
    }

    public List<OrderStatusHistory> getStatusHistory(Integer orderId) {
        return orderStatusHistoryRepository.findByOrder_OrderId(orderId);
    }

    public OrderAddress getOrderAddress(Integer orderId) {
        return orderAddressRepository.findByOrder_OrderId(orderId).orElse(null);
    }

    public Optional<Payment> getPaymentByOrderId(Integer orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }
}
