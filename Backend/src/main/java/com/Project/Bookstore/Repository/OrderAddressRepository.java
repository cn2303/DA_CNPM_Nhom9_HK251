package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.OrderAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderAddressRepository extends JpaRepository<OrderAddress, Integer> {
    
    Optional<OrderAddress> findByOrder_OrderId(Integer orderId);
}
