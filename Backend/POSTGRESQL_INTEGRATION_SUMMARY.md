# Tổng Hợp: Database & JPA/Hibernate Integration

Tài liệu này mô tả công việc tích hợp PostgreSQL với Backend Spring Boot thông qua JPA/Hibernate.

**Ngày cập nhật:** 03/12/2025  
**Branch:** `feature/update-code`  
**Người thực hiện:** Database & JPA/Hibernate Developer

---


## 1. Quá Trình Phát Triển

### Giai đoạn 1: Thiết kế ban đầu (src_initial/)
Ban đầu, tôi tạo các entity theo hướng **Hibernate tự tạo bảng** (ddl-auto=create):
- `Book.java`: id là Long, author/publisher là object riêng
- `User.java`: role là enum ROLE
- Quan hệ Category: @OneToMany trong Book

### Giai đoạn 2: Chuyển sang SQL Schema cố định
Theo yêu cầu nhóm, chuyển sang sử dụng SQL schema cố định:
- **ddl-auto=none**: Hibernate KHÔNG tự tạo/sửa bảng
- Tất cả entity phải match CHÍNH XÁC với SQL schema
- author/publisher → thuộc tính String (không phải object)
- role → String (không phải enum)
- Xử lý quan hệ nhiều-nhiều qua bảng trung gian

---

## 2. SQL Database Schema

### File: `Database/table.sql`

#### Các bảng chính:
| Bảng | Primary Key | Ghi chú |
|------|-------------|---------|
| `"User"` | UserID (SERIAL) | Tên có ngoặc kép (reserved word) |
| `"Order"` | OrderID (SERIAL) | Tên có ngoặc kép (reserved word) |
| `Book` | BookID (SERIAL) | Chữ thường |
| `Category` | CategoryID (SERIAL) | Chữ thường |
| `Cart` | CartID (SERIAL) | Chữ thường |
| `Voucher` | Code (VARCHAR) | PK là String, không phải ID |
| `Address` | AddressID (SERIAL) | Chữ thường |
| `Payment` | PaymentID (SERIAL) | Chữ thường |
| `Review` | ReviewID (SERIAL) | Chữ thường |

#### Bảng quan hệ nhiều-nhiều (Composite PK):
| Bảng | Primary Key |
|------|-------------|
| `BookCategory` | (BookID, CategoryID) |
| `CartItem` | (CartID, BookID) |
| `OrderItem` | (OrderID, BookID) |

### File: `Database/data_sample.sql`
- 70 sách với đầy đủ thông tin
- 6 danh mục
- 3 users (1 admin, 2 customer)
- 2 carts với items
- 3 vouchers
- Image URLs từ Cloudinary

---

## 3. JPA Entity Mapping

### A. Xử lý Reserved Words (Quoted Tables)
PostgreSQL yêu cầu escape tên bảng trùng với từ khóa SQL:

```java
// User.java
@Entity
@Table(name = "\"User\"")
public class User { ... }

// Order.java
@Entity
@Table(name = "\"Order\"")
public class Order { ... }

// Voucher.java - cột "End" là reserved word
@Column(name = "\"End\"")
private LocalDate end;
```

### B. Composite Primary Keys
Sử dụng `@EmbeddedId` cho bảng quan hệ nhiều-nhiều:

```java
// BookCategoryId.java
@Embeddable
public class BookCategoryId implements Serializable {
    @Column(name = "bookid")
    private Integer bookId;
    
    @Column(name = "categoryid")
    private Integer categoryId;
}

// BookCategory.java
@Entity
@Table(name = "bookcategory")
public class BookCategory {
    @EmbeddedId
    private BookCategoryId id;
    
    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "bookid")
    private Book book;
    
    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "categoryid")
    private Category category;
}
```

Tương tự cho `CartItem` và `OrderItem`.

### C. Các Entity đã cập nhật

