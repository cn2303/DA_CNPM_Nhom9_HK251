import { ShoppingCart, Star } from "lucide-react"
import { authAxios, getToken } from "../../utils/auth"
import "./ProductCard.css"

export default function ProductCard({ book, onNavigate, currentUser, onCartUpdate }) {
  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "star filled" : "star empty"} />
    ))
  }

  const handleCardClick = () => {
    onNavigate?.("product-detail", book.id)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    
    if (!currentUser?.id || !getToken()) {
      onNavigate?.("login")
      return
    }

    const stockQuantity =
      typeof book.stockQuantity === "number"
        ? book.stockQuantity
        : typeof book.quantity === "number"
          ? book.quantity
          : null

    const isInactive =
      (book.status && book.status.toString().toLowerCase() !== "active") ||
      (book.badge && book.badge.toString().toLowerCase() !== "active")

    if (isInactive || (stockQuantity !== null && stockQuantity <= 0)) {
      alert("Sách đã hết hàng")
      return
    }

    try {
      await authAxios.put(`/cart/${currentUser.id}/book/${book.id}`)
      if (typeof onCartUpdate === "function") {
        await onCartUpdate()
      }
    } catch (err) {
      console.error("Failed to add to cart", err)
      if (err.response?.status === 401) {
        onNavigate?.("login")
      }
    }
  }

  return (
    <div className="product-card">
      <div className="product-image-container" onClick={handleCardClick} style={{ cursor: "pointer" }}>
        {book.badge && <div className={`product-badge ${book.badge.toLowerCase()}`}>{book.badge}</div>}
        {discount > 0 && <div className="discount-badge">-{discount}%</div>}
        <img src={book.image || "/placeholder.svg"} alt={book.title} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-title" onClick={handleCardClick} style={{ cursor: "pointer" }}>{book.title}</h3>
        <p className="product-author">{book.author}</p>

        <div className="product-rating">
          <div className="stars">{renderStars(book.rating)}</div>
          <span className="review-count">({book.reviews})</span>
        </div>

        <div className="product-price">
          <span className="price-current">{book.price.toLocaleString()}đ</span>
          {book.originalPrice && <span className="price-original">{book.originalPrice.toLocaleString()}đ</span>}
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={18} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  )
}
