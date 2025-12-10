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

import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Service.UserService;
@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    public List<User> getAllUsers() {
        return this.userService.getAllUser();
    }
    @GetMapping("/{id}")
    public User getUser(@PathVariable Integer id) {
        return this.userService.getUserById(id);
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return this.userService.saveUser(user);
    }
    @PutMapping
    public User updateUser(@RequestBody User user) {
        return this.userService.updateUser(user);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        this.userService.deleteUser(id);
    }
}
