-- =========================================================
-- 0. Clear old DB
-- =========================================================

DO $$
BEGIN
    BEGIN
        DROP TRIGGER IF EXISTS trg_review_update_avg_rating ON Review;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    BEGIN
        DROP TRIGGER IF EXISTS trg_orderitem_update_stock ON OrderItem;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    BEGIN
        DROP TRIGGER IF EXISTS trg_orders_status_update_stock ON Orders;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    BEGIN
        DROP TRIGGER IF EXISTS trg_create_cart_for_user ON users;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;
END;
$$;

DROP FUNCTION IF EXISTS fn_update_book_avg_rating();
DROP FUNCTION IF EXISTS fn_update_stock_on_orderitem();
DROP FUNCTION IF EXISTS fn_update_stock_on_order_status();
DROP FUNCTION IF EXISTS fn_create_cart_for_user();
DROP FUNCTION IF EXISTS fn_search_books(
    VARCHAR, NUMERIC, NUMERIC, VARCHAR, VARCHAR
);

DROP TABLE IF EXISTS CartItem, OrderItem, Review, BookCategory,
                     Payment, OrderAddress, Orders,
                     Cart, Voucher, Book, Category,
                     Address, users
CASCADE;

-- =========================================================
-- 1. NHÓM NGƯỜI DÙNG (USER, ADDRESS, CART)
-- =========================================================

CREATE TABLE users (
    UserID    SERIAL PRIMARY KEY,
    Username  VARCHAR(100) NOT NULL UNIQUE,
    Password  VARCHAR(255) NOT NULL,
    Fullname  VARCHAR(100) NOT NULL,
    Email     VARCHAR(100) NOT NULL UNIQUE,
    Phone     VARCHAR(20),
    birthdate DATE,
    ROLE      VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER'
);

