package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return this.userService.getAllUser();
    }

    @GetMapping("/myinfo")
    public ResponseEntity<?> getMyInfo() {
        try{
            User myInfo = userService.getMyInfo();
            return ResponseEntity.ok(myInfo);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Integer id) {
        return this.userService.getUserById(id);
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return this.userService.saveUser(user);
    }
    @PostAuthorize("returnObject.email == authentication.name")
    @PutMapping
    public User updateUser(@RequestBody User user) {
        return this.userService.updateUser(user);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        this.userService.deleteUser(id);
    }
}
