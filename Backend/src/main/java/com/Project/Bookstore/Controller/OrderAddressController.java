package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.OrderAddress;
import com.Project.Bookstore.Service.OrderAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/OrderAddress")
public class OrderAddressController {
    private final OrderAddressService orderAddressService;
    @Autowired
    public OrderAddressController(OrderAddressService orderAddressService) {
        this.orderAddressService = orderAddressService;
    }
    @PreAuthorize("hasRole('ADMIN')")
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
