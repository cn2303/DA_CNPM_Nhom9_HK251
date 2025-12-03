package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Integer> {
    
    List<OrderStatusHistory> findByOrder_OrderId(Integer orderId);
}
