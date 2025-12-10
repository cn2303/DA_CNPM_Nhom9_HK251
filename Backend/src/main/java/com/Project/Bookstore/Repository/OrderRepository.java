package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Order;
import com.Project.Bookstore.Model.OrderStatus;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByUserId(Integer customerId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusAndUserId(OrderStatus status, Integer userId);
}
