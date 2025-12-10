import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import ProductCard from "../../components/ProductCard/ProductCard"
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar"
import "./Category.css"

const SORT_OPTIONS = [
  { value: "newest", label: "Năm xuất bản: Mới nhất" },
  { value: "oldest", label: "Năm xuất bản: Cũ nhất" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
]

const ITEMS_PER_PAGE = 6

const mapBookFromApi = (book, idx) => {
  const price = Number(book.price) || 0
  const avgRating = Number(book.averageRating ?? book.AverageRating ?? 0)
  return {
    id: book.id ?? idx,
    title: book.title ?? "Chưa có tên",
    author: book.author ?? "Đang cập nhật",
    image: book.imageUrl || "https://placehold.co/200x280",
    price,
    originalPrice: price ? Math.round(price * 1.1) : null,
    rating: Math.max(0, Math.min(5, Math.round(avgRating))),
    soldCount: book.quantity ?? 0,
    publicationYear: book.publicationYear ?? 0,
    categories: Array.isArray(book.categories) ? book.categories : [],
    badge: book.status && book.status !== "Active" ? book.status : null,
    status: book.status ?? null,
    stockQuantity: typeof book.stockQuantity === "number" ? book.stockQuantity : book.quantity ?? null,
  }
}

const bookHasCategory = (book, categoryId) => {
  if (!categoryId) return true
  const categories = Array.isArray(book.categories) ? book.categories : []
  return categories.some((entry) => {
    const category = entry.category || entry
    return category?.id === categoryId
  })
}

export default function Category({ onNavigate, currentUser, setCurrentUser, categoryId }) {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshCartCount, setRefreshCartCount] = useState(null)

  const numericCategoryId = categoryId ? Number(categoryId) : null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError("")
      try {
        const [bookRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:8080/book"),
          axios.get("http://localhost:8080/category"),
        ])

        const mappedBooks = (Array.isArray(bookRes.data) ? bookRes.data : []).map(mapBookFromApi)
        setBooks(mappedBooks)
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : [])
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.")
        console.error("Failed to load category data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const sortBooks = (list, sortOption) => {
    const sorted = [...list]

    switch (sortOption) {
      case "newest":
        return sorted.sort((a, b) => (b.publicationYear || 0) - (a.publicationYear || 0))
      case "oldest":
        return sorted.sort((a, b) => (a.publicationYear || 0) - (b.publicationYear || 0))
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      default:
        return sorted
    }
  }

  const filteredBooks = useMemo(() => {
    const results = books.filter((book) => bookHasCategory(book, numericCategoryId))
    return sortBooks(results, sortBy)
  }, [books, numericCategoryId, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [numericCategoryId, sortBy, books])

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE))

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBooks, currentPage])

  const currentCategoryName = useMemo(() => {
    if (!numericCategoryId) return null
    return categories.find((c) => c.id === numericCategoryId)?.name || null
  }, [categories, numericCategoryId])

  const handleSortChange = (value) => {
    setSortBy(value)
    setShowSortDropdown(false)
  }

  const getCurrentSortLabel = () => {
    return SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || "Sắp xếp"
  }

  const handleSelectCategory = (categoryId) => {
    onNavigate?.("category", null, null, null, null, categoryId)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <>
      <Header 
        onNavigate={onNavigate} 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser}
        onCartCountUpdate={setRefreshCartCount}
      />

      <div className="category-page">
        <div className="category-layout">
          <div className="category-sidebar">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={numericCategoryId}
              onSelectCategory={handleSelectCategory}
              onViewAllCategories={() => onNavigate?.("category")}
            />
          </div>

          <div className="category-container">
            <div className="category-header">
              <div className="category-info">
                <h1 className="category-title">
                  {numericCategoryId ? `Danh mục: ${currentCategoryName || "Đang cập nhật"}` : "Tất cả danh mục"}
                </h1>
                <p className="category-count">
                  {error ? "" : <>Tìm thấy <strong>{filteredBooks.length}</strong> sản phẩm</>}
                </p>
              </div>

              <div className="category-controls">
                <div className="sort-dropdown-container">
                  <button 
                    className="sort-button"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <SlidersHorizontal size={18} />
                    <span>{getCurrentSortLabel()}</span>
                    <ChevronDown size={18} />
                  </button>

                  {showSortDropdown && (
                    <div className="sort-dropdown">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className={`sort-option ${sortBy === option.value ? "active" : ""}`}
                          onClick={() => handleSortChange(option.value)}
                        >
                          {option.label}
                          {sortBy === option.value && <span className="check-mark">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <div className="category-loading">Đang tải dữ liệu...</div>
            )}

            {error && !loading && (
              <div className="no-results">
                <div className="no-results-icon">⚠️</div>
                <h3>{error}</h3>
                <button className="back-home-btn" onClick={() => window.location.reload()}>
                  Thử lại
                </button>
              </div>
            )}

            {!loading && !error && (
              filteredBooks.length > 0 ? (
                <div className="category-results">
                  {paginatedBooks.map((book) => (
                    <ProductCard
                      key={book.id}
                      book={{
                        ...book,
                        reviews: book.soldCount
                      }}
                      onNavigate={onNavigate}
                      currentUser={currentUser}
                      onCartUpdate={refreshCartCount}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">📚</div>
                  <h3>{numericCategoryId ? "Chưa có sách cho danh mục này" : "Chưa có sách"}</h3>
                  <button className="back-home-btn" onClick={() => onNavigate("home")}>
                    Về trang chủ
                  </button>
                </div>
              )
            )}

            {!loading && !error && filteredBooks.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                  ←
                </button>
                <span className="pagination-info">Trang {currentPage} / {totalPages}</span>
                <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  )
}
