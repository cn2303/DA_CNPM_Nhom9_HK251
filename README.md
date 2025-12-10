# 📚 Web Bán Sách (Book Store App)

> **Dự án thương mại điện tử Full-stack**: Nền tảng mua sắm sách trực tuyến với trải nghiệm mượt mà, tích hợp thanh toán VNPAY và bảo mật JWT.

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 🛠 Công nghệ sử dụng

* **Backend:** Java 17, Spring Boot 3.x (Spring Data JPA, Spring Security, JWT).
* **Frontend:** ReactJS (Vite/Create React App), Axios, React Router Dom.
* **Database:** PostgreSQL.
* **Payment:** VNPAY Sandbox.

---

## 🚀 Hướng dẫn Cài đặt & Chạy ứng dụng

Để chạy được dự án này trên máy cá nhân, vui lòng làm theo các bước bên dưới.

### 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:
- [x] **Java Development Kit (JDK):** Phiên bản 17 trở lên.
- [x] **Node.js & npm:** Phiên bản Node 18+ (khuyến nghị).
- [x] **PostgreSQL:** Đã cài đặt và đang chạy service.

### 2. Cấu hình Database
Trước khi chạy Backend, bạn cần khởi tạo cơ sở dữ liệu:

1.  Mở **pgAdmin** (hoặc DBeaver/Terminal).
2.  Tạo một database mới có tên là: `bookstore_db`.
3.  Mở file cấu hình tại: `src/main/resources/application.properties` (trong thư mục Backend).
4.  Cập nhật thông tin kết nối (username/password) của bạn:

```properties
# Kết nối Database
spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore_db
spring.datasource.username=postgres
# THAY ĐỔI MẬT KHẨU CỦA BẠN TẠI ĐÂY
spring.datasource.password=your_password_here 
```

### 3. Khởi chạy Backend (Spring Boot)

Mở terminal tại thư mục gốc của **Backend**:

```bash
# Bước 1: Tải các thư viện (Dependencies)
./mvnw clean install  
# (Nếu dùng Windows CMD thì gõ: mvnw.cmd clean install)

# Bước 2: Chạy ứng dụng
./mvnw spring-boot:run
# (Nếu dùng Windows CMD thì gõ: mvnw.cmd spring-boot:run)
```

✅ **Thành công:** Backend sẽ khởi chạy tại: `http://localhost:8080`

### 4. Khởi chạy Frontend (ReactJS)

Mở một terminal mới tại thư mục gốc của **Frontend**:

```bash
# Bước 1: Cài đặt node modules
npm install

# Bước 2: Chạy ứng dụng (Chế độ Development)
npm run dev
# (Hoặc 'npm start' tùy vào file package.json của bạn)
```

✅ **Thành công:** Truy cập trang web tại: `http://localhost:5173` (hoặc port 3000)

---
