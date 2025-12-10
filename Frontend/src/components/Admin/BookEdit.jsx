import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2, Save } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { categoryAPI } from '../../services/adminApi'
import './BookEdit.css'

export default function BookEdit({ book, onBack, onSave, onDelete }) {
  const [editedBook, setEditedBook] = useState(book)
  const [categories, setCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryAPI.getAll()
        console.log('📚 Loaded categories:', data)
        setCategories(data)

        if (book.categories && book.categories.length > 0) {
          const currentCategoryIds = book.categories.map(bc => bc.category.id)
          setSelectedCategoryIds(currentCategoryIds)
        }
      } catch (err) {
        console.error('❌ Error loading categories:', err)
      }
    }
    loadCategories()
  }, [book.categories])

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSave = () => {
    const updatedCategories = selectedCategoryIds.map(categoryId => ({
      category: {
        id: categoryId
      }
    }))

    onSave({
      ...editedBook,
      categories: updatedCategories
    })
  }

  const handleDelete = () => {
    onDelete(book.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="book-edit-page">
      <div className="book-edit-container">
        {/* Header */}
        <div className="book-edit-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về bảng điều khiển
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="admin-btn admin-btn-danger">
            <Trash2 size={20} />
            Xóa sách
          </button>
        </div>

        <div className="book-edit-card">
          <div className="book-edit-card-header">
            <h2 className="book-edit-title">Chỉnh sửa thông tin sách</h2>
          </div>
          <div className="book-edit-content">
            <div className="book-edit-grid">
              {/* Left Column - Book Image */}
              <div className="book-edit-image-section">
                <div className="book-edit-image-wrapper">
                  <ImageWithFallback
                    src={editedBook.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                    alt={editedBook.title}
                    className="book-edit-image"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl" className="form-label">URL hình ảnh</label>
                  <input
                    id="imageUrl"
                    type="text"
                    value={editedBook.imageUrl || ''}
                    onChange={(e) => setEditedBook({ ...editedBook, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Right Column - Book Details */}
              <div className="book-edit-details-section">
                {/* Basic Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Thông tin cơ bản</h3>
                  <div className="form-fields">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">Tên sách</label>
                      <input
                        id="title"
                        type="text"
                        value={editedBook.title}
                        onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                        placeholder="Nhập tên sách"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="author" className="form-label">Tác giả</label>
                      <input
                        id="author"
                        type="text"
                        value={editedBook.author}
                        onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                        placeholder="Nhập tên tác giả"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description" className="form-label">Mô tả</label>
                      <textarea
                        id="description"
                        value={editedBook.description}
                        onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })}
                        placeholder="Nhập mô tả sách"
                        rows={5}
                        className="form-textarea"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Publishing Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Thông tin xuất bản</h3>
                  <div className="form-fields-grid">
                    <div className="form-group">
                      <label htmlFor="publisher" className="form-label">Nhà xuất bản</label>
                      <input
                        id="publisher"
                        type="text"
                        value={editedBook.publisher}
                        onChange={(e) => setEditedBook({ ...editedBook, publisher: e.target.value })}
                        placeholder="Nhập nhà xuất bản"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="publicationYear" className="form-label">Năm xuất bản</label>
                      <input
                        id="publicationYear"
                        type="number"
                        min="1000"
                        max="2100"
                        value={editedBook.publicationYear}
                        onChange={(e) => setEditedBook({ ...editedBook, publicationYear: parseInt(e.target.value) || 2024 })}
                        placeholder="VD: 2024"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="isbn" className="form-label">ISBN</label>
                      <input
                        id="isbn"
                        type="text"
                        value={editedBook.isbn || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, isbn: e.target.value })}
                        placeholder="VD: 978-3-16-148410-0"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="language" className="form-label">Ngôn ngữ</label>
                      <input
                        id="language"
                        type="text"
                        value={editedBook.language || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, language: e.target.value })}
                        placeholder="VD: Tiếng Việt, English..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nation" className="form-label">Quốc gia</label>
                      <input
                        id="nation"
                        type="text"
                        value={editedBook.nation || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, nation: e.target.value })}
                        placeholder="VD: Việt Nam, Mỹ..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type" className="form-label">Loại sách</label>
                      <input
                        id="type"
                        type="text"
                        value={editedBook.type}
                        onChange={(e) => setEditedBook({ ...editedBook, type: e.target.value })}
                        placeholder="VD: Tiểu thuyết, Giáo khoa..."
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Physical Specifications */}
                <div className="form-section">
                  <h3 className="form-section-title">Thông số vật lý</h3>
                  <div className="form-fields-grid">
                    <div className="form-group">
                      <label htmlFor="numPage" className="form-label">Số trang</label>
                      <input
                        id="numPage"
                        type="number"
                        min="1"
                        value={editedBook.numPage}
                        onChange={(e) => setEditedBook({ ...editedBook, numPage: parseInt(e.target.value) || 0 })}
                        placeholder="VD: 300"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="size" className="form-label">Kích thước</label>
                      <input
                        id="size"
                        type="text"
                        value={editedBook.size}
                        onChange={(e) => setEditedBook({ ...editedBook, size: e.target.value })}
                        placeholder="VD: 14.5 x 20.5 cm"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Inventory & Pricing */}
                <div className="form-section">
                  <h3 className="form-section-title">Tồn kho & Giá</h3>
                  <div className="form-fields-grid">
                    <div className="form-group">
                      <label htmlFor="price" className="form-label">Giá (VNĐ)</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        value={editedBook.price}
                        onChange={(e) => setEditedBook({ ...editedBook, price: parseFloat(e.target.value) || 0 })}
                        placeholder="VD: 150000"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="quantity" className="form-label">Số lượng tồn kho</label>
                      <input
                        id="quantity"
                        type="number"
                        min="0"
                        value={editedBook.quantity}
                        onChange={(e) => setEditedBook({ ...editedBook, quantity: parseInt(e.target.value) || 0 })}
                        placeholder="VD: 100"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status" className="form-label">Trạng thái</label>
                      <select
                        id="status"
                        value={editedBook.status}
                        onChange={(e) => setEditedBook({ ...editedBook, status: e.target.value })}
                        className="form-select"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Categories */}
                <div className="form-section">
                  <h3 className="form-section-title">Danh mục</h3>
                  <div className="category-grid">
                    {categories.map((category) => (
                      <label key={category.id} className="category-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="form-actions">
                  <button onClick={handleSave} className="admin-btn admin-btn-primary admin-btn-lg">
                    <Save size={20} />
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Bạn có chắc chắn?</h3>
            <p className="modal-message">
              Hành động này không thể hoàn tác. Sách "{book.title}" sẽ bị xóa vĩnh viễn khỏi kho.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)} className="admin-btn admin-btn-outline">
                Hủy
              </button>
              <button onClick={handleDelete} className="admin-btn admin-btn-danger">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
