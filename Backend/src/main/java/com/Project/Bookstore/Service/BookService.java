package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Book;
import com.Project.Bookstore.Repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Lấy tất cả sách
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Lấy 1 sách theo id
    public Book getBookById(Integer id) {
        return bookRepository.findById(id).orElse(null);
    }

    // Search keyword đơn giản (title + author)
    // Sử dụng JPA derived query method
    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return bookRepository.findAll();
        }
        String q = keyword.trim();
        // Tìm sách có title HOẶC authorName chứa keyword (không phân biệt hoa thường)
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(q, q);
    }

    /**
     * Lọc sách nâng cao với đầy đủ các tiêu chí.
     * Tất cả parameters đều optional - nếu null sẽ bỏ qua điều kiện đó.
     * 
     * @param keyword         Từ khóa tìm trong title
     * @param authorName      Tên tác giả
     * @param publisherName   Tên nhà xuất bản
     * @param minPrice        Giá tối thiểu
     * @param maxPrice        Giá tối đa
     * @param categoryId      ID danh mục
     * @param publicationYear Năm xuất bản
     * @param language        Ngôn ngữ
     * @param status          Trạng thái (Active/Inactive)
     * @return Danh sách sách thỏa mãn điều kiện
     */
    public List<Book> filterBooks(
            String keyword,
            String authorName,
            String publisherName,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice,
            Integer categoryId,
            Integer publicationYear,
            String language,
            String status
    ) {
        // Xử lý các string parameters: trim và chuyển empty thành null
        return bookRepository.filterBooks(
                (keyword == null || keyword.isBlank()) ? null : keyword.trim(),
                (authorName == null || authorName.isBlank()) ? null : authorName.trim(),
                (publisherName == null || publisherName.isBlank()) ? null : publisherName.trim(),
                minPrice,
                maxPrice,
                categoryId,
                publicationYear,
                (language == null || language.isBlank()) ? null : language.trim(),
                (status == null || status.isBlank()) ? null : status.trim()
        );
    }

    // ========================================
    // CÁC METHOD MỚI CHO CRUD
    // ========================================

    /**
     * Tạo sách mới.
     * Frontend sẽ gửi JSON chứa thông tin sách (bao gồm imageUrl từ Cloudinary).
     * 
     * @param book Đối tượng Book từ request body
     * @return Book đã được lưu (có bookId được DB tự sinh)
     */
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Cập nhật sách theo ID.
     * Chỉ cập nhật các field được gửi từ FE.
     * 
     * @param id   ID của sách cần cập nhật
     * @param book Thông tin mới của sách
     * @return Book đã cập nhật, hoặc null nếu không tìm thấy
     */
    public Book updateBook(Integer id, Book book) {
        // Kiểm tra sách có tồn tại không
        Book existingBook = bookRepository.findById(id).orElse(null);
        if (existingBook == null) {
            return null;
        }

        // Cập nhật các field (chỉ cập nhật nếu giá trị mới khác null)
        if (book.getTitle() != null) existingBook.setTitle(book.getTitle());
        if (book.getIsbn() != null) existingBook.setIsbn(book.getIsbn());
        if (book.getPrice() != null) existingBook.setPrice(book.getPrice());
        if (book.getPublicationYear() != null) existingBook.setPublicationYear(book.getPublicationYear());
        if (book.getStockQuantity() != null) existingBook.setStockQuantity(book.getStockQuantity());
        if (book.getDescription() != null) existingBook.setDescription(book.getDescription());
        if (book.getStatus() != null) existingBook.setStatus(book.getStatus());
        if (book.getLanguage() != null) existingBook.setLanguage(book.getLanguage());
        if (book.getNation() != null) existingBook.setNation(book.getNation());
        if (book.getSize() != null) existingBook.setSize(book.getSize());
        if (book.getType() != null) existingBook.setType(book.getType());
        if (book.getAuthorName() != null) existingBook.setAuthorName(book.getAuthorName());
        if (book.getAuthorBio() != null) existingBook.setAuthorBio(book.getAuthorBio());
        if (book.getPublisherName() != null) existingBook.setPublisherName(book.getPublisherName());
        if (book.getImageUrl() != null) existingBook.setImageUrl(book.getImageUrl());

        return bookRepository.save(existingBook);
    }

    /**
     * Xóa sách theo ID.
     * 
     * @param id ID của sách cần xóa
     * @return true nếu xóa thành công, false nếu không tìm thấy sách
     */
    public boolean deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            return false;
        }
        bookRepository.deleteById(id);
        return true;
    }

    /**
     * Cập nhật URL ảnh cho sách.
     * Dùng khi FE upload ảnh xong muốn gán vào sách.
     * 
     * @param bookId   ID của sách
     * @param imageUrl URL ảnh từ Cloudinary
     * @return Book đã cập nhật, hoặc null nếu không tìm thấy
     */
    public Book updateBookImage(Integer bookId, String imageUrl) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) {
            return null;
        }
        book.setImageUrl(imageUrl);
        return bookRepository.save(book);
    }
}
