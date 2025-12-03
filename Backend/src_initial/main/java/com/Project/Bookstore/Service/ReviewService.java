package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Review;
import com.Project.Bookstore.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    public Review saveReview(Review review) {
        return this.reviewRepository.save(review);
    }
    public void deleteReview(Long id) {
        this.reviewRepository.deleteById(id);
    }

}
