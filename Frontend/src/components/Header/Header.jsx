"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ShoppingCart, User, UserCircle, Package, LogOut } from "lucide-react"
import "./Header.css"

export default function Header({ onNavigate, currentUser, setCurrentUser }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    setShowUserMenu(false)
    onNavigate?.("home")
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          <div className="header-logo" onClick={() => onNavigate?.("home")} style={{ cursor: "pointer" }}>
            <img src="/logo_0.png" alt="BookStore Logo" className="logo-image" />
            <span>BookStore</span>
          </div>

          <div className="header-actions">
            <div className="cart-icon" onClick={() => onNavigate?.("cart")}>
              <ShoppingCart size={24} />
              <span className="cart-badge">0</span>
            </div>
            {currentUser ? (
              <div className="user-menu-container" ref={menuRef}>
                <button className="login-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User size={18} />
                  {currentUser.username}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <button className="user-menu-header">
                      <User size={24} />
                      {currentUser.username}
                    </button>
                    <button className="user-menu-item" onClick={() => { setShowUserMenu(false); onNavigate?.("account"); }}>
                      <UserCircle size={18} />
                      Thông tin tài khoản
                    </button>
                    <button className="user-menu-item" onClick={() => { setShowUserMenu(false); onNavigate?.("orders"); }}>
                      <Package size={18} />
                      Đơn hàng
                    </button>
                    <button className="user-menu-item logout" onClick={handleLogout}>
                      <LogOut size={18} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => onNavigate?.("login")}>
                <User size={18} />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="header-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm sách, tác giả mong muốn"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">
            <Search size={20} />
            Tìm kiếm
          </button>
        </div>
      </div>
    </header>
  )
}
