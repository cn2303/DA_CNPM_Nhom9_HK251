package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Review;
import com.Project.Bookstore.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/book/{bookId}")
    public List<Review> getReviewsByBookId(@PathVariable Integer bookId) {
        return reviewService.getReviewsByBookId(bookId);
    }
}
