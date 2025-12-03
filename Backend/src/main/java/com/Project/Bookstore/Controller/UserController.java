package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Service.AddressService;
import com.Project.Bookstore.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for user and address operations.
 * 
 * Endpoints:
 * - GET  /api/users            : Get all users
 * - GET  /api/users/{id}       : Get user by ID
 * - POST /api/users            : Create user
 * - PUT  /api/users/{id}       : Update user
 * - DELETE /api/users/{id}     : Delete user
 * - GET  /api/users/{id}/addresses : Get user's addresses
 * - POST /api/users/{id}/addresses : Add address for user
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final AddressService addressService;

    @Autowired
    public UserController(UserService userService, AddressService addressService) {
        this.userService = userService;
        this.addressService = addressService;
    }

    // ========== User Endpoints ==========

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update fields
        if (user.getUserName() != null) existingUser.setUserName(user.getUserName());
        if (user.getPassword() != null) existingUser.setPassword(user.getPassword());
        if (user.getFullName() != null) existingUser.setFullName(user.getFullName());
        if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
        if (user.getPhone() != null) existingUser.setPhone(user.getPhone());
        if (user.getBirthDate() != null) existingUser.setBirthDate(user.getBirthDate());
        if (user.getRole() != null) existingUser.setRole(user.getRole());
        
        return ResponseEntity.ok(userService.saveUser(existingUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // ========== Address Endpoints ==========

    @GetMapping("/{userId}/addresses")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Integer userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user.getAddresses());
    }

    @PostMapping("/{userId}/addresses")
    public ResponseEntity<Address> addAddress(
            @PathVariable Integer userId,
            @RequestBody Address address
    ) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        address.setUser(user);
        Address savedAddress = addressService.saveAddress(address);
        return ResponseEntity.ok(savedAddress);
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId,
            @RequestBody Address address
    ) {
        Address existingAddress = addressService.findById(addressId);
        if (existingAddress == null || !existingAddress.getUser().getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        
        if (address.getCity() != null) existingAddress.setCity(address.getCity());
        if (address.getWard() != null) existingAddress.setWard(address.getWard());
        if (address.getAddressDetail() != null) existingAddress.setAddressDetail(address.getAddressDetail());
        if (address.getPhone() != null) existingAddress.setPhone(address.getPhone());
        if (address.getIsDefault() != null) existingAddress.setIsDefault(address.getIsDefault());
        
        return ResponseEntity.ok(addressService.saveAddress(existingAddress));
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Map<String, String>> deleteAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId
    ) {
        Address address = addressService.findById(addressId);
        if (address == null || !address.getUser().getUserId().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        
        addressService.deleteById(addressId);
        return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
    }
}
