package com.Project.Bookstore.Model;

import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Customer extends User{
    private List<Address>  addresses =  new ArrayList<>();
    public Customer(){
        this.setRole(ROLE.Customer);
    }
}
