import { useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import './BookDelete.css'

export default function BookDelete({ books, onBack, onDelete }) {
  const [deletingBookId, setDeletingBookId] = useState(null)

  const handleDelete = (bookId) => {
    onDelete(bookId)
    setDeletingBookId(null)
  }

  const getStockBadgeColor = (quantity) => {
    if (quantity === 0) return '#999'
    if (quantity < 10) return '#e7000b'
    return '#155dfc'
  }

  const getStockLabel = (quantity) => {
    if (quantity === 0) return 'Hết hàng'
    if (quantity < 10) return 'Sắp hết'
    return 'Còn hàng'
  }

  return (
    <div className="book-delete-page">
      <div className="book-delete-container">
        {/* Header */}
        <div className="book-delete-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về bảng điều khiển
          </button>
        </div>

        <div className="book-delete-card">
          <div className="book-delete-card-header">
            <h2 className="book-delete-title">Xóa sách</h2>
            <p className="book-delete-subtitle">Chọn một cuốn sách để xóa khỏi kho</p>
          </div>
          <div className="book-delete-content">
            {books.length === 0 ? (
              <div className="book-delete-empty">
                <p>Không có sách nào trong kho</p>
              </div>
            ) : (
              <div className="book-delete-list">
                {books.map((book) => (
                  <div key={book.id} className="book-delete-item">
                    <div className="book-delete-item-content">
                      {/* Book Image */}
                      <div className="book-delete-item-image">
                        <ImageWithFallback
                          src={book.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                          alt={book.title}
                          className="book-image-small"
                        />
                      </div>

                      {/* Book Details */}
                      <div className="book-delete-item-details">
                        <h3 className="book-delete-item-title">{book.title}</h3>
                        <p className="book-delete-item-author">của {book.author}</p>
                        <p className="book-delete-item-desc">{book.description}</p>
                        <div className="book-delete-item-stock">
                          <div className="stock-info">
                            <span className="stock-label">Tồn kho:</span>
                            <div 
                              className="stock-badge"
                              style={{ backgroundColor: getStockBadgeColor(book.quantity) }}
                            >
                              {book.quantity} cuốn
                            </div>
                          </div>
                          <span 
                            className="stock-status"
                            style={{ color: getStockBadgeColor(book.quantity) }}
                          >
                            {getStockLabel(book.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="book-delete-item-action">
                        <button 
                          className="admin-btn admin-btn-danger"
                          onClick={() => setDeletingBookId(book.id)}
                        >
                          <Trash2 size={16} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingBookId && (
        <div className="modal-overlay" onClick={() => setDeletingBookId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Xóa "{books.find(b => b.id === deletingBookId)?.title}"?</h3>
            <p className="modal-message">
              Hành động này không thể hoàn tác. Sách "{books.find(b => b.id === deletingBookId)?.title}" của {books.find(b => b.id === deletingBookId)?.author} sẽ bị xóa vĩnh viễn khỏi kho.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeletingBookId(null)} className="admin-btn admin-btn-outline">
                Hủy
              </button>
              <button onClick={() => handleDelete(deletingBookId)} className="admin-btn admin-btn-danger">
                Xóa sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
