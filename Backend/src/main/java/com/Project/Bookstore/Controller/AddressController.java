package com.Project.Bookstore.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Service.AddressService;

@CrossOrigin("http://localhost:3000")
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
    public ResponseEntity<?> getAddressesById(@PathVariable Integer id) {
        try{
            Address address = this.addressService.findById(id);
            return ResponseEntity.ok().body(address);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getAddressesByUserId(@PathVariable Integer id) {
        try{
            List<Address> address = this.addressService.findByUserId(id);
            return ResponseEntity.ok().body(address);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Address address) {
        try{
            Address add = addressService.saveAddress(address);
            return ResponseEntity.ok(add);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
    @PutMapping
    public ResponseEntity<?> updateAddress(@RequestBody Address address) {
        try {
            Address update = addressService.updateAddress(address);
            return ResponseEntity.ok(update);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer id) {
        try {
            this.addressService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
