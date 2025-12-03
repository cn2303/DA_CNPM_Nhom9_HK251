package com.Project.Bookstore.Controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }

    @GetMapping("/info")
    public String info() {
        return "Backend is running! Database: bookstore_clean, Port: 8080";
    }
}
