package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
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
