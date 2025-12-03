package com.Project.Bookstore.Model;

/**
 * This class is kept for reference only.
 * In the new schema, Role is stored as a String in the User table.
 * Use User.getRole().equals("CUSTOMER") to check if a user is a customer.
 * 
 * @deprecated Use User entity with role="CUSTOMER" instead
 */
@Deprecated
public class Customer {
    public static final String ROLE_NAME = "CUSTOMER";
}
