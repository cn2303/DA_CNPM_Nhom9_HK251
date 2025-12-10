import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import "./Search.css"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import ProductCard from "../../components/ProductCard/ProductCard"
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar"

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

export default function Search({ onNavigate, currentUser, setCurrentUser, searchQuery: initialQuery }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "")
  const [sortBy, setSortBy] = useState("newest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshCartCount, setRefreshCartCount] = useState(null)

  useEffect(() => {
    setSearchQuery(initialQuery || "")
  }, [initialQuery])

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
        console.error("Failed to load search data", err)
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
    const query = searchQuery.toLowerCase().trim()

    const matchesQuery = (book) => {
      if (!query) return true
      return (
        book.title.toLowerCase().includes(query) ||
        (book.author || "").toLowerCase().includes(query)
      )
    }

    const results = books.filter(matchesQuery)
    return sortBooks(results, sortBy)
  }, [books, searchQuery, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, books])

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE))

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBooks, currentPage])

  const handleSortChange = (value) => {
    setSortBy(value)
    setShowSortDropdown(false)
  }

  const getCurrentSortLabel = () => {
    return SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || "Sắp xếp"
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (onNavigate) {
      onNavigate("search", null, null, null, value)
    }
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartCountUpdate={setRefreshCartCount}
      />
      
      <div className="search-page">
        <div className="search-layout">
          <div className="search-sidebar">
            <CategorySidebar
              categories={categories}
              onSelectCategory={(categoryId) => onNavigate?.("category", null, null, null, null, categoryId)}
              onViewAllCategories={() => onNavigate?.("category")}
            />
          </div>

          <div className="search-container">
            <div className="search-header">
              <div className="search-info">
                <h1 className="search-title">
                  {searchQuery ? (
                    <>
                      Kết quả tìm kiếm cho: <span className="search-keyword">"{searchQuery}"</span>
                    </>
                  ) : (
                    "Tất cả sản phẩm"
                  )}
                </h1>
                <p className="search-count">
                  {error ? "" : <>Tìm thấy <strong>{filteredBooks.length}</strong> sản phẩm</>}
                </p>
              </div>

              <div className="search-controls">
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
              <div className="search-loading">Đang tải dữ liệu...</div>
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
                <div className="search-results">
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
                  <div className="no-results-icon">🔍</div>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Không có kết quả phù hợp với từ khóa "{searchQuery}"</p>
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