CREATE TABLE Address (
    AddressID     SERIAL PRIMARY KEY,
    Ward          VARCHAR(100),
    City          VARCHAR(100),
    addressdetail VARCHAR(255),
    Phone         VARCHAR(20),
    isdefault     BOOLEAN DEFAULT FALSE,
    UserID        INT NOT NULL,
    CONSTRAINT fk_address_user
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE Cart (
    CartID SERIAL PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    CONSTRAINT fk_cart_user
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- =========================================================
-- 2. NHÓM SẢN PHẨM (CATEGORY, BOOK, REVIEW)
-- =========================================================

CREATE TABLE Category (
    CategoryID SERIAL PRIMARY KEY,
    Name       VARCHAR(100) NOT NULL
);

CREATE TABLE Book (
    bookID          SERIAL PRIMARY KEY,
    ISBN            VARCHAR(20) UNIQUE,
    Title           VARCHAR(255) NOT NULL,
    Language        VARCHAR(50),
    authorname      VARCHAR(255),
    publishername   VARCHAR(255),
    Description     TEXT,
    Status          VARCHAR(20) NOT NULL DEFAULT 'Active',
    numpage         INT,
    Nation          VARCHAR(50),
    size            VARCHAR(50),
    Type            VARCHAR(50),
    Price           NUMERIC(15, 2) NOT NULL,
    stockquantity   INT NOT NULL DEFAULT 0,
    publicationyear INT,
    Avgrating       NUMERIC(3, 2) DEFAULT 0.0,
    image_url       VARCHAR(255),
    CONSTRAINT chk_book_status
        CHECK (Status IN ('Active', 'Inactive'))
);

CREATE TABLE BookCategory (
    BookID     INT NOT NULL,
    CategoryID INT NOT NULL,
    PRIMARY KEY (BookID, CategoryID),
    CONSTRAINT fk_bc_book
        FOREIGN KEY (BookID) REFERENCES Book(bookID),
    CONSTRAINT fk_bc_category
        FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

CREATE TABLE Review (
    ReviewID  SERIAL PRIMARY KEY,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Comment   TEXT,
    Rating    INT CHECK (Rating >= 1 AND Rating <= 5),
    UserID    INT NOT NULL,
    BookID    INT NOT NULL,
    CONSTRAINT fk_review_user
        FOREIGN KEY (UserID) REFERENCES users(UserID),
    CONSTRAINT fk_review_book
        FOREIGN KEY (BookID) REFERENCES Book(bookID)
);

CREATE TABLE CartItem (
    CartID   INT NOT NULL,
    BookID   INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (CartID, BookID),
    CONSTRAINT fk_ci_cart
        FOREIGN KEY (CartID) REFERENCES Cart(CartID),
    CONSTRAINT fk_ci_book
        FOREIGN KEY (BookID) REFERENCES Book(bookID)
);

-- =========================================================
-- 3. VOUCHER & ĐƠN HÀNG 
-- =========================================================

CREATE TABLE Voucher (
    Code          VARCHAR(50) PRIMARY KEY,
    startdate     DATE NOT NULL,
    enddate       DATE NOT NULL,
    Percent       INT,
    maxordervalue NUMERIC(15, 2),
    minordervalue NUMERIC(15, 2),
    Quantity      INT NOT NULL,
    Description   TEXT,
    UserID        INT NOT NULL,
    CONSTRAINT fk_voucher_user
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE OrderAddress (
    orderaddrID   SERIAL PRIMARY KEY,
    City          VARCHAR(100),
    Ward          VARCHAR(100),
    addressdetail VARCHAR(255),
    Phone         VARCHAR(20)
);

CREATE TABLE Orders (
    OrderID         SERIAL PRIMARY KEY,
    currentstatus   VARCHAR(20) NOT NULL DEFAULT 'Pending',
    orderdate       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paymentmethod   VARCHAR(20) NOT NULL,
    shippingfee     NUMERIC(15, 2) DEFAULT 0,
    subtotalprice   NUMERIC(15, 2) DEFAULT 0,
    discounttotal   NUMERIC(15, 2) DEFAULT 0,
    grandtotalprice NUMERIC(15, 2) DEFAULT 0,
    UserID          INT NOT NULL,
    orderaddressid  INT NOT NULL,
    vouchercode     VARCHAR(50),
    CONSTRAINT fk_order_user
        FOREIGN KEY (UserID) REFERENCES users(UserID),
    CONSTRAINT fk_order_voucher
        FOREIGN KEY (vouchercode) REFERENCES Voucher(Code),
    CONSTRAINT fk_order_orderaddress
        FOREIGN KEY (orderaddressid) REFERENCES OrderAddress(orderaddrID),
    CONSTRAINT chk_orders_status
        CHECK (currentstatus IN ('Pending','Processing','Completed','Cancelled')),
    CONSTRAINT chk_orders_payment_method
        CHECK (paymentmethod IN ('COD','VNPAY'))
);

CREATE TABLE OrderItem (
    OrderID        INT NOT NULL,
    BookID         INT NOT NULL,
    Quantity       INT NOT NULL,
    linetotalprice NUMERIC(15, 2) NOT NULL,
    PRIMARY KEY (OrderID, BookID),
    CONSTRAINT fk_oi_order
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT fk_oi_book
        FOREIGN KEY (BookID) REFERENCES Book(bookID)
);

CREATE TABLE Payment (
    PaymentID       SERIAL PRIMARY KEY,
    OrderID         INT NOT NULL,
    transactioncode VARCHAR(100),
    paidat          TIMESTAMP,
    paystatus       VARCHAR(50),
    Amount          NUMERIC(15, 2),
    Gateway         VARCHAR(50),
    gatewayresponse TEXT,
    CONSTRAINT fk_payment_order
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- =========================================================
-- 4. TRIGGER & FUNCTION HỆ THỐNG
-- =========================================================

-- 4.1. REVIEW → CẬP NHẬT Avgrating CỦA BOOK
CREATE OR REPLACE FUNCTION fn_update_book_avg_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_book_id INT;
    v_avg     NUMERIC(3,2);
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_book_id := NEW.BookID;
    ELSIF TG_OP = 'DELETE' THEN
        v_book_id := OLD.BookID;
    ELSE
        -- Nếu đổi sách trong review
        IF NEW.BookID <> OLD.BookID THEN
            SELECT AVG(Rating)::NUMERIC(3,2)
            INTO v_avg
            FROM Review
            WHERE BookID = OLD.BookID;

            UPDATE Book
            SET Avgrating = COALESCE(v_avg, 0)
            WHERE bookID = OLD.BookID;

            v_book_id := NEW.BookID;
        ELSE
            v_book_id := NEW.BookID;
        END IF;
    END IF;

    SELECT AVG(Rating)::NUMERIC(3,2)
    INTO v_avg
    FROM Review
    WHERE BookID = v_book_id;

    UPDATE Book
    SET Avgrating = COALESCE(v_avg, 0)
    WHERE bookID = v_book_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_update_avg_rating
AFTER INSERT OR UPDATE OR DELETE ON Review
FOR EACH ROW
EXECUTE FUNCTION fn_update_book_avg_rating();


-- 4.2. ORDERITEM THAY ĐỔI → CẬP NHẬT stockquantity
--     (CHECK KHÔNG CHO ÂM KHO)
CREATE OR REPLACE FUNCTION fn_update_stock_on_orderitem()
RETURNS TRIGGER AS $$
DECLARE
    v_status_new    VARCHAR(20);
    v_status_old    VARCHAR(20);
    v_current_stock INT;
    v_diff          INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT currentstatus INTO v_status_new
        FROM Orders WHERE OrderID = NEW.OrderID;

        IF v_status_new IS NULL THEN
            RAISE EXCEPTION 'Order % not found', NEW.OrderID;
        END IF;

        IF v_status_new <> 'Cancelled' THEN
            SELECT stockquantity INTO v_current_stock
            FROM Book WHERE bookID = NEW.BookID;

            IF v_current_stock < NEW.Quantity THEN
                RAISE EXCEPTION 'Không đủ hàng trong kho! Hiện có: %, Cần: %',
                    v_current_stock, NEW.Quantity;
            END IF;

            UPDATE Book
            SET stockquantity = stockquantity - NEW.Quantity
            WHERE bookID = NEW.BookID;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        SELECT currentstatus INTO v_status_new
        FROM Orders WHERE OrderID = NEW.OrderID;

        SELECT currentstatus INTO v_status_old
        FROM Orders WHERE OrderID = OLD.OrderID;

        -- Cùng một OrderID + BookID, chỉ đổi Quantity
        IF NEW.OrderID = OLD.OrderID AND NEW.BookID = OLD.BookID THEN
            IF v_status_new <> 'Cancelled' THEN
                v_diff := NEW.Quantity - OLD.Quantity;

                IF v_diff > 0 THEN
                    SELECT stockquantity INTO v_current_stock
                    FROM Book WHERE bookID = NEW.BookID;

                    IF v_current_stock < v_diff THEN
                        RAISE EXCEPTION
                            'Không đủ hàng để cập nhật thêm! Hiện có: %, Cần thêm: %',
                            v_current_stock, v_diff;
                    END IF;
                END IF;

                UPDATE Book
                SET stockquantity = stockquantity - v_diff
                WHERE bookID = NEW.BookID;
            END IF;

        ELSE
            -- Thay đổi OrderID hoặc BookID
            IF v_status_old <> 'Cancelled' THEN
                UPDATE Book
                SET stockquantity = stockquantity + OLD.Quantity
                WHERE bookID = OLD.BookID;
            END IF;

            IF v_status_new <> 'Cancelled' THEN
                SELECT stockquantity INTO v_current_stock
                FROM Book WHERE bookID = NEW.BookID;

                IF v_current_stock < NEW.Quantity THEN
                    RAISE EXCEPTION
                        'Sách mới không đủ hàng trong kho! Hiện có: %, Cần: %',
                        v_current_stock, NEW.Quantity;
                END IF;

                UPDATE Book
                SET stockquantity = stockquantity - NEW.Quantity
                WHERE bookID = NEW.BookID;
            END IF;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        SELECT currentstatus INTO v_status_old
        FROM Orders WHERE OrderID = OLD.OrderID;

        IF v_status_old <> 'Cancelled' THEN
            UPDATE Book
            SET stockquantity = stockquantity + OLD.Quantity
            WHERE bookID = OLD.BookID;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orderitem_update_stock
AFTER INSERT OR UPDATE OR DELETE ON OrderItem
FOR EACH ROW
EXECUTE FUNCTION fn_update_stock_on_orderitem();


-- 4.3. ĐỔI currentstatus CỦA ORDERS → CẬP NHẬT STOCK
--   - (bất kỳ trừ Cancelled) → Cancelled : +stock
--   - Cancelled → trạng thái khác       : -stock
CREATE OR REPLACE FUNCTION fn_update_stock_on_order_status()
RETURNS TRIGGER AS $$
DECLARE
    rec RECORD;
BEGIN
    IF NEW.currentstatus = OLD.currentstatus THEN
        RETURN NULL;
    END IF;

    -- Chuyển từ khác Cancelled sang Cancelled -> trả lại stock
    IF OLD.currentstatus <> 'Cancelled'
       AND NEW.currentstatus = 'Cancelled' THEN

        FOR rec IN
            SELECT BookID, Quantity
            FROM OrderItem
            WHERE OrderID = NEW.OrderID
        LOOP
            UPDATE Book
            SET stockquantity = stockquantity + rec.Quantity
            WHERE bookID = rec.BookID;
        END LOOP;

    -- Chuyển từ Cancelled sang trạng thái khác -> trừ stock
    ELSIF OLD.currentstatus = 'Cancelled'
          AND NEW.currentstatus <> 'Cancelled' THEN

        FOR rec IN
            SELECT BookID, Quantity
            FROM OrderItem
            WHERE OrderID = NEW.OrderID
        LOOP
            UPDATE Book
            SET stockquantity = stockquantity - rec.Quantity
            WHERE bookID = rec.BookID;
        END LOOP;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_status_update_stock
AFTER UPDATE OF currentstatus ON Orders
FOR EACH ROW
EXECUTE FUNCTION fn_update_stock_on_order_status();


-- 4.4. TỰ TẠO CART CHO USER (1 USER 1 CART)
CREATE OR REPLACE FUNCTION fn_create_cart_for_user()
RETURNS TRIGGER AS $$
BEGIN
    BEGIN
        INSERT INTO Cart(UserID) VALUES (NEW.UserID);
    EXCEPTION WHEN unique_violation THEN
        -- Nếu đã có cart rồi thì bỏ qua
        NULL;
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_cart_for_user
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION fn_create_cart_for_user();


-- 4.5. HÀM SEARCH SÁCH THEO TÊN, GIÁ, THỂ LOẠI
CREATE OR REPLACE FUNCTION fn_search_books(
    p_keyword   VARCHAR,
    p_price_min NUMERIC,
    p_price_max NUMERIC,
    p_cat_name  VARCHAR,
    p_sort      VARCHAR
)
RETURNS TABLE (
    BookID        INT,
    Title         VARCHAR,
    AuthorName    VARCHAR,
    PublisherName VARCHAR,
    Price         NUMERIC,
    StockQuantity INT,
    Status        VARCHAR,
    AvgRating     NUMERIC(3,2),
    ImageUrl      VARCHAR,
    Categories    TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.bookID,
        b.Title,
        b.authorname      AS AuthorName,
        b.publishername   AS PublisherName,
        b.Price,
        b.stockquantity   AS StockQuantity,
        b.Status,
        b.Avgrating       AS AvgRating,
        b.image_url       AS ImageUrl,
        STRING_AGG(c.Name, ', ' ORDER BY c.Name) AS Categories
    FROM Book b
    LEFT JOIN BookCategory bc ON b.bookID = bc.BookID
    LEFT JOIN Category     c  ON bc.CategoryID = c.CategoryID
    WHERE
        (p_keyword IS NULL OR p_keyword = '' OR
         b.Title ILIKE '%' || p_keyword || '%')
        AND (p_price_min IS NULL OR b.Price >= p_price_min)
        AND (p_price_max IS NULL OR b.Price <= p_price_max)
        AND (p_cat_name IS NULL OR p_cat_name = '' OR
             c.Name ILIKE '%' || p_cat_name || '%')
    GROUP BY b.bookID
    ORDER BY
        CASE WHEN p_sort = 'PRICE_ASC'  THEN b.Price END ASC,
        CASE WHEN p_sort = 'PRICE_DESC' THEN b.Price END DESC,
        CASE WHEN p_sort IS NULL OR p_sort = 'DEFAULT'
             THEN b.Title END ASC;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- 5. DỮ LIỆU MẪU (40 BOOK, STATUS, IMAGE_URL)
-- =========================================================

-- 5.1 USERS
INSERT INTO users (Username, Password, Fullname, Email, Phone, ROLE) VALUES
('admin_hcmut', 'admin123', 'Admin Bách Khoa', 'admin@hcmut.edu.vn', '0909123456', 'ADMIN'),
('sv_bachkhoa', '123456',   'Lê Văn Tèo',      'teo.lv21@hcmut.edu.vn', '0918123456', 'CUSTOMER'),
('sv_k21',      '123456',   'Trần Thị Nở',     'no.tt21@hcmut.edu.vn',  '0987654321', 'CUSTOMER');

-- 5.2 CATEGORY
INSERT INTO Category (Name) VALUES
('Đại Cương & Toán'),        -- 1
('Cơ Sở Ngành KHMT'),        -- 2
('Công Nghệ Phần Mềm'),      -- 3
('Hệ Thống & Mạng'),         -- 4
('Điện - Điện Tử'),          -- 5
('Kỹ Năng & Ngoại Ngữ');     -- 6

-- 5.3 BOOK (40 CUỐN)
INSERT INTO Book
(Title, authorname, publishername, Price, stockquantity,
 Description, publicationyear, numpage, size, Type, Status, image_url)
VALUES
-- --- NHÓM TOÁN & ĐẠI CƯƠNG (20 cuốn) ---
('Giải tích 1', 'Đỗ Công Khanh', 'NXB ĐHQG TP.HCM', 55000, 200,
 'Tài liệu học tập chính thức cho SV Bách Khoa', 2021, 280, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'),
('Giải tích 2', 'Đỗ Công Khanh', 'NXB ĐHQG TP.HCM', 58000, 200,
 'Phần tích phân bội và giải tích vector', 2021, 300, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('Đại số tuyến tính', 'Bùi Xuân Diệu', 'NXB ĐHQG TP.HCM', 52000, 180,
 'Ma trận, định thức và không gian vector', 2020, 250, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Vật lý A1 (Cơ - Nhiệt)', 'Phan Ngọc Dung', 'NXB ĐHQG TP.HCM', 60000, 300,
 'Vật lý đại cương A1 cho khối kỹ thuật', 2022, 320, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Vật lý A2 (Điện - Từ)', 'Phan Ngọc Dung', 'NXB ĐHQG TP.HCM', 62000, 300,
 'Vật lý đại cương A2 cho khối kỹ thuật', 2022, 340, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'),
('Bài tập Vật lý A1', 'Bộ môn Vật lý', 'NXB ĐHQG TP.HCM', 40000, 250,
 'Tuyển tập bài tập và lời giải mẫu', 2022, 180, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/btvl1_aqr9yf.png'),
('Bài tập Vật lý A2', 'Bộ môn Vật lý', 'NXB ĐHQG TP.HCM', 42000, 250,
 'Tuyển tập bài tập điện từ quang', 2022, 190, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/btvl2_ueghlv.png'),
('Hóa đại cương A1', 'Phạm Hùng Việt', 'NXB ĐHQG TP.HCM', 50000, 150,
 'Cấu tạo chất và nhiệt động hóa học', 2021, 260, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/hdc_my4z4z.png'),
('Xác suất thống kê', 'Nguyễn Đình Huy', 'NXB ĐHQG TP.HCM', 48000, 200,
 'Xác suất thống kê ứng dụng trong kỹ thuật', 2020, 240, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/xstk_lbjtsi.png'),
('Toán rời rạc', 'Nguyễn An Tế', 'NXB ĐHQG TP.HCM', 55000, 150,
 'Logic, tập hợp và lý thuyết đồ thị', 2019, 280, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/trr_pz7f2s.png'),
('Pháp luật đại cương', 'ĐHQG TP.HCM', 'NXB Chính trị QG', 45000, 400,
 'Kiến thức pháp luật cơ bản', 2023, 220, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/pldc_eaaqje.png'),
('Triết học Mác - Lênin', 'Bộ Giáo Dục', 'NXB Chính trị QG', 70000, 500,
 'Giáo trình lý luận chính trị', 2023, 380, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741851/triet_uony7j.png'),
('Kinh tế chính trị Mác - Lênin', 'Bộ Giáo Dục', 'NXB Chính trị QG', 60000, 500,
 'Giáo trình bắt buộc', 2023, 300, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/ktct_ivie0s.png'),
('Chủ nghĩa xã hội khoa học', 'Bộ Giáo Dục', 'NXB Chính trị QG', 55000, 500,
 'Tài liệu học tập', 2023, 250, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/CNXH_bgfczp.png'),
('Tư tưởng Hồ Chí Minh', 'Bộ Giáo Dục', 'NXB Chính trị QG', 50000, 500,
 'Tài liệu học tập', 2023, 200, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/tthcm_pnrddd.png'),
('Lịch sử Đảng CSVN', 'Bộ Giáo Dục', 'NXB Chính trị QG', 50000, 500,
 'Tài liệu học tập', 2023, 220, '14x20', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741845/lsa_n5nfre.png'),
('Tiếng Anh 1 (General English)', 'Oxford', 'NXB Trẻ', 120000, 100,
 'Giáo trình tiếng Anh cơ bản', 2022, 150, '20x28', 'Bìa màu', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('Tiếng Anh 2 (General English)', 'Oxford', 'NXB Trẻ', 120000, 100,
 'Giáo trình tiếng Anh nâng cao', 2022, 160, '20x28', 'Bìa màu', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Nhập môn kỹ thuật (Intro to Eng)', 'HCMUT', 'NXB ĐHQG TP.HCM', 40000, 600,
 'Giới thiệu về nghề kỹ sư', 2020, 150, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Kỹ năng mềm cho SV Kỹ thuật', 'HCMUT', 'NXB ĐHQG TP.HCM', 35000, 600,
 'Làm việc nhóm và thuyết trình', 2020, 120, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'),

-- --- NHÓM KHMT & LẬP TRÌNH CƠ BẢN (15 cuốn) ---
('Nhập môn Điện toán (Intro to Computing)', 'Khoa KHMT', 'NXB ĐHQG TP.HCM', 45000, 300,
 'Lập trình Python/C++ cơ bản', 2021, 200, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'),
('Kỹ thuật lập trình', 'Trần Hạnh Nhi', 'NXB ĐHQG TP.HCM', 65000, 200,
 'Kỹ thuật xử lý mảng, con trỏ, struct', 2020, 280, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('Cấu trúc dữ liệu và Giải thuật', 'Đinh Bá Tiến', 'NXB ĐHQG TP.HCM', 75000, 150,
 'Linked List, Tree, Graph, Sorting', 2019, 350, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Lập trình Hướng đối tượng (OOP)', 'Huỳnh Lợi', 'NXB ĐHQG TP.HCM', 70000, 150,
 'C++ và Java căn bản', 2020, 320, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Cơ sở dữ liệu (Database)', 'Đỗ Phúc', 'NXB ĐHQG TP.HCM', 68000, 120,
 'Mô hình quan hệ và SQL', 2019, 300, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'),
('Hệ điều hành (OS)', 'Lê Thành Sách', 'NXB ĐHQG TP.HCM', 72000, 100,
 'Quản lý tiến trình, bộ nhớ', 2021, 340, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'),
('Mạng máy tính (Computer Networks)', 'Lê Trung Quân', 'NXB ĐHQG TP.HCM', 75000, 100,
 'Mô hình OSI/TCP-IP', 2021, 360, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('Kiến trúc máy tính', 'Trần Ngọc Thịnh', 'NXB ĐHQG TP.HCM', 65000, 90,
 'MIPS, Assembly và Vi xử lý', 2020, 280, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Lý thuyết đồ thị', 'Trần Đan Thư', 'NXB ĐHQG TP.HCM', 55000, 80,
 'Các thuật toán trên đồ thị', 2019, 220, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Trí tuệ nhân tạo (AI)', 'Quản Thành Thơ', 'NXB ĐHQG TP.HCM', 85000, 60,
 'Các thuật toán tìm kiếm và logic mờ', 2022, 380, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'),
('Nhập môn Học máy (Machine Learning)', 'Lê Hoài Bắc', 'NXB KHKT', 120000, 50,
 'Hồi quy, Phân lớp và Clustering', 2023, 400, '19x27', 'Bìa cứng', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'),
('Phân tích thiết kế hệ thống thông tin', 'Quản Thành Thơ', 'NXB ĐHQG TP.HCM', 70000, 80,
 'UML và quy trình phần mềm', 2020, 300, '16x24', 'Bìa mềm', 'Active',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('An toàn thông tin (Security)', 'Phạm Trần Vũ', 'NXB ĐHQG TP.HCM', 80000, 70,
 'Mật mã học và an ninh mạng', 2022, 320, '16x24', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Lập trình Java nâng cao', 'Trần Minh Thái', 'NXB Thông tin TT', 95000, 90,
 'JSP, Servlet và Spring Framework', 2021, 400, '19x27', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Lập trình Ứng dụng Di động', 'Trần Hạnh Nhi', 'NXB ĐHQG TP.HCM', 110000, 80,
 'Android và Flutter', 2023, 420, '19x27', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'),

-- --- NHÓM CÔNG NGHỆ & CHUYÊN SÂU (5 cuốn) ---
('Công nghệ phần mềm (Software Eng)', 'Trần Minh Triết', 'NXB ĐHQG TP.HCM', 78000, 60,
 'Agile, Scrum và quy trình DevOps', 2021, 350, '16x24', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'),
('Kiểm thử phần mềm (Testing)', 'Nguyễn Trọng Tài', 'NXB ĐHQG TP.HCM', 65000, 50,
 'Software Testing cơ bản', 2020, 250, '16x24', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'),
('Lập trình Web Frontend', 'F8 Official', 'NXB Công Nghệ', 150000, 100,
 'HTML5, CSS3 và ReactJS', 2023, 450, '19x27', 'Bìa màu', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'),
('Lập trình Web Backend', 'F8 Official', 'NXB Công Nghệ', 160000, 100,
 'NodeJS, Express và MongoDB', 2023, 480, '19x27', 'Bìa màu', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'),
('Clean Code (Mã sạch)', 'Robert C. Martin', 'NXB Thế Giới', 210000, 80,
 'Bản dịch tiếng Việt', 2022, 500, '17x24', 'Bìa mềm', 'Inactive',
 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png');

-- 5.4 BOOKCATEGORY
INSERT INTO BookCategory (BookID, CategoryID) VALUES
-- Toán & Đại Cương (1-20)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1),
(9, 1), (10, 1), (10, 2),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1),
(17, 6), (18, 6),
(19, 6), (20, 6),

-- KHMT & Lập trình cơ bản (21-35)
(21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (26, 4),
(27, 4),
(28, 4),
(29, 2), (30, 2), (31, 2),
(32, 3),
(33, 4),
(34, 2), (35, 2),

-- Công nghệ & Chuyên sâu (36-40)
(36, 3), (37, 3), (38, 2), (39, 2), (40, 3);

-- 5.5 ADDRESS
INSERT INTO Address (Ward, City, addressdetail, Phone, isdefault, UserID) VALUES
('Thủ Đức', 'TP.HCM', 'KTX Khu A, ĐHQG', '0918123456', TRUE, 2),
('Bình Thạnh', 'TP.HCM', '123 Xô Viết Nghệ Tĩnh', '0987654321', TRUE, 3);

-- Cart được tạo tự động bởi trigger khi insert users
-- CartID dự kiến: 1→user1, 2→user2, 3→user3
INSERT INTO CartItem (CartID, BookID, quantity) VALUES
(2, 23, 1),
(2, 25, 2),
(3, 40, 1);

-- 5.6 VOUCHER
INSERT INTO Voucher
(Code, startdate, enddate, Percent,
 maxordervalue, minordervalue, Quantity, Description, UserID)
VALUES
('WELCOME10', '2025-01-01', '2025-12-31', 10,
 1000000, 100000, 100, '10% off for new users',   1),
('SUMMER20',  '2025-06-01', '2025-08-31', 20,
 2000000, 200000,  50, '20% off summer sale',     1),
('FREESHIP',  '2025-01-01', '2025-12-31', 0,
 5000000, 100000, 200, 'Free shipping over 100k', 1),
('VIP30',     '2025-01-01', '2025-12-31', 30,
 5000000, 500000,  20, '30% off for VIP users',   1),
('FLASH5',    '2025-02-01', '2025-02-28', 5,
 500000,   50000, 300, '5% flash sale',           1);

-- 5.7 ORDERADDRESS
INSERT INTO OrderAddress (City, Ward, addressdetail, Phone) VALUES
('Ho Chi Minh', 'District 1', '123 Nguyen Hue - Order',   '0900000003'),
('Ho Chi Minh', 'District 3', '45 Vo Van Tan - Order',    '0900000003'),
('Ha Noi',      'Ba Dinh',    '12 Dien Bien Phu - Order', '0900000004'),
('Da Nang',     'Hai Chau',   '56 Bach Dang - Order',     '0900000005'),
('Ho Chi Minh', 'Thu Duc',    '89 Pham Van Dong - Order', '0900000005');

-- 5.8 ORDERS
INSERT INTO Orders
(orderdate, paymentmethod, currentstatus,
 shippingfee, subtotalprice, discounttotal, grandtotalprice,
 UserID, vouchercode, orderaddressid)
VALUES
('2025-01-20 09:00:00', 'COD',   'Pending',
 30000, 370000, 50000, 350000,
 2, 'WELCOME10', 1),

('2025-01-21 10:00:00', 'VNPAY', 'Processing',
 30000, 240000, 0, 270000,
 2, NULL, 2),

('2025-01-22 11:00:00', 'VNPAY', 'Processing',
 25000, 290000, 58000, 257000,
 3, 'SUMMER20', 3),

('2025-01-23 12:00:00', 'COD',   'Cancelled',
 30000, 190000, 0, 220000,
 3, NULL, 4),

('2025-01-24 13:00:00', 'VNPAY', 'Completed',
 20000, 120000, 30000, 110000,
 3, 'FREESHIP', 5);

-- 5.9 ORDERITEM
INSERT INTO OrderItem (OrderID, BookID, Quantity, linetotalprice) VALUES
(1, 1, 1, 100000),
(1, 2, 1, 150000),
(1, 4, 1, 120000),
(2, 2, 1, 150000),
(2, 5, 1,  90000),
(3, 3, 1, 200000),
(3, 5, 1,  90000),
(4, 1, 1, 100000),
(4, 5, 1,  90000),
(5, 4, 1, 120000);

-- 5.10 PAYMENT
INSERT INTO Payment
(OrderID, transactioncode, paidat, paystatus, Gateway, Amount, gatewayresponse)
VALUES
(1, 'TXN001', '2025-01-20 09:30:00', 'PAID',   'COD',   350000, 'Payment received'),
(2, 'TXN002', '2025-01-21 10:05:00', 'PENDING','VNPAY', 270000, 'Payment pending'),
(3, 'TXN003', '2025-01-22 11:15:00', 'PAID',   'VNPAY', 257000, 'Payment successful'),
(4, 'TXN004', '2025-01-23 16:00:00', 'REFUND', 'VNPAY',  50000, 'Refund processed'),
(5, 'TXN005', '2025-01-24 13:20:00', 'PAID',   'VNPAY', 110000, 'Payment successful');

-- =========================================================
-- 6. RESET SEQUENCE CHO CÁC BẢNG CÓ SERIAL (AN TOÀN KHI RỖNG)
-- =========================================================

-- users
SELECT setval(
    pg_get_serial_sequence('users', 'userid'),
    COALESCE(MAX(userid), 0) + 1,
    false
) FROM users;

-- Address
SELECT setval(
    pg_get_serial_sequence('Address', 'addressid'),
    COALESCE(MAX(addressid), 0) + 1,
    false
) FROM Address;

-- Cart
SELECT setval(
    pg_get_serial_sequence('Cart', 'cartid'),
    COALESCE(MAX(cartid), 0) + 1,
    false
) FROM Cart;

-- Category
SELECT setval(
    pg_get_serial_sequence('Category', 'categoryid'),
    COALESCE(MAX(categoryid), 0) + 1,
    false
) FROM Category;

-- Book
SELECT setval(
    pg_get_serial_sequence('Book', 'bookid'),
    COALESCE(MAX(bookid), 0) + 1,
    false
) FROM Book;

-- Review
SELECT setval(
    pg_get_serial_sequence('Review', 'reviewid'),
    COALESCE(MAX(reviewid), 0) + 1,
    false
) FROM Review;

-- OrderAddress
SELECT setval(
    pg_get_serial_sequence('OrderAddress', 'orderaddrid'),
    COALESCE(MAX(orderaddrid), 0) + 1,
    false
) FROM OrderAddress;

-- Orders
SELECT setval(
    pg_get_serial_sequence('Orders', 'orderid'),
    COALESCE(MAX(orderid), 0) + 1,
    false
) FROM Orders;

-- Payment
SELECT setval(
    pg_get_serial_sequence('Payment', 'paymentid'),
    COALESCE(MAX(paymentid), 0) + 1,
    false
) FROM Payment;

