import { Phone, Mail, MapPin } from "lucide-react"
import "./Footer.css"

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-title">Về chúng tôi</h3>
            <p className="footer-text">BookStore - Cung cấp sách giáo trình cho sinh viên</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Liên hệ</h3>
            <div className="footer-links">
              <div className="footer-link">
                <MapPin size={16} />
                <span>Địa chỉ: Phương Đông Hòa, TP. HCM</span>
              </div>
              <div className="footer-link">
                <Phone size={16} />
                <span>Hotline: 028 2882 8822</span>
              </div>
              <div className="footer-link">
                <Mail size={16} />
                <span>Email: bookstore@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Hỗ trợ</h3>
            <div className="footer-links">
              <a href="#" className="footer-link-text">
                Chính sách đổi trả
              </a>
              <a href="#" className="footer-link-text">
                Hướng dẫn mua hàng
              </a>
              <a href="#" className="footer-link-text">
                Phương thức thanh toán
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 BOOKSTORE. All rights reserved</p>
      </div>
    </footer>
  )
}
