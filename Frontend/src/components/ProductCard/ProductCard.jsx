import { ShoppingCart, Star } from "lucide-react"
import "./ProductCard.css"

export default function ProductCard({ book, onNavigate }) {
  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "star filled" : "star empty"} />
    ))
  }

  const handleCardClick = () => {
    onNavigate?.("product-detail", book.id)
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

        <button className="add-to-cart-btn">
          <ShoppingCart size={18} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  )
}
