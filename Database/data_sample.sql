-- Xóa dữ liệu cũ (nếu có) để tránh lỗi trùng ID
TRUNCATE TABLE CartItem, OrderItem, Review, BookCategory, Payment, OrderStatusHistory, OrderAddress, "Order", Cart, Voucher, Book, Category, Address, "User" RESTART IDENTITY CASCADE;

-- 1. Tạo User (Admin & Sinh viên BK TP.HCM)
INSERT INTO "User" (UserName, Password, FullName, Email, Phone, Role) VALUES
('admin_hcmut', 'admin123', 'Admin Bách Khoa', 'admin@hcmut.edu.vn', '0909123456', 'ADMIN'),
('sv_bachkhoa', '123456', 'Lê Văn Tèo', 'teo.lv21@hcmut.edu.vn', '0918123456', 'CUSTOMER'), -- Mail đuôi hcmut
('sv_k21', '123456', 'Trần Thị Nở', 'no.tt21@hcmut.edu.vn', '0987654321', 'CUSTOMER');

-- 2. Tạo Category (Môn học theo kiểu HCMUT)
INSERT INTO Category (Name) VALUES
('Đại Cương & Toán'),        -- ID 1
('Cơ Sở Ngành KHMT'),        -- ID 2 (Khoa học máy tính)
('Công Nghệ Phần Mềm'),      -- ID 3
('Hệ Thống & Mạng'),         -- ID 4
('Điện - Điện Tử'),          -- ID 5
('Kỹ Năng & Ngoại Ngữ');     -- ID 6



INSERT INTO Book (Title, AuthorName, PublisherName, Price, StockQuantity, Description, PublicationYear, NamePage, Size, Type, Status) VALUES
-- --- NHÓM TOÁN & ĐẠI CƯƠNG (20 cuốn) ---
('Giải tích 1', 'Đỗ Công Khanh', 'NXB ĐHQG TP.HCM', 55000, 200, 'Tài liệu học tập chính thức cho SV Bách Khoa', 2021, 280, '16x24', 'Bìa mềm', 'Active'),
('Giải tích 2', 'Đỗ Công Khanh', 'NXB ĐHQG TP.HCM', 58000, 200, 'Phần tích phân bội và giải tích vector', 2021, 300, '16x24', 'Bìa mềm', 'Active'),
('Đại số tuyến tính', 'Bùi Xuân Diệu', 'NXB ĐHQG TP.HCM', 52000, 180, 'Ma trận, định thức và không gian vector', 2020, 250, '16x24', 'Bìa mềm', 'Active'),
('Vật lý A1 (Cơ - Nhiệt)', 'Phan Ngọc Dung', 'NXB ĐHQG TP.HCM', 60000, 300, 'Vật lý đại cương A1 cho khối kỹ thuật', 2022, 320, '16x24', 'Bìa mềm', 'Active'),
('Vật lý A2 (Điện - Từ)', 'Phan Ngọc Dung', 'NXB ĐHQG TP.HCM', 62000, 300, 'Vật lý đại cương A2 cho khối kỹ thuật', 2022, 340, '16x24', 'Bìa mềm', 'Active'),
('Bài tập Vật lý A1', 'Bộ môn Vật lý', 'NXB ĐHQG TP.HCM', 40000, 250, 'Tuyển tập bài tập và lời giải mẫu', 2022, 180, '16x24', 'Bìa mềm', 'Active'),
('Bài tập Vật lý A2', 'Bộ môn Vật lý', 'NXB ĐHQG TP.HCM', 42000, 250, 'Tuyển tập bài tập điện từ quang', 2022, 190, '16x24', 'Bìa mềm', 'Active'),
('Hóa đại cương A1', 'Phạm Hùng Việt', 'NXB ĐHQG TP.HCM', 50000, 150, 'Cấu tạo chất và nhiệt động hóa học', 2021, 260, '16x24', 'Bìa mềm', 'Active'),
('Xác suất thống kê', 'Nguyễn Đình Huy', 'NXB ĐHQG TP.HCM', 48000, 200, 'Xác suất thống kê ứng dụng trong kỹ thuật', 2020, 240, '16x24', 'Bìa mềm', 'Active'),
('Toán rời rạc', 'Nguyễn An Tế', 'NXB ĐHQG TP.HCM', 55000, 150, 'Logic, tập hợp và lý thuyết đồ thị', 2019, 280, '16x24', 'Bìa mềm', 'Active'),
('Pháp luật đại cương', 'ĐHQG TP.HCM', 'NXB Chính trị QG', 45000, 400, 'Kiến thức pháp luật cơ bản', 2023, 220, '14x20', 'Bìa mềm', 'Active'),
('Triết học Mác - Lênin', 'Bộ Giáo Dục', 'NXB Chính trị QG', 70000, 500, 'Giáo trình lý luận chính trị', 2023, 380, '14x20', 'Bìa mềm', 'Active'),
('Kinh tế chính trị Mác - Lênin', 'Bộ Giáo Dục', 'NXB Chính trị QG', 60000, 500, 'Giáo trình bắt buộc', 2023, 300, '14x20', 'Bìa mềm', 'Active'),
('Chủ nghĩa xã hội khoa học', 'Bộ Giáo Dục', 'NXB Chính trị QG', 55000, 500, 'Tài liệu học tập', 2023, 250, '14x20', 'Bìa mềm', 'Active'),
('Tư tưởng Hồ Chí Minh', 'Bộ Giáo Dục', 'NXB Chính trị QG', 50000, 500, 'Tài liệu học tập', 2023, 200, '14x20', 'Bìa mềm', 'Active'),
('Lịch sử Đảng CSVN', 'Bộ Giáo Dục', 'NXB Chính trị QG', 50000, 500, 'Tài liệu học tập', 2023, 220, '14x20', 'Bìa mềm', 'Active'),
('Tiếng Anh 1 (General English)', 'Oxford', 'NXB Trẻ', 120000, 100, 'Giáo trình tiếng Anh cơ bản', 2022, 150, '20x28', 'Bìa màu', 'Active'),
('Tiếng Anh 2 (General English)', 'Oxford', 'NXB Trẻ', 120000, 100, 'Giáo trình tiếng Anh nâng cao', 2022, 160, '20x28', 'Bìa màu', 'Active'),
('Nhập môn kỹ thuật (Intro to Eng)', 'HCMUT', 'NXB ĐHQG TP.HCM', 40000, 600, 'Giới thiệu về nghề kỹ sư', 2020, 150, '16x24', 'Bìa mềm', 'Active'),
('Kỹ năng mềm cho SV Kỹ thuật', 'HCMUT', 'NXB ĐHQG TP.HCM', 35000, 600, 'Làm việc nhóm và thuyết trình', 2020, 120, '16x24', 'Bìa mềm', 'Active'),

