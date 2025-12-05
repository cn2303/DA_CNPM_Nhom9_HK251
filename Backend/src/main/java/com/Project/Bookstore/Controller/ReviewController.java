package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Review;
import com.Project.Bookstore.Repository.ReviewRepository;
import com.Project.Bookstore.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {
    private final ReviewService reviewService;
    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
    @GetMapping("/{id}")
    public Review getReview(@PathVariable Integer id) {
        return this.reviewService.getReviewById(id);
    }
    @GetMapping("/book/{id}")
    public List<Review> getReviewsByBook(@PathVariable Integer id) {
        return this.reviewService.getReviewsByBook(id);
    }
    @PostMapping
    public Review saveReview(@RequestBody Review review) {
        return this.reviewService.saveReview(review);
    }
    @PutMapping
    public Review updateReview(@RequestBody Review review) {
        return this.reviewService.saveReview(review);
    }
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Integer id) {
        this.reviewService.deleteReview(id);
    }

}
