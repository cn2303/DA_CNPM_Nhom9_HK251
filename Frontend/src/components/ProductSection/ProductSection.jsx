import ProductCard from "../ProductCard/ProductCard"
import { ChevronRight } from "lucide-react"
import "./ProductSection.css"

export default function ProductSection({ title, viewAllLink, books, onNavigate }) {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); onNavigate?.("home"); }}>
          {viewAllLink} <ChevronRight size={16} />
        </a>
      </div>

      <div className="products-grid">
        {books.map((book) => (
          <ProductCard key={book.id} book={book} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  )
}
