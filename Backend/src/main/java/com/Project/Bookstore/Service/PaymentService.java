package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Payment;
import com.Project.Bookstore.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    public List<Payment> findAll() {
        return this.paymentRepository.findAll();
    }
    public Payment findById(Long id) {
        return this.paymentRepository.findById(id).orElse(null);
    }
    public Payment save(Payment payment) {
        return this.paymentRepository.save(payment);
    }
    public Payment update(Payment payment) {
        return this.paymentRepository.save(payment);
    }
    public void deleteById(Long id) {
        this.paymentRepository.deleteById(id);
    }
}
