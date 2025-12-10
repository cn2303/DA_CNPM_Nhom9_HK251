import { useState, useEffect } from 'react'
import { Search, History, Plus, Ticket, Users, Trash2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import './AdminDashboard.css'

export default function AdminDashboard({ 
  books, 
  onNavigateToOrders, 
  onNavigateToVouchers, 
  onNavigateToCustomers, 
  onBookClick, 
  onAddBook, 
  onDeleteBook,
  onLogout 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 12

  const handleBookClick = (bookId) => {
    if (onBookClick) {
      onBookClick(bookId)
    }
  }

  const getStockBadgeColor = (status) => {
    if (status === 'Active') return '#22c55e'
    if (status === 'Inactive') return '#999'
    return '#999'
  }

  const getStockLabel = (status) => {
    if (status === 'Active') return 'Active'
    if (status === 'Inactive') return 'Inactive'
    return status
  }

  const filteredBooks = books.filter((book) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const titleMatch = book.title.toLowerCase().includes(query)
    const authorMatch = book.author.toLowerCase().includes(query)
    const isbnMatch = book.isbn?.toLowerCase().includes(query)
    
    return titleMatch || authorMatch || isbnMatch
  })

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Bảng điều khiển quản trị</h1>
          </div>
          <div className="admin-header-actions">
            <button onClick={onDeleteBook} className="admin-btn admin-btn-danger">
              <Trash2 size={18} />
              Xóa sách
            </button>
            <button onClick={onAddBook} className="admin-btn admin-btn-primary">
              <Plus size={18} />
              Thêm sách
            </button>
            <div className="header-divider" />
            <button onClick={onLogout} className="admin-btn admin-btn-outline">
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="admin-search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm sách theo tên, tác giả hoặc ISBN..."
            className="admin-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Cards */}
        <div className="admin-action-cards">
          <div className="action-card action-card-primary">
            <div className="action-card-header">
              <h3 className="action-card-title">
                <History size={20} />
                Đơn hàng
              </h3>
              <p className="action-card-desc">Xem và quản lý tất cả đơn hàng của khách</p>
            </div>
            <div className="action-card-content">
              <button onClick={onNavigateToOrders} className="admin-btn admin-btn-full">
                Xem lịch sử đơn hàng
              </button>
            </div>
          </div>

          <div className="action-card action-card-green">
            <div className="action-card-header">
              <h3 className="action-card-title">
                <Ticket size={20} />
                Voucher
              </h3>
              <p className="action-card-desc">Quản lý mã giảm giá cho giỏ hàng</p>
            </div>
            <div className="action-card-content">
              <button onClick={onNavigateToVouchers} className="admin-btn admin-btn-full">
                Xem kho voucher
              </button>
            </div>
          </div>

          <div className="action-card action-card-purple">
            <div className="action-card-header">
              <h3 className="action-card-title">
                <Users size={20} />
                Khách hàng
              </h3>
              <p className="action-card-desc">Tìm kiếm và chỉnh sửa hồ sơ khách hàng</p>
            </div>
            <div className="action-card-content">
              <button onClick={onNavigateToCustomers} className="admin-btn admin-btn-full">
                Xem quản lý khách hàng
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="books-section">
          <div className="books-header">
            <h2 className="books-title">Kho sách</h2>
            {searchQuery && (
              <p className="books-result-count">
                Tìm thấy {filteredBooks.length} kết quả
              </p>
            )}
          </div>
          {filteredBooks.length === 0 ? (
            <div className="books-empty">
              <p>
                {searchQuery ? 'Không tìm thấy sách nào phù hợp' : 'Không có sách nào trong kho'}
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {currentBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="book-card"
                  onClick={() => handleBookClick(book.id)}
                >
                  {/* Image Container */}
                  <div className="book-image-container">
                    <ImageWithFallback
                      src={book.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                      alt={book.title}
                      className="book-image"
                    />
                  </div>

                  {/* Title */}
                  <div className="book-title-container">
                    <p className="book-title">{book.title}</p>
                  </div>

                  {/* Author */}
                  <div className="book-author-container">
                    <p className="book-author">{book.author}</p>
                  </div>

                  {/* Stock Information */}
                  <div className="book-stock-container">
                    <div className="book-stock-row">
                      <div>
                        <p className="book-stock-label">Tồn kho</p>
                      </div>
                      <div 
                        className="book-stock-badge"
                        style={{ backgroundColor: getStockBadgeColor(book.status) }}
                      >
                        <p className="book-stock-badge-text">{book.quantity} cuốn</p>
                      </div>
                    </div>
                    <div className="book-status-row">
                      <p 
                        className="book-status-text"
                        style={{ color: getStockBadgeColor(book.status) }}
                      >
                        {getStockLabel(book.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-outline pagination-btn"
            >
              <ChevronLeft size={18} />
              Trang trước
            </button>
            <div className="pagination-info">
              <p className="pagination-text">Trang {currentPage} / {totalPages}</p>
              <span className="pagination-count">({filteredBooks.length} sách)</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-outline pagination-btn"
            >
              Trang sau
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
