package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.User;
import com.Project.Bookstore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    public User getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));
    }
    public User getUserById(Integer id) {
        return this.userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));
    }
    public User saveUser(User user) {
        //Encode password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return this.userRepository.save(user);
    }
    public User updateUser(User user) {
        User currentUser = this.getUserById(user.getId());
        if(!currentUser.getPassword().equals(user.getPassword())){
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return this.userRepository.save(user);

    }
    public void deleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }
}
