package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.OrderAddress;
import com.Project.Bookstore.Repository.OrderAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderAddressService {
    private final OrderAddressRepository orderAddressRepository;
    @Autowired
    public OrderAddressService(OrderAddressRepository orderAddressRepository) {
        this.orderAddressRepository = orderAddressRepository;
    }
    public List<OrderAddress> getAllOrderAddress() {
        return this.orderAddressRepository.findAll();
    }
    public OrderAddress getOrderAddress(Integer id) {
        return this.orderAddressRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Order Address Not Found"));
    }
    public OrderAddress saveOrderAddress(OrderAddress orderAddress) {
        return this.orderAddressRepository.save(orderAddress);
    }
    public OrderAddress updateOrderAddress(OrderAddress orderAddress) {
        if(!orderAddressRepository.existsById(orderAddress.getId())) {
            throw new RuntimeException("Order Address Not Found");
        }
        return this.orderAddressRepository.save(orderAddress);
    }
    public void deleteOrderAddress(Integer id) {
        this.orderAddressRepository.deleteById(id);
    }
}
