package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public List<User> getAllUser() {
        return this.userRepository.findAll();
    }
    public User getUserById(Integer id) {
        return this.userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));
    }
    public User saveUser(User user) {
        return this.userRepository.save(user);
    }
    public User updateUser(User user) {
        return this.userRepository.save(user);
    }
    public void deleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }
}
