package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface PaymentRepository extends JpaRepository<Payment,Integer> {
}