| Entity | Thay đổi chính |
|--------|----------------|
| **User.java** | Table "\"User\"", role là String (không phải enum), userName length 100 |
| **Book.java** | imageUrl map với image_url, authorName/publisherName là String |
| **Order.java** | Table "\"Order\"", precision 15,2 cho BigDecimal |
| **Voucher.java** | PK là code (String), percent là Integer |
| **Category.java** | name thay vì categoryName |
| **Payment.java** | @ManyToOne với Order (1 order có nhiều payment) |
| **CartItem.java** | @EmbeddedId, @JsonProperty getters cho book info |
| **OrderItem.java** | @EmbeddedId, @JsonProperty getters cho book info |
| **Review.java** | @JsonProperty getters cho user/book info |

### D. Xóa các Entity không cần thiết
- **Admin.java**: Xóa @Entity, chuyển thành utility class
- **Customer.java**: Xóa @Entity, chuyển thành utility class
- *Lý do*: Role chỉ là field String trong User, không cần bảng riêng

---

## 4. Repository Interfaces

### BookRepository.java
```java
@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    
    // Tìm kiếm theo title hoặc author
    List<Book> findByTitleContainingIgnoreCaseOrAuthorNameContainingIgnoreCase(
        String title, String authorName);
    
    // Filter nâng cao với 9 parameters (Native Query)
    @Query(value = """
        SELECT DISTINCT b.* FROM book b
        LEFT JOIN bookcategory bc ON b.bookid = bc.bookid
        LEFT JOIN category c ON bc.categoryid = c.categoryid
        WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:authorName IS NULL OR LOWER(b.authorname) LIKE LOWER(CONCAT('%', :authorName, '%')))
          AND (:publisherName IS NULL OR LOWER(b.publishername) LIKE LOWER(CONCAT('%', :publisherName, '%')))
          AND (CAST(:minPrice AS NUMERIC) IS NULL OR b.price >= :minPrice)
          AND (CAST(:maxPrice AS NUMERIC) IS NULL OR b.price <= :maxPrice)
          AND (:categoryId IS NULL OR c.categoryid = :categoryId)
          AND (:publicationYear IS NULL OR b.publicationyear = :publicationYear)
          AND (:language IS NULL OR LOWER(b.language) LIKE LOWER(CONCAT('%', :language, '%')))
          AND (:status IS NULL OR LOWER(b.status) = LOWER(:status))
        """, nativeQuery = true)
    List<Book> filterBooks(...);
}
```

### Các Repository khác:
| Repository | Query Methods |
|------------|---------------|
| UserRepository | findByEmail, findByUserName, findByRole |
| CartItemRepository | findByCart_CartId, findByCart_CartIdAndBook_BookId |
| AddressRepository | findByUser_UserId, findByUser_UserIdAndIsDefaultTrue |
| AdminRepository | findByRole("admin") - extends JpaRepository<User, Integer> |
| CustomerRepository | findByRole("customer") - extends JpaRepository<User, Integer> |

---

## 5. Cấu Hình Hibernate

