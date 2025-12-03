# Tổng Hợp Tích Hợp PostgreSQL

Tài liệu này tổng hợp chi tiết các thay đổi đã thực hiện đối với Backend để tích hợp thành công với cơ sở dữ liệu PostgreSQL (`bookstore_clean`).

**Ngày cập nhật:** 03/12/2025  
**Branch:** `feature/update-code`

---

## 1. Bối Cảnh & Vấn Đề Ban Đầu
Ban đầu, ứng dụng gặp lỗi "Whitelabel Error Page" (HTTP 500) khi truy cập các API. Nguyên nhân thực sự nằm sâu bên trong log:
1.  **Lỗi "Relation not found"**: Hibernate không tìm thấy bảng do sự khác biệt về cách đặt tên (Case Sensitivity) giữa Java và PostgreSQL.
2.  **Lỗi "Column not found"**: Các Entity trong Java khai báo các trường (field) không tồn tại trong file SQL (`table.sql`) mà bạn cung cấp.

---

## 2. Cấu Hình Hệ Thống (Configuration)
**File:** `src/main/resources/application.properties`

Chúng ta đã cập nhật cấu hình để kết nối PostgreSQL và quan trọng nhất là điều chỉnh cách Hibernate hiểu tên bảng.

```properties
# Kết nối Database
spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore_clean
spring.datasource.username=postgres
spring.datasource.password=123456

# Cấu hình Hibernate
# 'none': Ngăn Hibernate tự động sửa đổi cấu trúc DB (An toàn cho dữ liệu có sẵn)
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Chiến lược đặt tên (QUAN TRỌNG)
# Mặc định, Spring Boot sẽ chuyển CamelCase thành snake_case (ví dụ: User -> user).
# Cấu hình này bắt buộc Hibernate sử dụng CHÍNH XÁC tên được định nghĩa trong @Table.
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

---

## 3. Chỉnh Sửa Entity Mapping (Khắc phục lỗi 500)

Đây là phần phức tạp nhất. PostgreSQL xử lý tên bảng/cột rất đặc thù:
*   Tên **không nằm trong ngoặc kép** sẽ tự động chuyển thành **chữ thường** (lowercase).
*   Tên **nằm trong ngoặc kép** sẽ giữ nguyên **chữ hoa/thường** (Case Sensitive).

Dựa trên file `table.sql` và `data_sample.sql`, chúng ta đã phân loại và sửa đổi các Entity như sau:

### A. Nhóm Bảng Có Phân Biệt Hoa/Thường (Quoted Tables)
Trong SQL, các bảng này được tạo bằng dấu ngoặc kép, ví dụ: `CREATE TABLE "User" ...`.
*   **User.java**: `@Table(name = "\"User\"")`
*   **Order.java**: `@Table(name = "\"Order\"")`
*   **Voucher.java**: Bảng tên thường, nhưng cột `End` là từ khóa SQL nên phải để trong ngoặc: `@Column(name = "\"End\"")`.

### B. Nhóm Bảng Chữ Thường (Unquoted Tables)
Trong SQL, các bảng này không có ngoặc kép, nên PostgreSQL hiểu là chữ thường. Chúng ta đã sửa `@Table` trong Java về chữ thường để khớp.
*   **Book.java**: `@Table(name = "book")`
*   **Category.java**: `@Table(name = "category")`
*   **Cart.java**: `@Table(name = "cart")`
*   **Review.java**: `@Table(name = "review")`
*   ... và các bảng còn lại (`address`, `cartitem`, `orderitem`, `payment`, `role`, `orderaddress`, `orderstatushistory`).

### C. Đồng Bộ Hóa Schema (Xóa các trường dư thừa)
Sau khi sửa tên bảng, lỗi tiếp theo là "Column ... does not exist". Code Java chứa các trường mà trong Database thực tế không có. Chúng ta đã xóa chúng để ứng dụng chạy được:

1.  **Cart.java**:
    *   Đã xóa: `private LocalDateTime createdAt;`
    *   Đã xóa: `private LocalDateTime updatedAt;`
    *   *Lý do*: Bảng `cart` trong SQL chỉ có `CartID` và `UserID`.
2.  **Category.java**:
    *   Đã xóa: `private String description;`
    *   *Lý do*: Bảng `category` chỉ có `CategoryID` và `Name`.
3.  **CartItem.java** & **OrderItem.java**:
    *   Đã xóa: `private BigDecimal unitPrice;`
    *   *Lý do*: Giá tiền được lấy tham chiếu từ bảng `Book`, không lưu trực tiếp trong item (theo thiết kế của SQL hiện tại).

### D. Thêm Field Mới: `imageUrl`
Để hỗ trợ hiển thị ảnh sách từ Cloudinary:
*   **Book.java**: Thêm field `imageUrl` map với cột `image_url` trong database.
```java
@Column(name = "image_url", length = 500)
private String imageUrl;
```

---

## 4. API Filter Nâng Cao

### BookRepository - Full Filter Query
Hỗ trợ lọc sách với **9 parameters** (tất cả đều optional):

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `keyword` | String | Tìm trong title |
| `authorName` | String | Tên tác giả |
| `publisherName` | String | Nhà xuất bản |
| `minPrice` | BigDecimal | Giá tối thiểu |
| `maxPrice` | BigDecimal | Giá tối đa |
| `categoryId` | Integer | ID danh mục |
| `publicationYear` | Integer | Năm xuất bản |
| `language` | String | Ngôn ngữ |
| `status` | String | Trạng thái (Active/Inactive) |

### Native SQL Query
```sql
SELECT DISTINCT b.*
FROM book b
LEFT JOIN bookcategory bc ON b.bookid = bc.bookid
LEFT JOIN category c ON bc.categoryid = c.categoryid
WHERE (:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
  AND (:authorName IS NULL OR LOWER(b.authorname) LIKE LOWER(CONCAT('%', :authorName, '%')))
  AND (:publisherName IS NULL OR LOWER(b.publishername) LIKE LOWER(CONCAT('%', :publisherName, '%')))
  AND (:minPrice IS NULL OR b.price >= :minPrice)
  AND (:maxPrice IS NULL OR b.price <= :maxPrice)
  AND (:categoryId IS NULL OR c.categoryid = :categoryId)
  AND (:publicationYear IS NULL OR b.publicationyear = :publicationYear)
  AND (:language IS NULL OR LOWER(b.language) LIKE LOWER(CONCAT('%', :language, '%')))
  AND (:status IS NULL OR LOWER(b.status) = LOWER(:status))
```

---

## 5. Cấu Trúc File Backend Hiện Tại

```text
Backend/
├── src/main/resources/
│   └── application.properties       # [ĐÃ SỬA] Cấu hình DB & Naming Strategy
├── src/main/java/com/Project/Bookstore/
│   ├── BookstoreApplication.java    # File chạy chính (Main)
│   ├── Controller/
│   │   ├── BookController.java      # [ĐÃ SỬA] API: /api/books + /api/books/filter
│   │   ├── CartController.java      # API: /api/carts
│   │   ├── CategoryController.java  # API: /api/categories
│   │   ├── OrderController.java     # API: /api/orders
│   │   ├── UserController.java      # API: /api/users
│   │   └── ...
│   ├── Model/
│   │   ├── User.java                # [ĐÃ SỬA] Map với bảng "User"
│   │   ├── Order.java               # [ĐÃ SỬA] Map với bảng "Order"
│   │   ├── Book.java                # [ĐÃ SỬA] Thêm imageUrl, map với bảng book
│   │   ├── Category.java            # [ĐÃ SỬA] Xóa field 'description'
│   │   ├── Cart.java                # [ĐÃ SỬA] Xóa field 'createdAt', 'updatedAt'
│   │   ├── CartItem.java            # [ĐÃ SỬA] Xóa field 'unitPrice'
│   │   ├── OrderItem.java           # [ĐÃ SỬA] Xóa field 'unitPrice'
│   │   ├── Voucher.java             # [ĐÃ SỬA] Xử lý cột "End"
│   │   └── ...
│   ├── Repository/
│   │   ├── BookRepository.java      # [ĐÃ SỬA] Full filter query với 9 params
│   │   ├── UserRepository.java
│   │   └── ...
│   └── Service/
│       ├── BookService.java         # [ĐÃ SỬA] CRUD + Filter methods
│       ├── UserService.java
│       └── ...
├── add_image_url_column.sql         # Script SQL thêm cột image_url
├── POSTGRESQL_INTEGRATION_SUMMARY.md # File tài liệu này
└── pom.xml                          # Dependencies (PostgreSQL Driver)
```

---

## 6. API Endpoints

### Books API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/books` | Lấy tất cả sách |
| GET | `/api/books/{id}` | Lấy sách theo ID |
| GET | `/api/books/search?q=keyword` | Tìm kiếm theo title/author |
| GET | `/api/books/filter?...` | Lọc nâng cao (9 params) |
| POST | `/api/books` | Tạo sách mới |
| PUT | `/api/books/{id}` | Cập nhật sách |
| DELETE | `/api/books/{id}` | Xóa sách |
| PATCH | `/api/books/{id}/image` | Cập nhật URL ảnh |

### Các API khác
| Endpoint | Mô tả |
|----------|-------|
| `/api/users` | Quản lý người dùng |
| `/api/categories` | Danh mục sách |
| `/api/carts/{userId}` | Giỏ hàng theo user |
| `/api/orders` | Đơn hàng |
| `/api/reviews` | Đánh giá sách |
| `/api/vouchers` | Mã giảm giá |

---

## 7. Hướng Dẫn Test

### Khởi động Backend
```bash
cd Backend
mvn spring-boot:run
```

### Test Links (Click để mở)
- **Tất cả sách:** http://localhost:8080/api/books
- **Tìm kiếm:** http://localhost:8080/api/books/search?q=java
- **Lọc theo giá:** http://localhost:8080/api/books/filter?minPrice=50000&maxPrice=150000
- **Lọc theo category:** http://localhost:8080/api/books/filter?categoryId=1
- **Lọc kết hợp:** http://localhost:8080/api/books/filter?keyword=sach&minPrice=50000&status=Active
- **Danh mục:** http://localhost:8080/api/categories
- **Người dùng:** http://localhost:8080/api/users

### Frontend Integration
```jsx
// React component hiển thị ảnh sách
<img src={book.imageUrl} alt={book.title} />
```

---

## 8. Lưu Ý Quan Trọng

1. **CORS**: Đã cấu hình cho phép React frontend (`http://localhost:5173`) gọi API.
2. **Image URL**: Ảnh được lưu sẵn trên Cloudinary, backend chỉ đọc URL từ database.
3. **Case Sensitivity**: PostgreSQL xử lý tên bảng/cột lowercase mặc định, cần chú ý khi viết native query.
