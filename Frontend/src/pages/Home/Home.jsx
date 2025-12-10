import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../../components/Header/Header"
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar"
import FeaturedCarousel from "../../components/FeaturedCarousel/FeaturedCarousel"
import ProductSection from "../../components/ProductSection/ProductSection"
import Footer from "../../components/Footer/Footer"
import "./Home.css"

const BOOKS_PER_PAGE = 6

export default function Home({ onNavigate, currentUser, setCurrentUser }) {
  const [allBooks, setAllBooks] = useState([])
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [featuredLoading, setFeaturedLoading] = useState(false)
  const [featuredError, setFeaturedError] = useState("")
  const [categories, setCategories] = useState([])
  const [refreshCartCount, setRefreshCartCount] = useState(null)
  const [newBooks, setNewBooks] = useState([])
  const [newBooksLoading, setNewBooksLoading] = useState(false)

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setFeaturedLoading(true)
      setFeaturedError("")

      try {
        const response = await axios.get("http://localhost:8080/book")
        const data = response.data

        const mappedBooks = (Array.isArray(data) ? data : []).map((book, idx) => {
          const price = Number(book.price) || 0
          const avgRating = typeof book.averageRating === "number" ? book.averageRating : 0
          return {
            id: book.id ?? idx,
            title: book.title ?? "Chưa có tên",
            author: book.author ?? "Đang cập nhật",
            image: book.imageUrl || bookImages[idx % bookImages.length],
            price,
            originalPrice: price ? Math.round(price * 1.1) : null,
            rating: Math.max(0, Math.min(5, Math.round(avgRating))),
            reviews: book.quantity ?? 0,
            badge: book.status && book.status !== "Active" ? book.status : null,
            status: book.status ?? null,
            stockQuantity: typeof book.stockQuantity === "number" ? book.stockQuantity : book.quantity ?? null,
          }
        })

        setAllBooks(mappedBooks)
        setCurrentPage(1)
      } catch (error) {
        setFeaturedError("Không thể tải danh sách sách. Vui lòng thử lại.")
        console.error("Failed to load featured books", error)
      } finally {
        setFeaturedLoading(false)
      }
    }

    fetchFeaturedBooks()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/category")
        setCategories(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Failed to load categories", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchNewBooks = async () => {
      setNewBooksLoading(true)

      try {
        const response = await axios.get("http://localhost:8080/book")
        const data = response.data

        const sortedBooks = (Array.isArray(data) ? data : [])
          .filter(book => book.publicationYear)
          .sort((a, b) => b.publicationYear - a.publicationYear)
          .slice(0, 4)
          .map((book, idx) => ({
            id: book.id ?? idx,
            title: book.title ?? "Chưa có tên",
            image: book.imageUrl || bookImages[idx % bookImages.length],
            publicationYear: book.publicationYear,
            status: book.status ?? null,
            stockQuantity: typeof book.stockQuantity === "number" ? book.stockQuantity : book.quantity ?? null,
          }))

        setNewBooks(sortedBooks)
      } catch (error) {
        console.error("Failed to load new books", error)
      } finally {
        setNewBooksLoading(false)
      }
    }

    fetchNewBooks()
  }, [])

  useEffect(() => {
    const startIdx = (currentPage - 1) * BOOKS_PER_PAGE
    const endIdx = startIdx + BOOKS_PER_PAGE
    setFeaturedBooks(allBooks.slice(startIdx, endIdx))
  }, [allBooks, currentPage])

  const totalPages = Math.ceil(allBooks.length / BOOKS_PER_PAGE)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="home-container">
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />

      <div className="home-content">
        <CategorySidebar
          categories={categories}
          onSelectCategory={(categoryId) => onNavigate?.("category", null, null, null, null, categoryId)}
          onViewAllCategories={() => onNavigate?.("category")}
        />

        <main className="home-main">
          {newBooksLoading ? (
            <p className="section-loading">Đang tải sách mới...</p>
          ) : (
            <FeaturedCarousel books={newBooks} onNavigate={onNavigate} />
          )}

          {featuredError && <p className="section-error">{featuredError}</p>}
          {featuredLoading && <p className="section-loading">Đang tải sách...</p>}
          <ProductSection title="Sách nổi bật" viewAllLink="Xem toàn bộ" books={featuredBooks} onNavigate={onNavigate} currentUser={currentUser} onCartUpdate={refreshCartCount} onViewAll={() => onNavigate?.("category")} />

          {!featuredError && !featuredLoading && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="pagination-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
