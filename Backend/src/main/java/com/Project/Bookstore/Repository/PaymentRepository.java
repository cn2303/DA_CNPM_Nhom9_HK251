package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    
    Optional<Payment> findByOrder_OrderId(Integer orderId);
}
