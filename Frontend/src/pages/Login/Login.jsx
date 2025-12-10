"use client"

import { useState } from "react"
import "./Login.css"
import { Eye, EyeOff } from "lucide-react"
import { login, setToken, setCurrentUser as setAuthUser, authAxios } from "../../utils/auth"

export default function Login({ onNavigate, setCurrentUser, previousPage }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { token, userId, role, authenticated } = await login(email.trim(), password)
      
      if (!authenticated) {
        setError("Email hoặc mật khẩu không đúng")
        setLoading(false)
        return
      }

      const { data: userData } = await authAxios.get(`/user/${userId}`)
      
      const userInfo = {
        id: userId,
        email: userData.email,
        username: userData.username,
        fullname: userData.fullname,
        phone: userData.phone,
        role: role,
      }
      
      setAuthUser(userInfo)
      setCurrentUser(userInfo)
      
      if (role?.toUpperCase() === 'ADMIN') {
        onNavigate("admin")
      } else {
        onNavigate(previousPage || "home")
      }
    } catch (err) {
      console.error("Login failed", err)
      if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng")
      } else {
        setError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.")
      }
    } finally {
      setLoading(false)
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="divider">Hoặc</div>

        <p className="login-footer">
          Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  )
}
