"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { authAxios } from "../../utils/auth"
import "./Checkout.css"
import { MapPin, Truck, Tag } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

const API_BASE_URL = "http://localhost:8080"
const BASE_SHIPPING_FEE = 30000

export default function Checkout({ onNavigate, currentUser, setCurrentUser }) {
  const [refreshCartCount, setRefreshCartCount] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState("")
  const [newAddress, setNewAddress] = useState({ city: "", ward: "", addressDetail: "", phone: "" })
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  
  const [discountCode, setDiscountCode] = useState("")
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!currentUser?.id) return
      try {
        const { data } = await authAxios.get(`/user/${currentUser.id}`)
        setUserInfo(data)
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }
    fetchUserInfo()
  }, [currentUser])

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser?.id) return
      try {
        const { data } = await authAxios.get(`/address/user/${currentUser.id}`)
        const normalizedAddresses = data.map(addr => ({ ...addr, source: "account" }))
        setAddresses(normalizedAddresses)
        const defaultAddr = normalizedAddresses.find(addr => addr.default || addr.Default)
        if (defaultAddr) {
          setSelectedAddress(defaultAddr)
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
      }
    }
    fetchAddresses()
  }, [currentUser])

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { data } = await authAxios.get(`/voucher`)
        setVouchers(data)
      } catch (error) {
        console.error("Error fetching vouchers:", error)
      }
    }
    fetchVouchers()
  }, [])

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser?.id) return
      try {
        setLoading(true)
        const { data } = await authAxios.get(`/cart/${currentUser.id}`)
        setCartData(data)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [currentUser])

  useEffect(() => {
    if (userInfo?.phone) {
      setNewAddress((prev) => (prev.phone ? prev : { ...prev, phone: userInfo.phone }))
    }
  }, [userInfo])

  const subtotal = cartData?.cartItems?.reduce((sum, item) => sum + item.book.price * item.quantity, 0) || 0
  
  const calculateDiscount = () => {
    if (!appliedVoucher) return 0
    
    const percent = Number(appliedVoucher.percent) || 0
    const discountAmount = (subtotal * percent) / 100
    return Math.min(discountAmount, appliedVoucher.maxValue)
  }
  
  const discount = calculateDiscount()
  const isFreeShip = appliedVoucher?.code?.toUpperCase() === "FREESHIP"
  const shippingFee = isFreeShip ? 0 : BASE_SHIPPING_FEE
  const totalBeforeShipping = Math.max(0, subtotal - discount)
  const total = totalBeforeShipping + shippingFee

  const handleApplyCoupon = async () => {
    if (!discountCode.trim()) {
      alert("Vui lòng nhập mã giảm giá")
      return
    }

    try {
      const { data: voucher } = await authAxios.get(`/voucher/${discountCode.trim()}`)
      
      if (voucher.quantity <= 0) {
        alert("Số lượng mã giảm giá đã hết")
        return
      }
      
      if (subtotal < voucher.minValue) {
        alert(`Chưa đạt giá trị đơn hàng tối thiểu (${voucher.minValue.toLocaleString()}đ)`)
        return
      }
      
      const currentDate = new Date()
      const startDate = new Date(voucher.startDate)
      const endDate = new Date(voucher.endDate)
      
      if (currentDate < startDate || currentDate > endDate) {
        alert("Mã giảm giá đã hết hạn")
        return
      }
      
      setAppliedVoucher(voucher)
      if (voucher.code?.toUpperCase() === "FREESHIP") {
        alert("Áp dụng mã FREESHIP - miễn phí vận chuyển")
      } else {
        alert(`Áp dụng mã giảm giá thành công! Giảm ${voucher.percent}%`)
      }
      
    } catch (error) {
      console.error("Error applying voucher:", error)
      if (error.response?.status === 404) {
        alert("Mã giảm giá không tồn tại")
      } else {
        alert("Có lỗi xảy ra khi áp dụng mã giảm giá")
      }
    }
  }

  const handleAddOrderAddress = async (e) => {
    e.preventDefault()

    if (!newAddress.city.trim() || !newAddress.ward.trim() || !newAddress.addressDetail.trim() || !newAddress.phone.trim()) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng")
      return
    }

    setIsSavingAddress(true)
    try {
      const payload = {
        city: newAddress.city.trim(),
        ward: newAddress.ward.trim(),
        addressDetail: newAddress.addressDetail.trim(),
        phone: newAddress.phone.trim(),
      }

      const { data } = await authAxios.post(`/OrderAddress`, payload)
      const createdAddress = { ...data, source: "order" }

      setAddresses((prev) => [...prev, createdAddress])
      setSelectedAddress(createdAddress)
      setShowNewAddressForm(false)
      setNewAddress({ city: "", ward: "", addressDetail: "", phone: userInfo?.phone || "" })
      alert("Đã thêm địa chỉ giao hàng cho đơn này")
    } catch (error) {
      console.error("Error adding order address:", error)
      alert("Không thể thêm địa chỉ giao hàng, vui lòng thử lại")
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng")
      return
    }
    
    if (!cartData?.cartItems || cartData.cartItems.length === 0) {
      alert("Giỏ hàng trống")
      return
    }

    setIsSubmitting(true)
    
    try {
      let orderAddressId = selectedAddress.id

      if (selectedAddress.source === "account") {
        try {
          const orderAddressPayload = {
            city: selectedAddress.city,
            ward: selectedAddress.ward,
            addressDetail: selectedAddress.addressDetail,
            phone: selectedAddress.phone
          }
          
          const addressResponse = await authAxios.post("/OrderAddress", orderAddressPayload)
          orderAddressId = addressResponse.data.id
        } catch (error) {
          console.error("Error creating OrderAddress:", error)
          alert("Không thể tạo địa chỉ giao hàng. Vui lòng thử lại!")
          setIsSubmitting(false)
          return
        }
      }

      const orderData = {
        status: paymentMethod === "cod" ? "Processing" : "Pending",
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod === "cod" ? "COD" : "VNPAY",
        shippingFee: shippingFee,
        subtotalPrice: subtotal,
        discountTotal: discount,
        grandTotalPrice: total,
        user: {
          id: currentUser.id
        },
        orderAddress: {
          id: orderAddressId
        },
        ...(appliedVoucher && { voucher: { code: appliedVoucher.code } }),
        orderItemList: cartData.cartItems.map(item => ({
          book: {
            id: item.book.id
          },
          quantity: item.quantity,
          price: item.book.price
        }))
      }

      if (paymentMethod === "cod") {
        const response = await authAxios.post("/order", orderData)
        alert("Đặt hàng thành công!")
        onNavigate("orders", null, null, "Processing")
      } else {
        localStorage.setItem("pendingOrderData", JSON.stringify(orderData))
        const paymentResponse = await authAxios.get("/payment/create-payment", {
          params: {
            price: total,
            orderId: `ORDER_${Date.now()}`
          }
        })
        
        if (paymentResponse.data?.url) {
          window.location.href = paymentResponse.data.url
        } else {
          alert("Không thể khởi tạo thanh toán. Vui lòng thử lại!")
          localStorage.removeItem("pendingOrderData")
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />
      <div className="checkout-page">
      <div className="checkout-container">
        <h2 className="checkout-title">Thông tin đặt hàng</h2>

        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="checkout-section">
              <div className="section-header">
                <MapPin size={20} />
                <h3>Thông tin người nhận</h3>
              </div>
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" value={userInfo?.fullname || ""} readOnly />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input type="tel" value={userInfo?.phone || ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={userInfo?.email || ""} readOnly />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng *</label>
                <select 
                  value={selectedAddress?.id || ""} 
                  onChange={(e) => {
                    const addr = addresses.find(a => a.id === parseInt(e.target.value))
                    setSelectedAddress(addr)
                  }}
                >
                  <option value="">Chọn địa chỉ</option>
                  {addresses.map((addr) => (
                    <option key={`${addr.source || "addr"}-${addr.id}`} value={addr.id}>
                      {addr.addressDetail}, {addr.ward}, {addr.city} {addr.default || addr.Default ? "(Mặc định)" : ""} {addr.source === "order" ? "(Địa chỉ đơn hàng)" : ""}
                    </option>
                  ))}
                </select>
                <div className="address-actions">
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setShowNewAddressForm((prev) => !prev)}
                  >
                    {showNewAddressForm ? "Ẩn form thêm địa chỉ" : "Thêm địa chỉ giao hàng mới"}
                  </button>
                </div>
                {showNewAddressForm && (
                  <form className="new-address-form" onSubmit={handleAddOrderAddress}>
                    <div className="new-address-grid">
                      <div className="form-group">
                        <label>Thành phố/Tỉnh *</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Ví dụ: Ho Chi Minh"
                        />
                      </div>
                      <div className="form-group">
                        <label>Quận/Huyện *</label>
                        <input
                          type="text"
                          value={newAddress.ward}
                          onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                          placeholder="Ví dụ: Quận 4"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Địa chỉ chi tiết *</label>
                      <input
                        type="text"
                        value={newAddress.addressDetail}
                        onChange={(e) => setNewAddress({ ...newAddress, addressDetail: e.target.value })}
                        placeholder="Ví dụ: 123 Nguyen Hue - Order"
                      />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại nhận hàng *</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="Ví dụ: 0900000007"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="primary-button" disabled={isSavingAddress}>
                        {isSavingAddress ? "Đang lưu..." : "Lưu địa chỉ giao hàng"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className="form-group">
                <label>Ghi chú (không bắt buộc)</label>
                <textarea 
                  placeholder="Ghi chú chủ về đơn hàng, vd: thời gian hay chi tiết địa điểm giao hàng chi tiết hơn" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-section">
              <div className="section-header">
                <Truck size={20} />
                <h3>Phương thức thanh toán</h3>
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="cod" 
                  name="payment" 
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="payment-method">
                <input 
                  type="radio" 
                  id="online" 
                  name="payment" 
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <label htmlFor="online">Thanh toán online (VNPAY)</label>
              </div>
            </div>

            <div className="checkout-section">
              <div className="section-header">
                <Tag size={20} />
                <h3>Mã giảm giá</h3>
              </div>
              {appliedVoucher && (
                <div style={{ 
                  padding: "10px", 
                  backgroundColor: "#e8f5e9", 
                  borderRadius: "5px", 
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "#2e7d32", fontWeight: "500" }}>
                    ✓ Đã áp dụng: {appliedVoucher.code} {appliedVoucher.code?.toUpperCase() === "FREESHIP" ? "- Miễn phí vận chuyển" : `(-${appliedVoucher.percent}%)`}
                  </span>
                  <button 
                    onClick={() => {
                      setAppliedVoucher(null)
                      setDiscountCode("")
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#d32f2f",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Xóa
                  </button>
                </div>
              )}
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  disabled={appliedVoucher !== null}
                />
                <button onClick={handleApplyCoupon} disabled={appliedVoucher !== null}>
                  Áp dụng
                </button>
              </div>
              <div className="available-coupons">
                <h4>Mã giảm giá có sẵn:</h4>
                <div className="coupon-list">
                  {vouchers.map((voucher) => (
                    <div 
                      key={voucher.code} 
                      className="coupon-item"
                      onClick={() => setDiscountCode(voucher.code)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="coupon-code">{voucher.code}</div>
                      <div className="coupon-desc">
                        {voucher.description}
                        {voucher.percent > 0 && ` - Giảm ${voucher.percent}%`}
                        {voucher.minValue > 0 && ` (Đơn từ ${voucher.minValue.toLocaleString()}đ)`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-right">
            <div className="order-review">
              <h3>Đơn hàng ({cartData?.cartItems?.length || 0} sản phẩm)</h3>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
              ) : (
                <>
                  <div className="review-items">
                    {cartData?.cartItems?.map((item) => (
                      <div key={item.id.bookId} className="review-item">
                        <img src={item.book.imageUrl || "/placeholder.svg"} alt={item.book.title} />
                        <div className="review-item-info">
                          <p className="item-name">{item.book.title}</p>
                          <p className="item-author">{item.book.author}</p>
                          <p className="item-qty">x{item.quantity}</p>
                        </div>
                        <span className="item-price">{(item.book.price * item.quantity).toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>

                  <div className="review-summary">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{subtotal.toLocaleString()}đ</span>
                    </div>
                    {appliedVoucher && discount > 0 && (
                      <div className="summary-row discount">
                        <span>Giảm giá ({appliedVoucher.code} - {appliedVoucher.percent}%):</span>
                        <span>-{discount.toLocaleString()}đ</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Phí vận chuyển{isFreeShip ? " (FREESHIP)" : ""}:</span>
                      <span>{shippingFee.toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{total.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <button className="checkout-button" onClick={handleCheckout} disabled={isSubmitting}>
                    {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                  </button>
                  <button className="return-link" onClick={() => onNavigate("cart")}>
                    Quay lại giỏ hàng
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
