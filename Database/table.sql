-- ====================================================
-- 1. NHÓM NGƯỜI DÙNG (USER, ADDRESS, CART)
-- ====================================================

-- 1. Bảng User
CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    BirthDate DATE,
    Role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER'
);

-- 2. Bảng Address
CREATE TABLE Address (
    AddressID SERIAL PRIMARY KEY,
    City VARCHAR(100),
    Ward VARCHAR(100),
    AddressDetail VARCHAR(255),
    Phone VARCHAR(20),
    IsDefault BOOLEAN DEFAULT FALSE,
    UserID INT NOT NULL,
    CONSTRAINT fk_address_user FOREIGN KEY (UserID) REFERENCES "User"(UserID)
);

-- 3. Bảng Cart
CREATE TABLE Cart (
    CartID SERIAL PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    CONSTRAINT fk_cart_user FOREIGN KEY (UserID) REFERENCES "User"(UserID)
);

-- ====================================================
-- 2. NHÓM SẢN PHẨM (CATEGORY, BOOK, REVIEW)
-- ====================================================

-- 4. Bảng Category
CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

-- 5. Bảng Book
CREATE TABLE Book (
    BookID SERIAL PRIMARY KEY,
    ISBN VARCHAR(20) UNIQUE,
    Title VARCHAR(255) NOT NULL,
    Price DECIMAL(15, 2) NOT NULL,
    PublicationYear INT,
    StockQuantity INT NOT NULL DEFAULT 0,
    Description TEXT,
    Status VARCHAR(50) DEFAULT 'Active',
    NamePage INT,
    Language VARCHAR(50),
    Nation VARCHAR(50),
    Size VARCHAR(50),
    Type VARCHAR(50),
    AvgRating DECIMAL(3, 2) DEFAULT 0.0,
    AuthorName VARCHAR(255),
    AuthorBio TEXT,
    PublisherName VARCHAR(255)
);

-- 6. Bảng trung gian BookCategory (Có ID riêng)
CREATE TABLE BookCategory (
    BookCategoryID SERIAL PRIMARY KEY,
    BookID INT NOT NULL,
    CategoryID INT NOT NULL,
    UNIQUE (BookID, CategoryID),
    CONSTRAINT fk_bc_book FOREIGN KEY (BookID) REFERENCES Book(BookID),
    CONSTRAINT fk_bc_category FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- 7. Bảng Review
CREATE TABLE Review (
    ReviewID SERIAL PRIMARY KEY,
    Comment TEXT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserID INT NOT NULL,
    BookID INT NOT NULL,
    CONSTRAINT fk_review_user FOREIGN KEY (UserID) REFERENCES "User"(UserID),
    CONSTRAINT fk_review_book FOREIGN KEY (BookID) REFERENCES Book(BookID)
);

-- 8. Bảng trung gian CartItem (Có ID riêng)
CREATE TABLE CartItem (
    CartItemID SERIAL PRIMARY KEY,
    CartID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    UNIQUE (CartID, BookID),
    CONSTRAINT fk_ci_cart FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    CONSTRAINT fk_ci_book FOREIGN KEY (BookID) REFERENCES Book(BookID)
);

-- ====================================================
-- 3. NHÓM VOUCHER & ĐƠN HÀNG (NGOẠI LỆ VOUCHER STRING)
-- ====================================================

-- 9. Bảng Voucher (NGOẠI LỆ: Dùng Code làm PK)
CREATE TABLE Voucher (
    Code VARCHAR(50) PRIMARY KEY, -- String làm khóa chính theo yêu cầu
    Description TEXT,
    Start DATE NOT NULL,
    "End" DATE NOT NULL,
    Quantity INT NOT NULL,
    MinOrderValue DECIMAL(15, 2),
    MaxOrderValue DECIMAL(15, 2),
    Percent INT,
    UserID INT NOT NULL, -- Admin tạo
    CONSTRAINT fk_voucher_user FOREIGN KEY (UserID) REFERENCES "User"(UserID)
);

-- 10. Bảng Order (Dùng VoucherCode string)
CREATE TABLE "Order" (
    OrderID SERIAL PRIMARY KEY,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod VARCHAR(50),
    CurrentStatus VARCHAR(50) DEFAULT 'Pending',
    ShippingFee DECIMAL(15, 2) DEFAULT 0,
    SubTotalPrice DECIMAL(15, 2) DEFAULT 0,
    DiscountTotal DECIMAL(15, 2) DEFAULT 0,
    GrandTotalPrice DECIMAL(15, 2) DEFAULT 0,
    UserID INT NOT NULL,
    VoucherCode VARCHAR(50), -- Link tới Voucher.Code
    CONSTRAINT fk_order_user FOREIGN KEY (UserID) REFERENCES "User"(UserID),
    CONSTRAINT fk_order_voucher FOREIGN KEY (VoucherCode) REFERENCES Voucher(Code)
);

-- 11. Bảng trung gian OrderItem (Có ID riêng)
CREATE TABLE OrderItem (
    OrderItemID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL,
    LineTotalPrice DECIMAL(15, 2) NOT NULL,
    UNIQUE (OrderID, BookID),
    CONSTRAINT fk_oi_order FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID),
    CONSTRAINT fk_oi_book FOREIGN KEY (BookID) REFERENCES Book(BookID)
);

-- 12. Bảng OrderAddress
CREATE TABLE OrderAddress (
    OrderAddrID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL UNIQUE,
    City VARCHAR(100),
    Ward VARCHAR(100),
    AddressDetail VARCHAR(255),
    Phone VARCHAR(20),
    CONSTRAINT fk_oa_order FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID)
);

-- 13. Bảng OrderStatusHistory
CREATE TABLE OrderStatusHistory (
    HistID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    Status VARCHAR(50),
    ChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_osh_order FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID)
);

-- 14. Bảng Payment
CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    TransactionCode VARCHAR(100),
    GatewayResponse TEXT,
    PaidAt TIMESTAMP,
    PayStatus VARCHAR(50),
    Gateway VARCHAR(50),
    Amount DECIMAL(15, 2),
    CONSTRAINT fk_payment_order FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID)
);