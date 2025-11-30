package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Customer;
import com.Project.Bookstore.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    public Customer save(Customer customer) {
        return this.customerRepository.save(customer);
    }
    public List<Customer> findAll() {
        return this.customerRepository.findAll();
    }
    public Customer findById(Long id) {
        return this.customerRepository.findById(id).orElse(null);
    }
    public void delete(Long id) {
        this.customerRepository.deleteById(id);
    }
}