-- --- NHÓM KHMT & LẬP TRÌNH CƠ BẢN (15 cuốn) ---
('Nhập môn Điện toán (Intro to Computing)', 'Khoa KHMT', 'NXB ĐHQG TP.HCM', 45000, 300, 'Lập trình Python/C++ cơ bản', 2021, 200, '16x24', 'Bìa mềm', 'Active'),
('Kỹ thuật lập trình', 'Trần Hạnh Nhi', 'NXB ĐHQG TP.HCM', 65000, 200, 'Kỹ thuật xử lý mảng, con trỏ, struct', 2020, 280, '16x24', 'Bìa mềm', 'Active'),
('Cấu trúc dữ liệu và Giải thuật', 'Đinh Bá Tiến', 'NXB ĐHQG TP.HCM', 75000, 150, 'Linked List, Tree, Graph, Sorting', 2019, 350, '16x24', 'Bìa mềm', 'Active'),
('Lập trình Hướng đối tượng (OOP)', 'Huỳnh Lợi', 'NXB ĐHQG TP.HCM', 70000, 150, 'C++ và Java căn bản', 2020, 320, '16x24', 'Bìa mềm', 'Active'),
('Cơ sở dữ liệu (Database)', 'Đỗ Phúc', 'NXB ĐHQG TP.HCM', 68000, 120, 'Mô hình quan hệ và SQL', 2019, 300, '16x24', 'Bìa mềm', 'Active'),
('Hệ điều hành (OS)', 'Lê Thành Sách', 'NXB ĐHQG TP.HCM', 72000, 100, 'Quản lý tiến trình, bộ nhớ', 2021, 340, '16x24', 'Bìa mềm', 'Active'),
('Mạng máy tính (Computer Networks)', 'Lê Trung Quân', 'NXB ĐHQG TP.HCM', 75000, 100, 'Mô hình OSI/TCP-IP', 2021, 360, '16x24', 'Bìa mềm', 'Active'),
('Kiến trúc máy tính', 'Trần Ngọc Thịnh', 'NXB ĐHQG TP.HCM', 65000, 90, 'MIPS, Assembly và Vi xử lý', 2020, 280, '16x24', 'Bìa mềm', 'Active'),
('Lý thuyết đồ thị', 'Trần Đan Thư', 'NXB ĐHQG TP.HCM', 55000, 80, 'Các thuật toán trên đồ thị', 2019, 220, '16x24', 'Bìa mềm', 'Active'),
('Trí tuệ nhân tạo (AI)', 'Quản Thành Thơ', 'NXB ĐHQG TP.HCM', 85000, 60, 'Các thuật toán tìm kiếm và logic mờ', 2022, 380, '16x24', 'Bìa mềm', 'Active'),
('Nhập môn Học máy (Machine Learning)', 'Lê Hoài Bắc', 'NXB KHKT', 120000, 50, 'Hồi quy, Phân lớp và Clustering', 2023, 400, '19x27', 'Bìa cứng', 'Active'),
('Phân tích thiết kế hệ thống thông tin', 'Quản Thành Thơ', 'NXB ĐHQG TP.HCM', 70000, 80, 'UML và quy trình phần mềm', 2020, 300, '16x24', 'Bìa mềm', 'Active'),
('An toàn thông tin (Security)', 'Phạm Trần Vũ', 'NXB ĐHQG TP.HCM', 80000, 70, 'Mật mã học và an ninh mạng', 2022, 320, '16x24', 'Bìa mềm', 'Active'),
('Lập trình Java nâng cao', 'Trần Minh Thái', 'NXB Thông tin TT', 95000, 90, 'JSP, Servlet và Spring Framework', 2021, 400, '19x27', 'Bìa mềm', 'Active'),
('Lập trình Ứng dụng Di động', 'Trần Hạnh Nhi', 'NXB ĐHQG TP.HCM', 110000, 80, 'Android và Flutter', 2023, 420, '19x27', 'Bìa mềm', 'Active'),

