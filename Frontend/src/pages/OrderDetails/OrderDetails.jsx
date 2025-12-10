import { useEffect, useState } from "react"
import { authAxios } from "../../utils/auth"
import "./OrderDetails.css"
import { MapPin, Calendar, Truck, MessageSquare, Star, X } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

const API_BASE_URL = "http://localhost:8080"

const STATUS_LABELS = {
  Pending: "Đã thanh toán",
  Processing: "Đang xử lý",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
}

const formatCurrency = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return "0 đ"
  return `${num.toLocaleString("vi-VN")} đ`
}

const formatDate = (value) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("vi-VN")
}

export default function OrderDetails({ orderId, onNavigate, currentUser, setCurrentUser }) {
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [reviewsByBook, setReviewsByBook] = useState({})
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng")
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")

      try {
        const { data } = await authAxios.get(`/order/${orderId}`)
        
        if (data?.orderAddress?.id) {
          try {
            const { data: addressData } = await authAxios.get(`/OrderAddress/${data.orderAddress.id}`)
            data.orderAddress = addressData
          } catch (err) {
            console.error("Failed to fetch order address", err)
          }
        }
        
        setOrderData(data)
      } catch (err) {
        const message = err?.response?.data || "Không thể tải chi tiết đơn hàng"
        setError(typeof message === "string" ? message : "Không thể tải chi tiết đơn hàng")
        setOrderData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  useEffect(() => {
    const fetchReviewsForItems = async () => {
      if (!orderData?.orderItemList?.length) return

      const uniqueBookIds = Array.from(
        new Set(
          orderData.orderItemList
            .map((item) => item?.book?.id || item?.id?.bookId)
            .filter(Boolean)
        )
      )

      if (!uniqueBookIds.length) return

      try {
        const responses = await Promise.all(
          uniqueBookIds.map(async (bookId) => {
            try {
              const { data } = await authAxios.get(`/review/book/${bookId}`)
              return [bookId, Array.isArray(data) ? data : []]
            } catch (err) {
              console.error(`Failed to fetch reviews for book ${bookId}`, err)
              return [bookId, []]
            }
          })
        )

        const next = {}
        responses.forEach(([bookId, list]) => {
          next[bookId] = list
        })
        setReviewsByBook(next)
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      }
    }

    fetchReviewsForItems()
  }, [orderData?.orderItemList])

  const openRatingModal = (item) => {
    setSelectedItem(item)
    setRating(0)
    setHoverRating(0)
    setReview("")
    setShowRatingModal(true)
  }

  const closeRatingModal = () => {
    setShowRatingModal(false)
    setSelectedItem(null)
    setRating(0)
    setHoverRating(0)
    setReview("")
  }

  const handleSubmitRating = async () => {
    const bookId = selectedItem?.book?.id || selectedItem?.id?.bookId
    if (!selectedItem || !bookId || !currentUser?.id || rating <= 0 || !isCompleted) return

    setRatingSubmitting(true)
    try {
      const payload = {
        createdAt: new Date().toISOString(),
        comment: review.trim(),
        rating,
        user: { id: currentUser.id },
        book: { id: bookId },
      }

      const { data } = await authAxios.post(`/review`, payload)

      setReviewsByBook((prev) => {
        const existing = prev[bookId] || []
        const newReview = {
          ...data,
          user: data.user?.id ? data.user : { id: currentUser.id, fullname: currentUser.fullname },
          book: data.book?.id ? data.book : { id: bookId },
        }
        return {
          ...prev,
          [bookId]: [...existing, newReview],
        }
      })

      closeRatingModal()
    } catch (err) {
      console.error("Failed to submit review", err)
      alert("Không thể gửi đánh giá. Vui lòng thử lại.")
    } finally {
      setRatingSubmitting(false)
    }
  }

  const isItemRated = (item) => {
    const bookId = item?.book?.id || item?.id?.bookId
    if (!bookId || !currentUser?.id) return false
    const list = reviewsByBook[bookId] || []
    return list.some((r) => r?.user?.id === currentUser.id)
  }

  const isCompleted = orderData?.status && orderData.status.toLowerCase() === "completed"

  if (loading) {
    return (
      <>
        <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="order-details-page">
          <div className="order-details-container">
            <div style={{ padding: "20px", textAlign: "center" }}>Đang tải chi tiết đơn hàng...</div>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    )
  }

  if (error || !orderData) {
    return (
      <>
        <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="order-details-page">
          <div className="order-details-container">
            <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
              {error || "Không tìm thấy đơn hàng"}
            </div>
            <button className="back-button" onClick={() => onNavigate("orders")}>Quay lại</button>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </>
    )
  }

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="order-details-page">
        <div className="breadcrumb">
          <span onClick={() => onNavigate("home")} className="breadcrumb-link">Trang chủ</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => onNavigate("orders")} className="breadcrumb-link">Đơn hàng</span>
          <span className="breadcrumb-separator">/</span>
          <span>Chi tiết đơn hàng</span>
        </div>

        <div className="order-details-container">
          <div className="order-details-content">
          <div className="details-info-card">
            <div className="order-details-header">
              <div>
                <h2>Chi tiết đơn hàng #{orderData.id}</h2>
                <p className="order-date">Ngày đặt hàng: {formatDate(orderData.orderDate)}</p>
              </div>
              <span className={`order-status ${orderData.status?.toLowerCase() || "pending"}`}>
                {STATUS_LABELS[orderData.status] || orderData.status || "Chưa xác định"}
              </span>
            </div>

            <div className="section-item">
              <MapPin size={20} className="icon" />
              <div className="section-content">
                <h4>Địa chỉ giao hàng</h4>
                <p>
                  {orderData.orderAddress ? (
                    <>
                      {orderData.orderAddress.addressDetail}<br />
                      {orderData.orderAddress.ward}, {orderData.orderAddress.city}<br />
                      SĐT: {orderData.orderAddress.phone}
                    </>
                  ) : "-"}
                </p>
              </div>
            </div>

            <div className="section-item">
              <Truck size={20} className="icon" />
              <div className="section-content">
                <h4>Phương thức thanh toán</h4>
                <p>{orderData.paymentMethod || "-"}</p>
              </div>
            </div>

            <div className="section-item">
              <Calendar size={20} className="icon" />
              <div className="section-content">
                <h4>Ngày giao hàng</h4>
                <p>
                  {orderData.orderDate ? (() => {
                    const orderDate = new Date(orderData.orderDate)
                    const deliveryDate = new Date(orderDate)
                    deliveryDate.setDate(deliveryDate.getDate() + 7)
                    return `${formatDate(deliveryDate)}`
                  })() : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="order-summary-card">
            <h3>Sản phẩm đã đặt</h3>
            <div className="summary-items">
              {(orderData.orderItemList || []).map((item, idx) => (
                <div key={item.id?.bookId ?? item.book?.id ?? idx} className="summary-item">
                  <img src={item.book?.imageUrl || "/placeholder.svg"} alt={item.book?.title || "Sản phẩm"} className="item-image" />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.book?.title || "Sản phẩm"}</p>
                    <p className="summary-item-author">{item.book?.author || "-"}</p>
                    <div className="item-bottom">
                      <div className="item-details-row">
                        <span className="summary-item-qty">Số lượng: {item.quantity || 0}</span>
                        <span className="summary-item-price">{formatCurrency(item.price)}</span>
                      </div>
                      {isCompleted && (
                        isItemRated(item) ? (
                          <span className="rated-badge">Đã đánh giá</span>
                        ) : (
                          <button className="rating-button" onClick={() => openRatingModal(item)}>
                            <MessageSquare size={16} />
                            Đánh giá
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-pricing">
              <div className="pricing-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(orderData.subtotalPrice)}</span>
              </div>
              <div className="pricing-row">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(orderData.shippingFee)}</span>
              </div>
              <div className="pricing-row">
                <span>Giảm giá:</span>
                <span className="discount-amount">-{formatCurrency(orderData.discountTotal)}</span>
              </div>
              <div className="order-total">
                <span>Tổng cộng:</span>
                <span className="total-price">{formatCurrency(orderData.grandTotalPrice)}</span>
              </div>
            </div>
          </div>

          <button className="back-button" onClick={() => onNavigate("orders")}>Quay lại</button>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
      
      {showRatingModal && selectedItem && (
        <div className="rating-modal-overlay" onClick={closeRatingModal}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeRatingModal}>
              <X size={20} />
            </button>
            
            <h3 className="modal-title">Đánh giá sản phẩm</h3>
            <p className="modal-subtitle">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
            
            <div className="modal-product">
              <img
                src={selectedItem.book?.imageUrl || "/placeholder.svg"}
                alt={selectedItem.book?.title || "Sản phẩm"}
                className="modal-product-image"
              />
              <div className="modal-product-info">
                <p className="modal-product-name">{selectedItem.book?.title || "Sản phẩm"}</p>
                <p className="modal-product-author">{selectedItem.book?.author || ""}</p>
              </div>
            </div>
            
            <div className="modal-rating-section">
              <label className="modal-label">Đánh giá của bạn</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="star-button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? "#FFD700" : "none"}
                      color={(hoverRating || rating) >= star ? "#FFD700" : "#D1D5DB"}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="modal-review-section">
              <label className="modal-label">Nhận xét của bạn</label>
              <textarea
                className="modal-textarea"
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
              <div className="character-count">{review.length}/500 ký tự</div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={closeRatingModal}>
                Hủy
              </button>
              <button className="modal-button submit" onClick={handleSubmitRating} disabled={ratingSubmitting}>
                {ratingSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
