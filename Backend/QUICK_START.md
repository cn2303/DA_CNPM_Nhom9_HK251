# Quick Start - Backend API

## ✅ Hoàn thành các bước sau:

### 1. Cấu hình Database
- [x] Sửa `application.properties`:
  - Đổi `spring.jpa.hibernate.ddl-auto=update` → `none`
  - Database: `bookstore_db` trên port `5432`

### 2. Cập nhật Model Book
- [x] Map với bảng `books` trong PostgreSQL
- [x] Đổi ID type từ `Long` → `Integer` (khớp SERIAL)
- [x] Thêm tất cả các field: isbn, price, stock_quantity, description, status, author_name, publisher_name, url...

### 3. Cập nhật Repository & Service
- [x] BookRepository: Đổi `JpaRepository<Book, Long>` → `JpaRepository<Book, Integer>`
- [x] BookService: Cập nhật methods dùng `Integer` thay vì `Long`

### 4. Tạo Controller
- [x] Tạo package `Controller`
- [x] Tạo `BookController` với 2 endpoints:
  - `GET /api/books` - Lấy tất cả sách
  - `GET /api/books/{id}` - Lấy sách theo ID

### 5. Fix Compilation Errors
- [x] Sửa lỗi trong `OrderItemId.java` (equals method)

### 6. Build thành công
- [x] `mvn compile` → BUILD SUCCESS ✅

---

## 🚀 Chạy Backend

### Cách 1: Sử dụng Maven
```powershell
cd Backend
mvn spring-boot:run
```

### Cách 2: Trong IntelliJ IDEA
1. Mở `BookstoreApplication.java`
2. Click nút **Run** (tam giác xanh) hoặc nhấn **Shift+F10**

---

## 🧪 Test API

### Đảm bảo PostgreSQL đang chạy và có data
Database `bookstore_db` phải có bảng `books` với ít nhất 3 records:
- Clean Code
- Dune  
- Atomic Habits

### Test trong Browser
Mở browser và truy cập:
```
http://localhost:8080/api/books
```

### Test với curl (PowerShell)
```powershell
# Lấy tất cả sách
curl http://localhost:8080/api/books

# Lấy sách có ID = 1
curl http://localhost:8080/api/books/1
```

### Kết quả mong đợi
```json
[
  {
    "id": 1,
    "isbn": "978-0132350884",
    "title": "Clean Code",
    "price": 450000.00,
    "stockQuantity": 50,
    "authorName": "Robert C. Martin",
    "publisherName": "Prentice Hall",
    ...
  },
  {
    "id": 2,
    "title": "Dune",
    ...
  },
  {
    "id": 3,
    "title": "Atomic Habits",
    ...
  }
]
```

---

## 📋 Checklist Hoàn Thành

- ✅ Kết nối Spring Boot với PostgreSQL
- ✅ Map Book entity đúng với bảng database
- ✅ Tạo Repository, Service, Controller cho Book
- ✅ Build project thành công (không có compile errors)
- ✅ Tạo REST API endpoints

---

## 🎯 Tiếp theo

Sau khi test API thành công (`GET /api/books` trả về data):

1. **Bổ sung query methods** trong BookRepository:
   - Tìm theo title
   - Tìm theo author
   - Filter theo giá
   - Filter theo category

2. **Map quan hệ Book-Category** (Many-to-Many)

3. **Tạo Controllers khác**:
   - CategoryController
   - OrderController
   - UserController
   - CartController

4. **Kết nối Frontend với Backend**

---

## 🐛 Troubleshooting

### Backend không start được
- Kiểm tra PostgreSQL đã chạy chưa (port 5432)
- Kiểm tra username/password trong `application.properties`

### API trả về empty array []
- Database `bookstore_db` có data chưa?
- Chạy lại SQL script để insert data

### Port 8080 bị occupied
Thêm vào `application.properties`:
```
server.port=8081
```

---

**Status**: ✅ BACKEND READY TO TEST