-- --- NHÓM CÔNG NGHỆ & CHUYÊN SÂU (15 cuốn) ---
('Công nghệ phần mềm (Software Eng)', 'Trần Minh Triết', 'NXB ĐHQG TP.HCM', 78000, 60, 'Agile, Scrum và quy trình DevOps', 2021, 350, '16x24', 'Bìa mềm', 'Active'),
('Kiểm thử phần mềm (Testing)', 'Nguyễn Trọng Tài', 'NXB ĐHQG TP.HCM', 65000, 50, 'Software Testing cơ bản', 2020, 250, '16x24', 'Bìa mềm', 'Active'),
('Lập trình Web Frontend', 'F8 Official', 'NXB Công Nghệ', 150000, 100, 'HTML5, CSS3 và ReactJS', 2023, 450, '19x27', 'Bìa màu', 'Active'),
('Lập trình Web Backend', 'F8 Official', 'NXB Công Nghệ', 160000, 100, 'NodeJS, Express và MongoDB', 2023, 480, '19x27', 'Bìa màu', 'Active'),
('Clean Code (Mã sạch)', 'Robert C. Martin', 'NXB Thế Giới', 210000, 80, 'Bản dịch tiếng Việt', 2022, 500, '17x24', 'Bìa mềm', 'Active'),
('The Pragmatic Programmer', 'David Thomas', 'NXB Thế Giới', 250000, 50, 'Tư duy lập trình thực dụng', 2023, 550, '17x24', 'Bìa cứng', 'Active'),
('Head First Design Patterns', 'Eric Freeman', 'OReilly', 300000, 40, 'Sách ngoại văn - Mẫu thiết kế', 2021, 600, '20x25', 'Bìa mềm', 'Active'),
('Deep Learning with Python', 'Francois Chollet', 'Manning', 350000, 30, 'Sách ngoại văn - Học sâu', 2022, 500, '19x24', 'Bìa mềm', 'Active'),
('Thị giác máy tính (Computer Vision)', 'Lê Hoàng Thái', 'NXB ĐHQG TP.HCM', 120000, 40, 'Xử lý ảnh số và nhận dạng', 2023, 400, '19x27', 'Bìa cứng', 'Active'),
('Xử lý ngôn ngữ tự nhiên (NLP)', 'Đinh Điền', 'NXB ĐHQG TP.HCM', 115000, 40, 'Xử lý tiếng Việt với Python', 2022, 380, '19x27', 'Bìa mềm', 'Active'),
('Hệ quản trị CSDL nâng cao', 'Đỗ Phúc', 'NXB ĐHQG TP.HCM', 85000, 50, 'NoSQL và Big Data', 2021, 350, '16x24', 'Bìa mềm', 'Active'),
('Khai phá dữ liệu (Data Mining)', 'Võ Thị Ngọc Châu', 'NXB ĐHQG TP.HCM', 90000, 45, 'Các thuật toán khai phá tri thức', 2020, 320, '16x24', 'Bìa mềm', 'Active'),
('Điện toán đám mây (Cloud Computing)', 'Thoại Nam', 'NXB ĐHQG TP.HCM', 95000, 60, 'AWS và hạ tầng đám mây', 2022, 300, '16x24', 'Bìa mềm', 'Active'),
('Internet vạn vật (IoT)', 'Lê Thành Sách', 'NXB ĐHQG TP.HCM', 88000, 70, 'Kết nối thiết bị và lập trình nhúng', 2021, 280, '16x24', 'Bìa mềm', 'Active'),
('Blockchain cơ bản', 'Nguyễn Đức Dũng', 'NXB KHKT', 150000, 30, 'Công nghệ chuỗi khối ứng dụng', 2022, 350, '19x27', 'Bìa cứng', 'Active'),

