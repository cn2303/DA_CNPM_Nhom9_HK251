package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Book;
import com.Project.Bookstore.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các API liên quan đến Sách (Book).
 * 
 * Base URL: /api/books
 * 
 * Các endpoint:
 * - GET  /api/books           : Lấy tất cả sách
 * - GET  /api/books/{id}      : Lấy 1 sách theo ID
 * - POST /api/books           : Tạo sách mới
 * - PUT  /api/books/{id}      : Cập nhật sách
 * - DELETE /api/books/{id}    : Xóa sách
 * - PATCH /api/books/{id}/image : Cập nhật URL ảnh cho sách
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")  // Cho phép React/Vite FE gọi được
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // ========================================
    // GET - Lấy dữ liệu
    // ========================================

    /**
     * Lấy tất cả sách.
     * GET /api/books
     */
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    /**
     * Lấy 1 sách theo ID.
     * GET /api/books/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        Book book = bookService.getBookById(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    /**
     * Tìm kiếm sách theo keyword (title hoặc author).
     * GET /api/books/search?q=java
     * 
     * Ví dụ: http://localhost:8080/api/books/search?q=java
     * Trả về danh sách sách có title hoặc authorName chứa "java"
     */
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam("q") String q) {
        return bookService.searchBooks(q);
    }

    /**
     * Lọc sách nâng cao với đầy đủ các tiêu chí.
     * GET /api/books/filter
     * 
     * Tất cả parameters đều optional:
     * - keyword: Tìm trong title
     * - authorName: Tìm theo tên tác giả
     * - publisherName: Tìm theo nhà xuất bản
     * - minPrice: Giá tối thiểu
     * - maxPrice: Giá tối đa
     * - categoryId: ID danh mục
     * - publicationYear: Năm xuất bản
     * - language: Ngôn ngữ
     * - status: Trạng thái (Active/Inactive)
     * 
     * Ví dụ: /api/books/filter?keyword=toan&minPrice=50000&maxPrice=100000&categoryId=1
     */
    @GetMapping("/filter")
    public List<Book> filterBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) String publisherName,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer publicationYear,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String status
    ) {
        return bookService.filterBooks(
                keyword, authorName, publisherName,
                minPrice, maxPrice, categoryId,
                publicationYear, language, status
        );
    }

    // ========================================
    // POST - Tạo mới
    // ========================================

    /**
     * Tạo sách mới.
     * POST /api/books
     * 
     * Body JSON ví dụ:
     * {
     *   "title": "Lập trình Java",
     *   "authorName": "Nguyễn Văn A",
     *   "publisherName": "NXB Bách Khoa",
     *   "price": 150000,
     *   "imageUrl": "https://res.cloudinary.com/.../java-book.jpg"
     * }
     * 
     * Lưu ý: imageUrl là URL đã upload lên Cloudinary qua API /api/cloudinary/upload
     */
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book savedBook = bookService.createBook(book);
        return ResponseEntity.ok(savedBook);
    }

    // ========================================
    // PUT - Cập nhật toàn bộ
    // ========================================

    /**
     * Cập nhật sách theo ID.
     * PUT /api/books/{id}
     * 
     * Chỉ cần gửi các field muốn cập nhật trong body.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Integer id,
            @RequestBody Book book
    ) {
        Book updatedBook = bookService.updateBook(id, book);
        if (updatedBook == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBook);
    }

    // ========================================
    // DELETE - Xóa
    // ========================================

    /**
     * Xóa sách theo ID.
     * DELETE /api/books/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBook(@PathVariable Integer id) {
        boolean deleted = bookService.deleteBook(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
    }

    // ========================================
    // PATCH - Cập nhật một phần
    // ========================================

    /**
     * Cập nhật URL ảnh cho sách.
     * PATCH /api/books/{id}/image
     * 
     * Body JSON:
     * {
     *   "imageUrl": "https://res.cloudinary.com/.../new-image.jpg"
     * }
     * 
     * Use case: FE upload ảnh mới lên Cloudinary, sau đó gọi API này để cập nhật.
     */
    @PatchMapping("/{id}/image")
    public ResponseEntity<Book> updateBookImage(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Book updatedBook = bookService.updateBookImage(id, imageUrl);
        if (updatedBook == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBook);
    }
}

