import { useState } from 'react'
import { ArrowLeft, Trash2, Percent, Calendar } from 'lucide-react'
import './VoucherForm.css'

const formatCurrency = (amount) => {
  return `${amount.toLocaleString('vi-VN')}₫`
}

const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function VoucherDelete({ vouchers, voucher, onBack, onConfirmDelete }) {
  const [selectedVoucher, setSelectedVoucher] = useState(voucher || null)

  const handleDelete = (voucherCode) => {
    onConfirmDelete(voucherCode)
    setSelectedVoucher(null)
  }

  const isExpired = (endDate) => {
    if (!endDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    return end < today
  }

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}₫`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (vouchers && !selectedVoucher) {
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

          <div className="voucher-delete-card">
            <div className="voucher-delete-card-header">
              <h2 className="voucher-delete-title">Xóa phiếu giảm giá</h2>
              <p className="voucher-delete-subtitle">Chọn một phiếu để xóa khỏi kho</p>
            </div>
            <div className="voucher-delete-content">
              {vouchers.length === 0 ? (
                <div className="voucher-delete-empty">
                  <p>Không có phiếu giảm giá nào trong kho</p>
                </div>
              ) : (
                <div className="voucher-delete-list">
                  {vouchers.map((v) => (
                    <div key={v.code} className="voucher-delete-item">
                      <div className="voucher-delete-item-content">
                        <div className="voucher-delete-item-icon">
                          <Percent size={32} />
                          {isExpired(v.endDate) && (
                            <span className="voucher-expired-label">Hết hạn</span>
                          )}
                        </div>
                        <div className="voucher-delete-item-details">
                          <h3 className="voucher-delete-item-code">{v.code}</h3>
                          <p className="voucher-delete-item-discount">{v.percent}% giảm giá</p>
                          <div className="voucher-delete-item-info">
                            <span>Còn {v.quantity} phiếu</span>
                            <span>•</span>
                            <span>Đơn tối thiểu: {formatCurrency(v.minValue)}</span>
                          </div>
                          <div className="voucher-delete-item-dates">
                            <Calendar size={14} />
                            <span>{formatDate(v.startDate)} - {formatDate(v.endDate)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedVoucher(v)}
                          className="admin-btn admin-btn-danger"
                        >
                          <Trash2 size={18} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const voucherToDelete = selectedVoucher || voucher
  
  if (!voucherToDelete) {
    return null
  }

  return (
    <div className="voucher-form-page">
      <div className="voucher-form-container">
        {/* Header */}
        <div className="voucher-form-header">
          <button onClick={() => vouchers ? setSelectedVoucher(null) : onBack()} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            {vouchers ? 'Quay lại danh sách' : 'Về kho phiếu giảm giá'}
          </button>
        </div>

        <div className="voucher-delete-card">
          <div className="voucher-delete-card-header">
            <div className="voucher-delete-icon">
              <Trash2 size={48} />
            </div>
            <h2 className="voucher-delete-title">Xóa phiếu giảm giá</h2>
            <p className="voucher-delete-subtitle">
              Bạn có chắc chắn muốn xóa phiếu giảm giá này? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="voucher-delete-card-content">
            <div className="voucher-delete-details">
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Mã phiếu:</span>
                <span className="voucher-detail-value voucher-code-highlight">{voucherToDelete.code}</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Phần trăm giảm:</span>
                <span className="voucher-detail-value">{voucherToDelete.percent}%</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Đơn tối thiểu:</span>
                <span className="voucher-detail-value">{formatCurrency(voucherToDelete.minValue)}</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Giảm tối đa:</span>
                <span className="voucher-detail-value">{formatCurrency(voucherToDelete.maxValue)}</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Số lượng còn lại:</span>
                <span className="voucher-detail-value">{voucherToDelete.quantity}</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Ngày bắt đầu:</span>
                <span className="voucher-detail-value">{formatDate(voucherToDelete.startDate)}</span>
              </div>
              <div className="voucher-detail-row">
                <span className="voucher-detail-label">Ngày kết thúc:</span>
                <span className="voucher-detail-value">{formatDate(voucherToDelete.endDate)}</span>
              </div>
              {voucherToDelete.description && (
                <div className="voucher-detail-row">
                  <span className="voucher-detail-label">Mô tả:</span>
                  <span className="voucher-detail-value">{voucherToDelete.description}</span>
                </div>
              )}
            </div>

            <div className="voucher-delete-warning">
              <p className="voucher-delete-warning-text">
                ⚠️ Cảnh báo: Tất cả dữ liệu liên quan đến phiếu giảm giá này sẽ bị xóa vĩnh viễn.
              </p>
            </div>

            <div className="voucher-delete-actions">
              <button onClick={() => vouchers ? setSelectedVoucher(null) : onBack()} className="admin-btn admin-btn-outline admin-btn-lg">
                Hủy bỏ
              </button>
              <button onClick={() => handleDelete(voucherToDelete.code)} className="admin-btn admin-btn-danger admin-btn-lg">
                <Trash2 size={20} />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
