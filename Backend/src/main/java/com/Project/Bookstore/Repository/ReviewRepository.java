package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByBook_BookId(Integer bookId);
}
