package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.OrderAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderAddressRepository extends JpaRepository<OrderAddress, Integer> {
}
