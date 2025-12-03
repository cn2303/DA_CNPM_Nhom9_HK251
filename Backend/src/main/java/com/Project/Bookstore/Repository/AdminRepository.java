package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for admin users.
 * Since Admin is no longer a separate entity, this queries User table with role='ADMIN'.
 */
@Repository
public interface AdminRepository extends JpaRepository<User, Integer> {
    List<User> findByRole(String role);
    
    default List<User> findAllAdmins() {
        return findByRole("ADMIN");
    }
}
