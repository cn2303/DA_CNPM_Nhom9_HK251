import React, { useState } from "react";
import Home from "./components/Home";
import Books from "./components/Books";
import Login from "./components/Login";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "home") return <Home />;
    if (page === "books") return <Books />;
    if (page === "login") return <Login />;
    return <Home />;
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F9FAFB', overflow: 'hidden' }}>
      {/* Header */}
      <div className="bookstore-header">
        <div className="bookstore-header-content">
          <div className="bookstore-logo">
            <div className="bookstore-logo-icon">
              {/* logo */}
              <img src="/logo_0.png" alt="BookStore logo" className="bookstore-logo-img" />
            </div>
            <span className="bookstore-logo-text">BookStore</span>
          </div>
          <div className="bookstore-actions">
            <button className="bookstore-cart-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#0A0A0A" strokeWidth="1.33"/><circle cx="5.33" cy="13.33" r="1.33" fill="#0A0A0A"/><circle cx="12" cy="13.33" r="1.33" fill="#0A0A0A"/></svg>
              Giỏ sách
              <span className="bookstore-cart-badge">0</span>
            </button>
            <button className="bookstore-login-btn" onClick={() => setPage("login")}> 
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.33" r="3.33" stroke="#fff" strokeWidth="1.33"/><rect x="2.67" y="10.67" width="10.67" height="3.33" rx="1.67" stroke="#fff" strokeWidth="1.33"/></svg>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bookstore-nav">
        <div className="bookstore-search-bar">
          <span>Tìm sách, tác giả mong muốn</span>
        </div>
        <button className="bookstore-search-btn">Tìm kiếm</button>
        <button style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: 16, marginLeft: 32, cursor: 'pointer' }} onClick={() => setPage('home')}>Trang chủ</button>
        <button style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: 16, marginLeft: 8, cursor: 'pointer' }} onClick={() => setPage('books')}>Sách</button>
      </div>

      {/* Main Content */}
      <main className="container">
        {renderPage()}
      </main>

      {/* Footer */}
      <div className="bookstore-footer">
        <div className="bookstore-footer-content">
          <div className="bookstore-footer-section">
            <div className="bookstore-footer-title">Về chúng tôi</div>
            <div>BookStore - Cung cấp sách giáo trình cho sinh viên</div>
          </div>
          <div className="bookstore-footer-section">
            <div className="bookstore-footer-title">Liên hệ</div>
            <div>Địa chỉ: Phường Đông Hòa, TP. HCM</div>
            <div>Hotline: 028 2882 8822</div>
            <div>Email: bookstore@gmail.com</div>
          </div>
          <div className="bookstore-footer-section">
            <div className="bookstore-footer-title">Hỗ trợ</div>
            <a href="#" className="bookstore-footer-link">Chính sách đổi trả</a>
            <a href="#" className="bookstore-footer-link">Hướng dẫn mua hàng</a>
            <a href="#" className="bookstore-footer-link">Phương thức thanh toán</a>
          </div>
        </div>
        <div className="bookstore-footer-copyright">
          © {new Date().getFullYear()} BOOKSTORE. All rights reserved.
        </div>
      </div>
    </div>
  );
}