# Hướng dẫn chạy Backend và test API

## Bước 1: Đảm bảo PostgreSQL đang chạy
- Mở pgAdmin
- Kiểm tra database `bookstore_db` đã có bảng `books` và dữ liệu

## Bước 2: Chạy Backend Spring Boot

### Cách 1: Chạy trong IntelliJ IDEA
1. Mở file `BookstoreApplication.java`
2. Click chuột phải và chọn **Run 'BookstoreApplication'**
3. Hoặc nhấn **Shift + F10**

### Cách 2: Chạy bằng Maven (trong terminal)
```bash
cd Backend
./mvnw spring-boot:run
```

## Bước 3: Kiểm tra Backend đã chạy
- Xem console, nếu thấy dòng:
  ```
  Started BookstoreApplication in X.XXX seconds
  ```
- Backend đã chạy thành công trên **http://localhost:8080**

## Bước 4: Test API

### Test bằng Browser
Mở trình duyệt và truy cập:
- **Lấy tất cả sách**: http://localhost:8080/api/books
- **Lấy sách theo ID**: http://localhost:8080/api/books/1

### Test bằng Postman hoặc Thunder Client
1. **GET** `http://localhost:8080/api/books`
   - Kết quả mong đợi: JSON array chứa danh sách sách (Clean Code, Dune, Atomic Habits)

2. **GET** `http://localhost:8080/api/books/1`
   - Kết quả mong đợi: JSON object của sách có ID = 1

### Test bằng curl (trong PowerShell)
```powershell
# Lấy tất cả sách
curl http://localhost:8080/api/books

# Lấy sách có ID = 1
curl http://localhost:8080/api/books/1
```

## Kết quả mong đợi

Khi gọi `GET /api/books`, bạn sẽ nhận được JSON tương tự:
```json
[
  {
    "id": 1,
    "isbn": "978-0132350884",
    "title": "Clean Code",
    "price": 450000,
    "stockQuantity": 50,
    "description": "A Handbook of Agile Software Craftsmanship",
    "status": "available",
    "namePage": 464,
    "language": "English",
    "nation": "USA",
    "size": "17.5 x 23.5 cm",
    "type": "Programming",
    "avgRating": 4.7,
    "authorName": "Robert C. Martin",
    "authorBio": "Robert Cecil Martin...",
    "publisherName": "Prentice Hall",
    "url": "https://example.com/clean-code.jpg"
  },
  {
    "id": 2,
    ...
  }
]
```

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin trong `application.properties`:
  - Database name: `bookstore_db`
  - Username: `postgres`
  - Password: `123456`
  - Port: `5432`

### Lỗi "table books does not exist"
- Chạy lại script SQL tạo bảng và insert data
- Đảm bảo đang truy cập đúng database `bookstore_db`

### Port 8080 đã được sử dụng
- Tắt ứng dụng đang chạy trên port 8080
- Hoặc thêm vào `application.properties`:
  ```
  server.port=8081
  ```

## Các thay đổi đã thực hiện

✅ **application.properties**: Đổi `ddl-auto` từ `update` sang `none`
✅ **Book.java**: Map đúng với bảng `books` trong database
✅ **BookRepository.java**: Đổi ID type từ `Long` sang `Integer`
✅ **BookService.java**: Cập nhật methods dùng `Integer` ID
✅ **BookController.java**: Tạo REST API endpoints cho Book

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/books | Lấy danh sách tất cả sách |
| GET | /api/books/{id} | Lấy thông tin 1 cuốn sách theo ID |

## Tiếp theo

Sau khi test API thành công, các bước tiếp theo:
1. Thêm các query tìm kiếm, filter sách
2. Map quan hệ N-N Book-Category
3. Tạo các Controller khác (Order, User, Cart, ...)
4. Kết nối Frontend với Backend

