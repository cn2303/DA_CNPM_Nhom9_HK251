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
    public List<User> getUserList() {
        return this.userRepository.findAll();
    }
    public User getUserById(Long id) {
        return this.userRepository.findById(id).orElse(null);
    }
    public User saveUser(User user) {
        return this.userRepository.save(user);
    }
    public void deleteUser(Long id) {
        this.userRepository.deleteById(id);
    }
}
