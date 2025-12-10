"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Search, ShoppingCart, User, UserCircle, Package, LogOut } from "lucide-react"
import { authAxios, logout as authLogout, getToken } from "../../utils/auth"
import "./Header.css"

export default function Header({ onNavigate, currentUser, setCurrentUser, searchQuery: propSearchQuery, onSearchChange, onCartCountUpdate }) {
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || "")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const menuRef = useRef(null)

  useEffect(() => {
    if (propSearchQuery !== undefined) {
      setSearchQuery(propSearchQuery)
    }
  }, [propSearchQuery])

  const fetchCartCount = useCallback(async () => {
    if (!currentUser?.id) {
      setCartCount(0)
      return
    }

    const token = getToken()
    if (!token) {
      setCartCount(0)
      return
    }

    try {
      const { data } = await authAxios.get(`/cart/${currentUser.id}`)
      const totalCount = data.cartItems.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalCount)
    } catch (err) {
      console.error("Failed to fetch cart count", err)
      setCartCount(0)
    }
  }, [currentUser?.id])

  useEffect(() => {
    fetchCartCount()
  }, [currentUser, fetchCartCount])

  useEffect(() => {
    if (onCartCountUpdate) {
      onCartCountUpdate(fetchCartCount)
    }
  }, [fetchCartCount, onCartCountUpdate])

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim()
    if (onSearchChange) {
      onSearchChange(trimmedQuery)
    }
    onNavigate?.("search", null, null, null, trimmedQuery)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

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
    authLogout()
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
              <span className="cart-badge">{cartCount}</span>
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
            onKeyDown={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
            Tìm kiếm
          </button>
        </div>
      </div>
    </header>
  )
}
