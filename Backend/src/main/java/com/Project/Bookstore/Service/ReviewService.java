package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Book;
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
    public Review getReviewById(Integer id) {
        return this.reviewRepository.findById(id).orElse(null);
    }
    public List<Review> getReviewsByBook(Integer bookId) {
        return this.reviewRepository.findByBookId(bookId);
    }
    public Review saveReview(Review review) {
        if(review.getRating() > 5 || review.getRating() <= 0){
            throw new RuntimeException("Invalid rating");
        }
        return this.reviewRepository.save(review);
    }
    public void deleteReview(Integer id) {
        this.reviewRepository.deleteById(id);
    }

}