-- --- NHÓM ĐIỆN TỬ & NGOẠI NGỮ & KHÁC (20 cuốn) ---
('Mạch điện 1', 'Nguyễn Thị Phương Loan', 'NXB ĐHQG TP.HCM', 60000, 100, 'Lý thuyết mạch điện', 2020, 250, '16x24', 'Bìa mềm', 'Active'),
('Mạch điện 2', 'Nguyễn Thị Phương Loan', 'NXB ĐHQG TP.HCM', 62000, 90, 'Mạch xoay chiều ba pha', 2020, 270, '16x24', 'Bìa mềm', 'Active'),
('Điện tử số', 'Huỳnh Hữu Thuận', 'NXB ĐHQG TP.HCM', 70000, 80, 'Thiết kế mạch logic', 2019, 300, '16x24', 'Bìa mềm', 'Active'),
('Vi xử lý', 'Vũ Đức Lung', 'NXB ĐHQG TP.HCM', 75000, 80, 'Lập trình Assembly cho vi điều khiển', 2020, 320, '16x24', 'Bìa mềm', 'Active'),
('Kỹ thuật đo lường', 'Lê Tiến Dũng', 'NXB ĐHQG TP.HCM', 65000, 60, 'Cảm biến và thiết bị đo', 2018, 280, '16x24', 'Bìa mềm', 'Active'),
('Lý thuyết điều khiển tự động', 'Huỳnh Thái Hoàng', 'NXB ĐHQG TP.HCM', 85000, 50, 'Điều khiển PID và hệ thống', 2021, 400, '19x27', 'Bìa mềm', 'Active'),
('Robot công nghiệp', 'Nguyễn Đức Thành', 'NXB KHKT', 120000, 40, 'Cánh tay robot và động học', 2022, 350, '19x27', 'Bìa cứng', 'Active'),
('English for IT 1', 'Pearson', 'Pearson', 150000, 100, 'Tiếng Anh chuyên ngành CNTT', 2021, 200, '20x25', 'Bìa mềm', 'Active'),
('English for IT 2', 'Pearson', 'Pearson', 160000, 100, 'Tiếng Anh chuyên ngành nâng cao', 2021, 220, '20x25', 'Bìa mềm', 'Active'),
('IELTS Practice Tests Plus', 'Pearson', 'Pearson', 180000, 200, 'Luyện thi IELTS', 2023, 300, '20x28', 'Bìa mềm', 'Active'),
('Hackers IELTS Reading', 'Hackers', 'NXB Thế Giới', 190000, 150, 'Luyện kỹ năng đọc', 2022, 350, '20x28', 'Bìa mềm', 'Active'),
('Hackers IELTS Listening', 'Hackers', 'NXB Thế Giới', 190000, 150, 'Luyện kỹ năng nghe', 2022, 350, '20x28', 'Bìa mềm', 'Active'),
('Đắc Nhân Tâm', 'Dale Carnegie', 'NXB Tổng hợp TP.HCM', 80000, 300, 'Nghệ thuật ứng xử', 2022, 300, '14x20', 'Bìa mềm', 'Active'),
('Nhà Giả Kim', 'Paulo Coelho', 'NXB Hội Nhà Văn', 75000, 250, 'Hành trình theo đuổi ước mơ', 2021, 220, '14x20', 'Bìa mềm', 'Active'),
('Cà phê cùng Tony', 'Tony Buổi Sáng', 'NXB Trẻ', 85000, 200, 'Bài học cho người trẻ', 2020, 250, '14x20', 'Bìa mềm', 'Active'),
('Trên đường băng', 'Tony Buổi Sáng', 'NXB Trẻ', 85000, 200, 'Kỹ năng sống và làm việc', 2020, 280, '14x20', 'Bìa mềm', 'Active'),
('Tuổi trẻ đáng giá bao nhiêu', 'Rosie Nguyễn', 'NXB Nhã Nam', 80000, 200, 'Định hướng bản thân', 2019, 280, '14x20', 'Bìa mềm', 'Active'),
('Búp sen xanh', 'Sơn Tùng', 'NXB Kim Đồng', 60000, 100, 'Tiểu thuyết về Bác Hồ', 2020, 300, '14x20', 'Bìa mềm', 'Active'),
('Cho tôi xin một vé đi tuổi thơ', 'Nguyễn Nhật Ánh', 'NXB Trẻ', 70000, 150, 'Truyện dài', 2021, 200, '14x20', 'Bìa mềm', 'Active'),
('Mắt biếc', 'Nguyễn Nhật Ánh', 'NXB Trẻ', 80000, 150, 'Truyện dài lãng mạn', 2022, 250, '14x20', 'Bìa mềm', 'Active');


