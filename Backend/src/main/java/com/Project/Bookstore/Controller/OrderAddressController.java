package com.Project.Bookstore.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.Bookstore.Model.OrderAddress;
import com.Project.Bookstore.Service.OrderAddressService;
@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/OrderAddress")
public class OrderAddressController {
    private final OrderAddressService orderAddressService;
    @Autowired
    public OrderAddressController(OrderAddressService orderAddressService) {
        this.orderAddressService = orderAddressService;
    }
    @GetMapping
    public List<OrderAddress> getOrderAddress() {
        return this.orderAddressService.getAllOrderAddress();
    }
    @GetMapping("/{id}")
    public OrderAddress getOrderAddress(@PathVariable Integer id) {
        return this.orderAddressService.getOrderAddress(id);
    }
    @PostMapping
    public OrderAddress addOrderAddress(@RequestBody OrderAddress orderAddress) {
        return this.orderAddressService.saveOrderAddress(orderAddress);
    }
    @PutMapping
    public OrderAddress updateOrderAddress(@RequestBody OrderAddress orderAddress) {
        return this.orderAddressService.updateOrderAddress(orderAddress);
    }
    @DeleteMapping("/{id}")
    public void deleteOrderAddress(@PathVariable Integer id) {
        this.orderAddressService.deleteOrderAddress(id);
    }
}
