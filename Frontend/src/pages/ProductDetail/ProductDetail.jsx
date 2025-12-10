"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Star } from "lucide-react"
import "./ProductDetail.css"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

export default function ProductDetail({ onNavigate, currentUser, setCurrentUser, bookId }) {
  const [activeTab, setActiveTab] = useState("intro")
  const [review, setReview] = useState("")
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await axios.get(`http://localhost:8080/book/${bookId}`)
        setBook(res.data)
      } catch (err) {
        const message = err?.response?.data || "Không thể tải thông tin sách"
        setError(typeof message === "string" ? message : "Không thể tải thông tin sách")
      } finally {
        setLoading(false)
      }
    }

    if (bookId) fetchBook()
  }, [bookId])

  const rating = useMemo(() => {
    if (!book) return 0
    const raw = book.averageRating ?? book.AverageRating ?? 0
    return Math.max(0, Math.min(5, Number(raw)))
  }, [book])

  const sold = useMemo(() => (book?.quantity != null ? book.quantity : 0), [book])

  const categories = useMemo(() => {
    if (!Array.isArray(book?.categories)) return []
    return book.categories.map((c) => c.category?.name || c.name).filter(Boolean)
  }, [book])

  const renderStars = (value) => (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < Math.round(value) ? "filled" : ""} />
      ))}
    </div>
  )

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="product-detail">
        <div className="breadcrumb">
          <span onClick={() => onNavigate?.("home")} className="breadcrumb-link">
            Trang chủ
          </span>
          <span className="breadcrumb-separator">/</span>
          <span>{book?.title || "Chi tiết sách"}</span>
        </div>

        {loading && <div className="product-loading">Đang tải thông tin sách...</div>}

        {!loading && error && (
          <div className="product-error">
            <p>{error}</p>
            <button className="review-submit" onClick={() => onNavigate?.("home")}>
              Về trang chủ
            </button>
          </div>
        )}

        {!loading && !error && book && (
          <>
            <div className="product-container">
              <div className="product-left">
                <div className="product-image-wrapper">
                  <img src={book.imageUrl || "/placeholder.svg"} alt={book.title} className="product-image" />
                </div>

                <div className="product-info-box">
                  <h2 className="product-title">{book.title}</h2>

                  <div className="product-meta">
                    <div className="rating">
                      {renderStars(rating)}
                      <span className="rating-value">{rating.toFixed(1)}</span>
                      <span className="view-count">{sold} đã bán</span>
                    </div>
                  </div>

                  <div className="status-section">
                    <div className={`status-badge ${book.status === "Active" ? "in-stock" : "out-of-stock"}`}>
                      {book.status === "Active" ? "Còn hàng" : "Tạm hết hàng"}
                    </div>
                    {book.price ? (
                      <div className="price-row">
                        <span className="price">{book.price.toLocaleString()} đ</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="author-section">
                    <p className="author-label">Tác giả:</p>
                    <p className="author-name">{book.author || "Đang cập nhật"}</p>
                    <p className="publisher-label">Nhà xuất bản:</p>
                    <p className="publisher-name">{book.publisher || "Đang cập nhật"}</p>
                    {categories.length > 0 && (
                      <p className="categories-line">Thể loại: {categories.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="product-details">
              <h3>Thông tin xuất bản</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Năm xuất bản:</span>
                  <span className="detail-value">{book.publicationYear || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Số trang:</span>
                  <span className="detail-value">{book.numPage || book.NumPage || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kích thước:</span>
                  <span className="detail-value">{book.size || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ngôn ngữ:</span>
                  <span className="detail-value">{book.language || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Quốc gia:</span>
                  <span className="detail-value">{book.nation || book.Nation || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nhà xuất bản:</span>
                  <span className="detail-value">{book.publisher || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mã ISBN:</span>
                  <span className="detail-value">{book.isbn || book.ISBN || "-"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Loại sách:</span>
                  <span className="detail-value">{book.type || "-"}</span>
                </div>
              </div>
            </div>

            <div className="description-section">
              <div className="description-tabs">
                <button
                  className={`tab ${activeTab === "intro" ? "active" : ""}`}
                  onClick={() => setActiveTab("intro")}
                >
                  Giới thiệu
                </button>
                <button
                  className={`tab ${activeTab === "curriculum" ? "active" : ""}`}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Mục lục
                </button>
              </div>

              <div className="description-content">
                {activeTab === "intro" && (
                  <div className="tab-content">
                    <h4>Giới thiệu</h4>
                    <p>{book.description || "Chưa có mô tả"}</p>
                  </div>
                )}
                {activeTab === "curriculum" && (
                  <div className="tab-content">
                    <h4>Mục lục</h4>
                    <p>Đang cập nhật</p>
                  </div>
                )}
              </div>
            </div>

            <div className="reviews-section">
              <h3>Bình luận</h3>
              <div className="review-input">
                <textarea
                  placeholder="Để lại bình luận của bạn..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="review-textarea"
                />
                <div className="review-footer">
                  <span className="char-count">0/1500</span>
                  <button className="review-submit">Gửi bình luận</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
