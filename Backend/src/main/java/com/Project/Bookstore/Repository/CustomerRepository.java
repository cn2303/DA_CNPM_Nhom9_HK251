package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for customer users.
 * Since Customer is no longer a separate entity, this queries User table with role='CUSTOMER'.
 */
@Repository
public interface CustomerRepository extends JpaRepository<User, Integer> {
    List<User> findByRole(String role);
    
    default List<User> findAllCustomers() {
        return findByRole("CUSTOMER");
    }
}
