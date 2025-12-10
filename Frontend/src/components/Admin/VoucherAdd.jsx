import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import './VoucherForm.css'

export default function VoucherAdd({ onBack, onAdd }) {
  const today = new Date().toISOString().split('T')[0]
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    percent: 0,
    maxValue: 0,
    minValue: 0,
    quantity: 0,
    description: '',
    startDate: today,
    endDate: ''
  })

  const handleAdd = () => {
    if (newVoucher.code && newVoucher.percent > 0 && newVoucher.endDate) {
      const voucherData = {
        code: newVoucher.code,
        startDate: newVoucher.startDate,
        endDate: newVoucher.endDate,
        percent: newVoucher.percent,
        maxValue: newVoucher.maxValue,
        minValue: newVoucher.minValue,
        quantity: newVoucher.quantity,
        description: newVoucher.description,
      }
      onAdd(voucherData)
    }
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
        </div>

        <div className="voucher-form-card">
          <div className="voucher-form-card-header">
            <h2 className="voucher-form-title">Thêm phiếu giảm giá mới</h2>
            <p className="voucher-form-subtitle">Tất cả phiếu giảm giá được tính theo phần trăm (%)</p>
          </div>
          <div className="voucher-form-card-content">
            <div className="voucher-form-fields">
              {/* Voucher Code */}
              <div className="form-group">
                <label htmlFor="code" className="form-label">Mã phiếu *</label>
                <input
                  id="code"
                  type="text"
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SUMMER2025"
                  className="form-input"
                />
                <p className="form-hint">Mã phiếu sẽ tự động chuyển thành chữ hoa</p>
              </div>

              {/* Percent */}
              <div className="form-group">
                <label htmlFor="percent" className="form-label">Phần trăm giảm (%) *</label>
                <input
                  id="percent"
                  type="number"
                  min="0"
                  max="100"
                  value={newVoucher.percent}
                  onChange={(e) => setNewVoucher({ ...newVoucher, percent: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 10, 20, 30..."
                  className="form-input"
                />
                <p className="form-hint">
                  {newVoucher.percent > 0 
                    ? `Giảm ${newVoucher.percent}% trên giá trị đơn hàng`
                    : 'Nhập phần trăm giảm giá (0-100)'}
                </p>
              </div>

              {/* Min Value */}
              <div className="form-group">
                <label htmlFor="minValue" className="form-label">Giá trị đơn hàng tối thiểu (VNĐ) *</label>
                <input
                  id="minValue"
                  type="number"
                  min="0"
                  value={newVoucher.minValue}
                  onChange={(e) => setNewVoucher({ ...newVoucher, minValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 100000"
                  className="form-input"
                />
                <p className="form-hint">
                  {newVoucher.minValue > 0 
                    ? `Phiếu chỉ áp dụng cho đơn hàng từ ${formatCurrency(newVoucher.minValue)}`
                    : 'Nhập 0 nếu không có điều kiện tối thiểu'}
                </p>
              </div>

              {/* Max Value */}
              <div className="form-group">
                <label htmlFor="maxValue" className="form-label">Giá trị giảm tối đa (VNĐ) *</label>
                <input
                  id="maxValue"
                  type="number"
                  min="0"
                  value={newVoucher.maxValue}
                  onChange={(e) => setNewVoucher({ ...newVoucher, maxValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 1000000"
                  className="form-input"
                />
                <p className="form-hint">
                  {newVoucher.maxValue > 0 
                    ? `Số tiền giảm tối đa: ${formatCurrency(newVoucher.maxValue)}`
                    : 'Giới hạn số tiền giảm tối đa'}
                </p>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">Số lượng khả dụng *</label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newVoucher.quantity}
                  onChange={(e) => setNewVoucher({ ...newVoucher, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="VD: 100"
                  className="form-input"
                />
                <p className="form-hint">
                  {newVoucher.quantity > 0 
                    ? `${newVoucher.quantity} phiếu khả dụng`
                    : 'Số lượng phiếu có thể sử dụng'}
                </p>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">Mô tả</label>
                <textarea
                  id="description"
                  value={newVoucher.description}
                  onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
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
                  value={newVoucher.startDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, startDate: e.target.value })}
                  className="form-input"
                />
                <p className="form-hint">
                  Bắt đầu: {formatDate(newVoucher.startDate)}
                </p>
              </div>

              {/* End Date */}
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">Ngày kết thúc *</label>
                <input
                  id="endDate"
                  type="date"
                  min={newVoucher.startDate}
                  value={newVoucher.endDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                  className="form-input"
                />
                {newVoucher.endDate && (
                  <p className="form-hint">
                    Phiếu hết hạn vào: {formatDate(newVoucher.endDate)}
                  </p>
                )}
              </div>

              {/* Summary Box */}
              {newVoucher.code && newVoucher.percent > 0 && (
                <div className="voucher-summary">
                  <h4 className="voucher-summary-title">Tóm tắt phiếu giảm giá:</h4>
                  <p className="voucher-summary-item">• Mã: <span className="voucher-summary-value">{newVoucher.code}</span></p>
                  <p className="voucher-summary-item">• Giảm: <span className="voucher-summary-value">{newVoucher.percent}%</span></p>
                  <p className="voucher-summary-item">• Đơn tối thiểu: <span className="voucher-summary-value">{formatCurrency(newVoucher.minValue)}</span></p>
                  <p className="voucher-summary-item">• Giảm tối đa: <span className="voucher-summary-value">{formatCurrency(newVoucher.maxValue)}</span></p>
                  <p className="voucher-summary-item">• Số lượng: <span className="voucher-summary-value">{newVoucher.quantity}</span></p>
                </div>
              )}

              {/* Add Button */}
              <div className="form-actions">
                <button 
                  onClick={handleAdd} 
                  className="admin-btn admin-btn-primary admin-btn-lg"
                  disabled={!newVoucher.code || newVoucher.percent <= 0 || !newVoucher.endDate}
                >
                  <Plus size={20} />
                  Thêm phiếu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
