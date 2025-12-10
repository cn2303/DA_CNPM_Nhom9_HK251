"use client"

import { useState, useEffect } from "react"
import { Trash2, Minus, Plus } from "lucide-react"
import { authAxios } from "../../utils/auth"
import "./Cart.css"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

export default function Cart({ onNavigate, currentUser, setCurrentUser }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshCartCount, setRefreshCartCount] = useState(null)

  const fetchCart = async () => {
    if (!currentUser?.id) {
      setLoading(false)
      return
    }

    try {
      const { data } = await authAxios.get(`/cart/${currentUser.id}`)
      const items = data.cartItems.map((item) => ({
        id: item.book.id,
        name: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        image: item.book.imageUrl,
        stockQuantity:
          typeof item.book.stockQuantity === "number"
            ? item.book.stockQuantity
            : typeof item.book.quantity === "number"
              ? item.book.quantity
              : null,
      }))
      setCartItems(items)
    } catch (err) {
      console.error("Failed to fetch cart", err)
      setError("Không thể tải giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [currentUser])

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return
    
    const currentItem = cartItems.find(item => item.id === bookId)
    if (!currentItem) return

    const maxQuantity = typeof currentItem.stockQuantity === "number" ? currentItem.stockQuantity : Infinity
    if (newQuantity > maxQuantity) {
      alert("Số lượng vượt quá tồn kho")
      return
    }

    const diff = newQuantity - currentItem.quantity
    if (diff === 0) return

    try {
      if (diff > 0) {
        const allowedIncrease = Math.min(diff, maxQuantity - currentItem.quantity)
        if (allowedIncrease <= 0) {
          alert("Số lượng vượt quá tồn kho")
          return
        }

        for (let i = 0; i < allowedIncrease; i++) {
          await authAxios.put(`/cart/${currentUser.id}/book/${bookId}`)
        }
        await fetchCart()
        if (refreshCartCount && typeof refreshCartCount === "function") await refreshCartCount()
      } else {
        const updatedItems = cartItems.map(item => 
          item.id === bookId ? { ...item, quantity: newQuantity } : item
        )
        const cartData = {
          id: currentUser.id,
          user: { id: currentUser.id },
          cartItems: updatedItems.map(item => ({
            book: { id: item.id },
            quantity: item.quantity
          }))
        }
        await authAxios.put(`/cart`, cartData)
        await fetchCart()
        if (refreshCartCount && typeof refreshCartCount === "function") await refreshCartCount()
      }
    } catch (err) {
      console.error("Failed to update quantity", err)
      setError("Không thể cập nhật số lượng")
    }
  }

  const handleRemoveItem = async (bookId) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== bookId)
      
      const cartData = {
        id: currentUser.id,
        user: { id: currentUser.id },
        cartItems: updatedItems.map(item => ({
          book: { id: item.id },
          quantity: item.quantity
        }))
      }
      
      await authAxios.put(`/cart`, cartData)
      await fetchCart()
      if (refreshCartCount && typeof refreshCartCount === "function") await refreshCartCount()
    } catch (err) {
      console.error("Failed to remove item", err)
      setError("Không thể xóa sản phẩm")
      await fetchCart()
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return (
      <>
        <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />
        <div className="cart-page">
          <div className="cart-container">
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />
        <div className="cart-page">
          <div className="cart-container">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    )
  }

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />
      <div className="cart-page">
        <div className="breadcrumb">
          <span onClick={() => onNavigate("home")} className="breadcrumb-link">
            Trang chủ
          </span>
          <span className="breadcrumb-separator">/</span>
          <span>Giỏ sách</span>
        </div>

      <div className="cart-container">
        <h1 className="page-title">Giỏ hàng</h1>
        <p className="cart-count">{cartItems.length} mục trong giỏ hàng</p>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="section-title">Các mục trong giỏ</div>

            {cartItems.length > 0 ? (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />

                    <div className="item-details">
                      <div className="item-info">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-author">{item.author}</p>
                      </div>
                      <p className="item-price">{item.price.toLocaleString()}đ</p>
                    </div>

                    <div className="item-actions">
                      <div className="item-quantity-control">
                        <button className="qty-btn" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="qty-input"
                        />
                        <button className="qty-btn" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <Plus size={16} />
                        </button>
                      </div>

                      <button className="delete-btn" onClick={() => handleRemoveItem(item.id)} title="Xóa sản phẩm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <p>Giỏ hàng của bạn trống</p>
                <button className="continue-shopping-btn" onClick={() => onNavigate("home")}>
                  Tiếp tục mua sách
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="section-title">Tóm tắt đơn hàng</div>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span className="summary-item-name">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="summary-item-price">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span className="total-label">Tổng tiền</span>
              <span className="total-amount">{subtotal.toLocaleString()}đ</span>
            </div>

            <button className="checkout-btn" onClick={() => onNavigate("checkout")} disabled={cartItems.length === 0}>
              Tiến hành đặt hàng
            </button>

            <button className="continue-shopping-link" onClick={() => onNavigate("home")}>
              Tiếp tục mua sách
            </button>
          </div>
        </div>
      </div>
    </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
