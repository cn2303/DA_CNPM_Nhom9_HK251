package com.Project.Bookstore.Model;

import jakarta.persistence.Entity;

@Entity
public class Admin extends User{
    public Admin(){
        this.setRole(ROLE.Admin);
    }
}