INSERT INTO BookCategory (BookID, CategoryID) VALUES
-- Toán & Đại Cương (ID 1-20)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (10, 2), -- Toán rời rạc vừa là Toán vừa KHMT
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1),
(17, 6), (18, 6), -- Tiếng Anh
(19, 6), (20, 6), -- Kỹ năng

-- KHMT & Lập trình cơ bản (ID 21-35)
(21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (26, 4), -- OS thuộc Hệ thống
(27, 4), -- Mạng thuộc Hệ thống
(28, 4), -- Kiến trúc máy tính
(29, 2), (30, 2), (31, 2),
(32, 3), -- Phân tích thiết kế thuộc CNPM
(33, 4), -- Security
(34, 2), (35, 2),

-- Công nghệ & Chuyên sâu (ID 36-50)
(36, 3), (37, 3), (38, 2), (39, 2),
(40, 3), (41, 3), (42, 3), (43, 2), (44, 2), (45, 2),
(46, 2), (47, 2), (48, 4), (49, 4), (50, 4),

-- Điện tử & Khác (ID 51-70)
(51, 5), (52, 5), (53, 5), (54, 5), (55, 5), (56, 5), (57, 5),
(58, 6), (59, 6), (60, 6), (61, 6), (62, 6),
(63, 6), (64, 6), (65, 6), (66, 6), (67, 6), (68, 6), (69, 6), (70, 6);



-- Address mẫu
INSERT INTO Address (City, Ward, AddressDetail, Phone, IsDefault, UserID) VALUES
('TP.HCM', 'Thủ Đức', 'KTX Khu A, ĐHQG', '0918123456', TRUE, 2),
('TP.HCM', 'Bình Thạnh', '123 Xô Viết Nghệ Tĩnh', '0987654321', TRUE, 3);

-- Cart mẫu
INSERT INTO Cart (UserID) VALUES
(2),
(3);

-- CartItem mẫu
INSERT INTO CartItem (CartID, BookID, Quantity) VALUES
(1, 23, 1),
(1, 25, 2),
(2, 40, 1);
