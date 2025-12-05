package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/address")
public class AddressController {
    private final AddressService addressService;
    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }
    @GetMapping
    public List<Address> getAllAddresses() {
        return this.addressService.findAll();
    }
    @GetMapping("/{id}")
    public Address getAddressesById(@PathVariable Integer id) {
        return this.addressService.findById(id);
    }
    @PostMapping
    public Address addAddress(@RequestBody Address address) {
        return this.addressService.saveAddress(address);
    }
    @PutMapping
    public Address updateAddress(@RequestBody Address address) {
        return this.addressService.saveAddress(address);
    }
}
