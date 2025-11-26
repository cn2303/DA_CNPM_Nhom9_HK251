package com.Project.Bookstore.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Data
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;
    private String email;
    private  String username;
    private String password;
    private String phone;
    private Date birthday;

    @Enumerated(EnumType.STRING)
    private ROLE role;
}