### File: `src/main/resources/application.properties`
```properties
# PostgreSQL Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore_clean
spring.datasource.username=postgres
spring.datasource.password=123456
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Settings
spring.jpa.hibernate.ddl-auto=none          # KHÔNG tự tạo/sửa bảng
spring.jpa.show-sql=true                     # Log SQL queries
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Naming Strategy - giữ nguyên tên trong @Table/@Column
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

---

## 6. Cấu Trúc File

```
Backend/
├── src/main/java/com/Project/Bookstore/
│   ├── Model/                          # [THUỘC NHIỆM VỤ]
│   │   ├── User.java                   # ✅ Đã mapping
│   │   ├── Book.java                   # ✅ Đã mapping + imageUrl
│   │   ├── Order.java                  # ✅ Đã mapping
│   │   ├── Category.java               # ✅ Đã mapping
│   │   ├── Cart.java                   # ✅ Đã mapping
│   │   ├── CartItem.java               # ✅ Composite PK
│   │   ├── CartItemId.java             # ✅ @Embeddable
│   │   ├── OrderItem.java              # ✅ Composite PK
│   │   ├── OrderItemId.java            # ✅ @Embeddable
│   │   ├── BookCategory.java           # ✅ Composite PK
│   │   ├── BookCategoryId.java         # ✅ @Embeddable
│   │   ├── Voucher.java                # ✅ Đã mapping
│   │   ├── Payment.java                # ✅ Đã mapping
│   │   ├── Review.java                 # ✅ Đã mapping
│   │   ├── Address.java                # ✅ Đã mapping
│   │   ├── Admin.java                  # ✅ Utility class (không phải Entity)
│   │   └── Customer.java               # ✅ Utility class (không phải Entity)
│   │
│   ├── Repository/                     # [THUỘC NHIỆM VỤ]
│   │   ├── BookRepository.java         # ✅ + filterBooks query
│   │   ├── UserRepository.java         # ✅ + findByEmail, findByRole
│   │   ├── CategoryRepository.java     # ✅
│   │   ├── CartRepository.java         # ✅
│   │   ├── CartItemRepository.java     # ✅ + finder methods
│   │   ├── OrderRepository.java        # ✅
│   │   ├── OrderItemRepository.java    # ✅
│   │   ├── BookCategoryRepository.java # ✅
│   │   ├── VoucherRepository.java      # ✅
│   │   ├── PaymentRepository.java      # ✅
│   │   ├── ReviewRepository.java       # ✅
│   │   ├── AddressRepository.java      # ✅ + findByUser_UserId
│   │   ├── AdminRepository.java        # ✅ findByRole
│   │   └── CustomerRepository.java     # ✅ findByRole
│   │
│   ├── Controller/                     # [KHÔNG THUỘC NHIỆM VỤ]
│   ├── Service/                        # [KHÔNG THUỘC NHIỆM VỤ - chỉ hỗ trợ]
│   └── Config/                         # [KHÔNG THUỘC NHIỆM VỤ]
│
├── src/main/resources/
│   └── application.properties          # [THUỘC NHIỆM VỤ] DB config
│
├── src_initial/                        # Backup code ban đầu (tham khảo)
│
└── Database/                           # [THUỘC NHIỆM VỤ]
    ├── table.sql                       # ✅ SQL Schema
    ├── data_sample.sql                 # ✅ Dữ liệu mẫu
    └── Image_url.sql                   # ✅ URLs ảnh sách
```

---

## 7. Test Links

### Books API (Filter/Search)
```
# Tất cả sách
GET http://localhost:8080/api/books

# Tìm kiếm theo keyword
GET http://localhost:8080/api/books/search?q=Nguyễn

# Filter theo author
GET http://localhost:8080/api/books/filter?authorName=Nguyễn Nhật Ánh

# Filter theo giá
GET http://localhost:8080/api/books/filter?minPrice=50000&maxPrice=100000

# Filter theo category
GET http://localhost:8080/api/books/filter?categoryId=1

# Filter kết hợp
GET http://localhost:8080/api/books/filter?keyword=tâm&minPrice=50000&language=Tiếng Việt
```

### Các API khác
```
GET http://localhost:8080/api/categories
GET http://localhost:8080/api/users
GET http://localhost:8080/api/users/2
GET http://localhost:8080/api/vouchers
GET http://localhost:8080/api/carts/2
```

---

## 8. Lưu Ý Kỹ Thuật

### PostgreSQL Case Sensitivity
- Tên bảng **KHÔNG** có ngoặc kép → lowercase (`book`, `category`)
- Tên bảng **CÓ** ngoặc kép → giữ nguyên (`"User"`, `"Order"`)

### Hibernate ddl-auto=none
- Schema được quản lý bởi `table.sql`
- Java entities phải match CHÍNH XÁC với schema
- Thay đổi schema → phải sửa cả SQL và Entity

### Composite Primary Keys
- Dùng `@EmbeddedId` + `@Embeddable` class
- `@MapsId` để map với column trong embedded id

### JSON Serialization
- `@JsonIgnore` trên relationship để tránh infinite loop
- `@JsonProperty` getters để expose thông tin cần thiết

---

