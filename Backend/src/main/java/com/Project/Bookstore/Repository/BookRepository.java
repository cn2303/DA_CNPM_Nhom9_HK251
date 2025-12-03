package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository để truy xuất dữ liệu bảng book.
 * 
 * Lưu ý: Các native query sử dụng tên bảng/cột lowercase
 * vì PostgreSQL mặc định chuyển tên không có ngoặc kép về lowercase.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    /**
     * Tìm kiếm sách theo keyword (tìm trong title hoặc authorname).
     * 
     * @param keyword Từ khóa tìm kiếm
     * @return Danh sách sách khớp với keyword
     */
    @Query(
        value = "SELECT * FROM book " +
                "WHERE LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                "   OR LOWER(authorname) LIKE LOWER(CONCAT('%', :keyword, '%'))",
        nativeQuery = true
    )
    List<Book> searchBooksByKeyword(@Param("keyword") String keyword);

    /**
     * Lọc sách nâng cao với đầy đủ các tiêu chí.
     * Tất cả các tham số đều optional - nếu null sẽ bỏ qua điều kiện đó.
     * 
     * @param keyword         Từ khóa tìm trong title
     * @param authorName      Tên tác giả (tìm kiếm gần đúng)
     * @param publisherName   Tên nhà xuất bản (tìm kiếm gần đúng)
     * @param minPrice        Giá tối thiểu
     * @param maxPrice        Giá tối đa
     * @param categoryId      ID danh mục (lọc qua bảng bookcategory)
     * @param publicationYear Năm xuất bản
     * @param language        Ngôn ngữ
     * @param status          Trạng thái sách (Active/Inactive)
     * @return Danh sách sách thỏa mãn điều kiện
     */
    @Query(
        value = "SELECT DISTINCT b.* " +
                "FROM book b " +
                "LEFT JOIN bookcategory bc ON b.bookid = bc.bookid " +
                "LEFT JOIN category c ON bc.categoryid = c.categoryid " +
                "WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                "  AND (:authorName IS NULL OR LOWER(b.authorname) LIKE LOWER(CONCAT('%', :authorName, '%'))) " +
                "  AND (:publisherName IS NULL OR LOWER(b.publishername) LIKE LOWER(CONCAT('%', :publisherName, '%'))) " +
                "  AND (CAST(:minPrice AS NUMERIC) IS NULL OR b.price >= :minPrice) " +
                "  AND (CAST(:maxPrice AS NUMERIC) IS NULL OR b.price <= :maxPrice) " +
                "  AND (:categoryId IS NULL OR c.categoryid = :categoryId) " +
                "  AND (:publicationYear IS NULL OR b.publicationyear = :publicationYear) " +
                "  AND (:language IS NULL OR LOWER(b.language) LIKE LOWER(CONCAT('%', :language, '%'))) " +
                "  AND (:status IS NULL OR LOWER(b.status) = LOWER(:status))",
        nativeQuery = true
    )
    List<Book> filterBooks(
            @Param("keyword") String keyword,
            @Param("authorName") String authorName,
            @Param("publisherName") String publisherName,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice,
            @Param("categoryId") Integer categoryId,
            @Param("publicationYear") Integer publicationYear,
            @Param("language") String language,
            @Param("status") String status
    );

    /**
     * Tìm sách theo title hoặc authorName (không phân biệt hoa thường).
     * JPA tự động tạo query từ tên method.
     * 
     * @param title  Từ khóa tìm trong title
     * @param author Từ khóa tìm trong authorName
     * @return Danh sách sách khớp
     */
    List<Book> findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
            String title, 
            String author
    );

    /**
     * Tìm sách theo authorname (chính xác).
     */
    List<Book> findByAuthorName(String authorName);

    /**
     * Tìm sách theo publishername.
     */
    List<Book> findByPublisherName(String publisherName);

    /**
     * Tìm sách có giá trong khoảng.
     */
    @Query("SELECT b FROM Book b WHERE b.price BETWEEN :minPrice AND :maxPrice")
    List<Book> findByPriceRange(
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice
    );
}
