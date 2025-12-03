package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for customer users.
 * Customers are User entities with role="CUSTOMER".
 */
@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    
    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    public User save(User customer) {
        customer.setRole("CUSTOMER");
        return this.customerRepository.save(customer);
    }
    
    public List<User> findAll() {
        return this.customerRepository.findAllCustomers();
    }
    
    public User findById(Integer id) {
        return this.customerRepository.findById(id).orElse(null);
    }
    
    public void delete(Integer id) {
        this.customerRepository.deleteById(id);
    }
}
