package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Review;
import com.Project.Bookstore.Repository.ReviewRepository;
import com.Project.Bookstore.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("http://localhost:5173")
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
    public ResponseEntity<?> saveReview(@RequestBody Review review) {
        try{
            Review saved = this.reviewService.saveReview(review);
            return ResponseEntity.ok().body(saved);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PutMapping
    public ResponseEntity<?> updateReview(@RequestBody Review review) {
        try{
            Review saved = this.reviewService.saveReview(review);
            return ResponseEntity.ok().body(saved);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Integer id) {
        this.reviewService.deleteReview(id);
    }

}
