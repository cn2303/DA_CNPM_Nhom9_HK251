"use client"

import { useState } from "react"
import axios from "axios"
import "./SignUp.css"
import { Eye, EyeOff } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

export default function SignUp({ onNavigate, setCurrentUser }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    const normalizedEmail = formData.email.trim().toLowerCase()
    const normalizedUsername = formData.username.trim()

    const payload = {
      fullname: formData.name.trim(),
      email: normalizedEmail,
      username: normalizedUsername || normalizedEmail || formData.phone.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      birthday: null,
      role: "CUSTOMER",
      address: [],
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/user`, payload)
      setSuccess("Đăng ký thành công!")

      setTimeout(() => {
        if (onNavigate) onNavigate("login")
      }, 1500)
    } catch (err) {
      console.error("Sign up failed", err)
      const message = err?.response?.data || "Không thể đăng ký. Vui lòng thử lại."
      if (typeof message === "string" && message.toLowerCase().includes("email")) {
        setError("Email đã được sử dụng. Vui lòng chọn email khác.")
      } else {
        setError(typeof message === "string" ? message : "Không thể đăng ký. Vui lòng thử lại.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Tạo tài khoản</h2>
        <p className="signup-subtitle">Tham gia BookStore để bắt đầu tìm kiếm tri thức</p>

        {error && <div className="signup-error">{error}</div>}
        {success && <div className="signup-success">{success}</div>}

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
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
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

          <button type="submit" className="signup-button" disabled={submitting}>
            {submitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="signup-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  )
}
