"use client"

import { useState } from "react"
import "./SignUp.css"
import { Eye, EyeOff } from "lucide-react"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Sign up:", formData)
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Tạo tài khoản</h2>
        <p className="signup-subtitle">Tham gia BookStore để bắt đầu tìm kiếm tri thức</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập họ tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="Nhập số điện thoại của bạn"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Tạo mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="signup-button">
            Đăng ký
          </button>
        </form>

        <p className="signup-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  )
}
