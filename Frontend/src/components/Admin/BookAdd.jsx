import { useState, useEffect } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { ImageWithFallback } from './ImageWithFallback'
import { categoryAPI } from '../../services/adminApi'
import './BookEdit.css'

export default function BookAdd({ onBack, onAdd }) {
  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    language: '',
    author: '',
    publisher: '',
    description: '',
    status: 'Active',
    size: '',
    type: '',
    price: 0,
    quantity: 0,
    publicationYear: 2024,
    imageUrl: '',
    categories: [],
    numPage: 0,
    nation: ''
  })

  const [categories, setCategories] = useState([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAll()
        setCategories(response)
      } catch (err) {
        console.error('❌ Error loading categories:', err)
      }
    }
    loadCategories()
  }, [])

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleAdd = () => {
    if (newBook.title && newBook.author) {
      const bookCategories = selectedCategoryIds.map(categoryId => ({
        category: {
          id: categoryId
        }
      }))

      onAdd({
        ...newBook,
        isbn: newBook.isbn || null,
        language: newBook.language || null,
        imageUrl: newBook.imageUrl || null,
        nation: newBook.nation || null,
        categories: bookCategories
      })
    }
  }

  const placeholderImage = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'

  return (
    <div className="book-edit-page">
      <div className="book-edit-container">
        {/* Header */}
        <div className="book-edit-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về bảng điều khiển
          </button>
        </div>

        <div className="book-edit-card">
          <div className="book-edit-card-header">
            <h2 className="book-edit-title">Thêm sách mới</h2>
          </div>
          <div className="book-edit-content">
            <div className="book-edit-grid">
              {/* Left Column - Book Image */}
              <div className="book-edit-image-section">
                <div className="book-edit-image-wrapper">
                  <ImageWithFallback
                    src={newBook.imageUrl || placeholderImage}
                    alt="Xem trước sách"
                    className="book-edit-image"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl" className="form-label">URL hình ảnh</label>
                  <input
                    id="imageUrl"
                    type="text"
                    value={newBook.imageUrl}
                    onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
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
                      <label htmlFor="title" className="form-label">Tên sách *</label>
                      <input
                        id="title"
                        type="text"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        placeholder="Nhập tên sách"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="author" className="form-label">Tác giả *</label>
                      <input
                        id="author"
                        type="text"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        placeholder="Nhập tên tác giả"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description" className="form-label">Mô tả</label>
                      <textarea
                        id="description"
                        value={newBook.description}
                        onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
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
                        value={newBook.publisher}
                        onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
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
                        value={newBook.publicationYear}
                        onChange={(e) => setNewBook({ ...newBook, publicationYear: parseInt(e.target.value) || 2024 })}
                        placeholder="VD: 2024"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="isbn" className="form-label">ISBN</label>
                      <input
                        id="isbn"
                        type="text"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        placeholder="VD: 978-3-16-148410-0"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="language" className="form-label">Ngôn ngữ</label>
                      <input
                        id="language"
                        type="text"
                        value={newBook.language}
                        onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                        placeholder="VD: Tiếng Việt, English..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nation" className="form-label">Quốc gia</label>
                      <input
                        id="nation"
                        type="text"
                        value={newBook.nation}
                        onChange={(e) => setNewBook({ ...newBook, nation: e.target.value })}
                        placeholder="VD: Việt Nam, Mỹ..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="type" className="form-label">Loại sách</label>
                      <input
                        id="type"
                        type="text"
                        value={newBook.type}
                        onChange={(e) => setNewBook({ ...newBook, type: e.target.value })}
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
                        value={newBook.numPage}
                        onChange={(e) => setNewBook({ ...newBook, numPage: parseInt(e.target.value) || 0 })}
                        placeholder="VD: 300"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="size" className="form-label">Kích thước</label>
                      <input
                        id="size"
                        type="text"
                        value={newBook.size}
                        onChange={(e) => setNewBook({ ...newBook, size: e.target.value })}
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
                        value={newBook.price}
                        onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
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
                        value={newBook.quantity}
                        onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 0 })}
                        placeholder="VD: 100"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status" className="form-label">Trạng thái</label>
                      <select
                        id="status"
                        value={newBook.status}
                        onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
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

                {/* Add Button */}
                <div className="form-actions">
                  <button 
                    onClick={handleAdd} 
                    className="admin-btn admin-btn-primary admin-btn-lg"
                    disabled={!newBook.title || !newBook.author}
                  >
                    <Plus size={20} />
                    Thêm sách
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
