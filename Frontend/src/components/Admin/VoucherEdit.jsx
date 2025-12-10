import { useState } from 'react'
import { ArrowLeft, Trash2, Save } from 'lucide-react'
import './VoucherForm.css'

export default function VoucherEdit({ voucher, onBack, onSave, onDelete }) {
  const [editedVoucher, setEditedVoucher] = useState(voucher)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    onSave(editedVoucher)
  }

  const handleDelete = () => {
    onDelete(voucher.code)
    setShowDeleteConfirm(false)
  }

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}₫`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="voucher-form-page">
      <div className="voucher-form-container">
        {/* Header */}
        <div className="voucher-form-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về kho phiếu giảm giá
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="admin-btn admin-btn-danger">
            <Trash2 size={20} />
            Xóa phiếu
          </button>
        </div>

        <div className="voucher-form-card">
          <div className="voucher-form-card-header">
            <h2 className="voucher-form-title">Chỉnh sửa chi tiết phiếu</h2>
            <p className="voucher-form-subtitle">Tất cả phiếu giảm giá được tính theo phần trăm (%)</p>
          </div>
          <div className="voucher-form-card-content">
            <div className="voucher-form-fields">
              {/* Voucher Code (Read-only) */}
              <div className="form-group">
                <label htmlFor="code" className="form-label">Mã phiếu</label>
                <input
                  id="code"
                  type="text"
                  value={editedVoucher.code}
                  readOnly
                  className="form-input form-input-readonly"
                />
                <p className="form-hint">Mã phiếu không thể thay đổi</p>
              </div>

              {/* Percent */}
              <div className="form-group">
                <label htmlFor="percent" className="form-label">Phần trăm giảm (%)</label>
                <input
                  id="percent"
                  type="number"
                  min="0"
                  max="100"
                  value={editedVoucher.percent}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, percent: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 10, 20, 30..."
                  className="form-input"
                />
                <p className="form-hint">
                  {editedVoucher.percent > 0 
                    ? `Giảm ${editedVoucher.percent}% trên giá trị đơn hàng`
                    : 'Nhập phần trăm giảm giá (0-100)'}
                </p>
              </div>

              {/* Min Value */}
              <div className="form-group">
                <label htmlFor="minValue" className="form-label">Giá trị đơn hàng tối thiểu (VNĐ)</label>
                <input
                  id="minValue"
                  type="number"
                  min="0"
                  value={editedVoucher.minValue}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, minValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 100000"
                  className="form-input"
                />
                <p className="form-hint">
                  {editedVoucher.minValue > 0 
                    ? `Phiếu chỉ áp dụng cho đơn hàng từ ${formatCurrency(editedVoucher.minValue)}`
                    : 'Nhập 0 nếu không có điều kiện tối thiểu'}
                </p>
              </div>

              {/* Max Value */}
              <div className="form-group">
                <label htmlFor="maxValue" className="form-label">Giá trị giảm tối đa (VNĐ)</label>
                <input
                  id="maxValue"
                  type="number"
                  min="0"
                  value={editedVoucher.maxValue}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, maxValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 1000000"
                  className="form-input"
                />
                <p className="form-hint">
                  {editedVoucher.maxValue > 0 
                    ? `Số tiền giảm tối đa: ${formatCurrency(editedVoucher.maxValue)}`
                    : 'Giới hạn số tiền giảm tối đa'}
                </p>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">Số lượng khả dụng</label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  value={editedVoucher.quantity}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="VD: 100"
                  className="form-input"
                />
                <p className="form-hint">
                  {editedVoucher.quantity > 0 
                    ? `${editedVoucher.quantity} phiếu khả dụng`
                    : 'Số lượng phiếu có thể sử dụng'}
                </p>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">Mô tả</label>
                <textarea
                  id="description"
                  value={editedVoucher.description}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, description: e.target.value })}
                  placeholder="VD: 10% off cho khách hàng mới"
                  rows={4}
                  className="form-textarea"
                />
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                <input
                  id="startDate"
                  type="date"
                  value={editedVoucher.startDate}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, startDate: e.target.value })}
                  className="form-input"
                />
                <p className="form-hint">
                  Bắt đầu: {formatDate(editedVoucher.startDate)}
                </p>
              </div>

              {/* End Date */}
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
                <input
                  id="endDate"
                  type="date"
                  min={editedVoucher.startDate}
                  value={editedVoucher.endDate}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, endDate: e.target.value })}
                  className="form-input"
                />
                {editedVoucher.endDate && (
                  <p className="form-hint">
                    Phiếu hết hạn vào: {formatDate(editedVoucher.endDate)}
                  </p>
                )}
              </div>

              {/* Summary Box */}
              {editedVoucher.code && editedVoucher.percent > 0 && (
                <div className="voucher-summary">
                  <h4 className="voucher-summary-title">Tóm tắt phiếu giảm giá:</h4>
                  <p className="voucher-summary-item">• Mã: <span className="voucher-summary-value">{editedVoucher.code}</span></p>
                  <p className="voucher-summary-item">• Giảm: <span className="voucher-summary-value">{editedVoucher.percent}%</span></p>
                  <p className="voucher-summary-item">• Đơn tối thiểu: <span className="voucher-summary-value">{formatCurrency(editedVoucher.minValue)}</span></p>
                  <p className="voucher-summary-item">• Giảm tối đa: <span className="voucher-summary-value">{formatCurrency(editedVoucher.maxValue)}</span></p>
                  <p className="voucher-summary-item">• Số lượng: <span className="voucher-summary-value">{editedVoucher.quantity}</span></p>
                </div>
              )}

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Bạn có chắc chắn?</h3>
            <p className="modal-message">
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn phiếu giảm giá "{voucher.code}" khỏi hệ thống của bạn.
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
