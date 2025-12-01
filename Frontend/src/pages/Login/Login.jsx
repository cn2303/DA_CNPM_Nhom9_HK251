"use client"

import { useState } from "react"
import "./Login.css"
import { Eye, EyeOff } from "lucide-react"

export default function Login({ onNavigate, setCurrentUser, previousPage }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mock authentication
    if (email === "user@gmail.com" && password === "user") {
      setCurrentUser({ email, username: "user" })
      onNavigate(previousPage || "home")
    } else {
      setError("Email hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Chào mừng</h2>
        <p className="login-subtitle">Đăng nhập để tiếp tục</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{error}</div>}

          <a href="#" className="forgot-password">
            Quên mật khẩu?
          </a>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        <div className="divider">Hoặc</div>

        <button className="google-login">
          <img src="https://services.google.com/fh/files/misc/google_g_icon_download.png" alt="Google" />
          Đăng nhập với Google
        </button>

        <p className="login-footer">
          Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  )
}
