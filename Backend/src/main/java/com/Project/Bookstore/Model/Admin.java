package com.Project.Bookstore.Model;

/**
 * This class is kept for reference only.
 * In the new schema, Role is stored as a String in the User table.
 * Use User.getRole().equals("ADMIN") to check if a user is an admin.
 * 
 * @deprecated Use User entity with role="ADMIN" instead
 */
@Deprecated
public class Admin {
    public static final String ROLE_NAME = "ADMIN";
}
