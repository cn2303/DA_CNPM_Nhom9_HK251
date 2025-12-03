# Tổng Hợp Tích Hợp PostgreSQL

Tài liệu này tổng hợp chi tiết các thay đổi đã thực hiện đối với Backend để tích hợp thành công với cơ sở dữ liệu PostgreSQL (`bookstore_clean`).

## 1. Bối Cảnh & Vấn Đề Ban Đầu
Ban đầu, ứng dụng gặp lỗi "Whitelabel Error Page" (HTTP 500) khi truy cập các API. Nguyên nhân thực sự nằm sâu bên trong log:
1.  **Lỗi "Relation not found"**: Hibernate không tìm thấy bảng do sự khác biệt về cách đặt tên (Case Sensitivity) giữa Java và PostgreSQL.
2.  **Lỗi "Column not found"**: Các Entity trong Java khai báo các trường (field) không tồn tại trong file SQL (`table.sql`) mà bạn cung cấp.

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

## 4. Cấu Trúc File Backend Hiện Tại

Dưới đây là sơ đồ các file quan trọng trong thư mục `Backend` sau khi chỉnh sửa:

```text
Backend/
├── src/main/resources/
│   └── application.properties       # [ĐÃ SỬA] Cấu hình DB & Naming Strategy
├── src/main/java/com/Project/Bookstore/
│   ├── BookstoreApplication.java    # File chạy chính (Main)
│   ├── Controller/                  # Nơi nhận các API Request từ Frontend
│   │   ├── BookController.java      # API: /api/books
│   │   ├── CartController.java      # API: /api/carts
│   │   ├── CategoryController.java  # API: /api/categories
│   │   ├── OrderController.java     # API: /api/orders
│   │   ├── UserController.java      # API: /api/users
│   │   └── ...
│   ├── Model/                       # Các Class ánh xạ với bảng trong DB (Entity)
│   │   ├── User.java                # [ĐÃ SỬA] Map với bảng "User"
│   │   ├── Order.java               # [ĐÃ SỬA] Map với bảng "Order"
│   │   ├── Book.java                # [ĐÃ SỬA] Map với bảng book
│   │   ├── Category.java            # [ĐÃ SỬA] Xóa field 'description'
│   │   ├── Cart.java                # [ĐÃ SỬA] Xóa field 'createdAt', 'updatedAt'
│   │   ├── CartItem.java            # [ĐÃ SỬA] Xóa field 'unitPrice'
│   │   ├── OrderItem.java           # [ĐÃ SỬA] Xóa field 'unitPrice'
│   │   ├── Voucher.java             # [ĐÃ SỬA] Xử lý cột "End"
│   │   └── ...
│   ├── Repository/                  # Lớp giao tiếp dữ liệu (JPA Repository)
│   │   ├── BookRepository.java
│   │   ├── UserRepository.java
│   │   └── ...
│   └── Service/                     # Lớp xử lý nghiệp vụ (Business Logic)
│       ├── BookService.java
│       ├── UserService.java
│       └── ...
└── pom.xml                          # Quản lý thư viện (Đã có PostgreSQL Driver)
```

## 5. Hướng Dẫn Kiểm Tra (Testing)

Để đảm bảo hệ thống hoạt động ổn định, hãy thực hiện các bước sau:

1.  **Khởi động Database**: Đảm bảo PostgreSQL đang chạy và database `bookstore_clean` đã được import dữ liệu.
2.  **Chạy Backend**:
    *   Mở terminal tại thư mục `Backend`.
    *   Chạy lệnh: `mvnw spring-boot:run`
3.  **Test các API Endpoints** (Sử dụng Postman hoặc trình duyệt):

    *   **Sách (Books)**:
        *   URL: `http://localhost:8080/api/books`
        *   Kết quả mong đợi: Danh sách JSON các cuốn sách.

    *   **Danh mục (Categories)**:
        *   URL: `http://localhost:8080/api/categories`
        *   Kết quả mong đợi: Danh sách JSON các thể loại (không còn lỗi 500).

    *   **Người dùng (Users)**:
        *   URL: `http://localhost:8080/api/users`
        *   Kết quả mong đợi: Danh sách người dùng.

    *   **Giỏ hàng (Cart)**:
        *   URL: `http://localhost:8080/api/carts/1` (Thay 1 bằng ID user tồn tại)
        *   Kết quả mong đợi: Chi tiết giỏ hàng của user đó.

    *   **Kiểm tra hệ thống**:
        *   URL: `http://localhost:8080/api/test/info`
        *   Kết quả mong đợi: `Backend is running! Database: bookstore_clean...`
