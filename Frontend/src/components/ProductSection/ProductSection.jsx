import ProductCard from "../ProductCard/ProductCard"
import { ChevronRight } from "lucide-react"
import "./ProductSection.css"

export default function ProductSection({ title, viewAllLink, books, onNavigate, currentUser, onCartUpdate, onViewAll }) {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="category" className="view-all-link" onClick={(e) => { e.preventDefault(); onViewAll ? onViewAll() : onNavigate?.("category"); }}>
          {viewAllLink} <ChevronRight size={16} />
        </a>
      </div>

      <div className="products-grid">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} onNavigate={onNavigate} currentUser={currentUser} onCartUpdate={onCartUpdate} />
        ))}
      </div>
    </section>
  )
}
