package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
