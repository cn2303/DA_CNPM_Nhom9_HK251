import { ArrowLeft, Plus, Ticket, Trash2, Calendar, Percent } from 'lucide-react'
import './VoucherInventory.css'

export default function VoucherInventory({ vouchers, onBack, onAddVoucher, onDeleteVoucher, onVoucherClick }) {
  const formatDiscount = (voucher) => {
    return `${voucher.percent}% GIẢM`
  }

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}₫`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const isExpired = (endDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    return end < today
  }

  const isExpiringSoon = (endDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7
  }

  return (
    <div className="voucher-inventory-page">
      <div className="voucher-inventory-container">
        {/* Header */}
        <div className="voucher-inventory-header">
          <div className="voucher-header-left">
            <button onClick={onBack} className="admin-btn admin-btn-outline">
              <ArrowLeft size={20} />
              Về bảng điều khiển
            </button>
            <div className="voucher-title-section">
              <Ticket size={32} className="voucher-title-icon" />
              <h1 className="voucher-title">Kho phiếu giảm giá</h1>
            </div>
          </div>
          <div className="voucher-header-actions">
            <button onClick={onDeleteVoucher} className="admin-btn admin-btn-danger">
              <Trash2 size={20} />
              Xóa phiếu
            </button>
            <button onClick={onAddVoucher} className="admin-btn admin-btn-primary">
              <Plus size={20} />
              Thêm phiếu
            </button>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="voucher-grid">
          {vouchers.map((voucher) => (
            <div 
              key={voucher.code}
              className="voucher-card"
              onClick={() => onVoucherClick?.(voucher.code)}
            >
              <div className="voucher-card-content">
                {/* Voucher Logo */}
                <div className="voucher-logo">
                  <Percent size={48} className="voucher-logo-icon" />
                  {isExpired(voucher.endDate) && (
                    <div className="voucher-expired-overlay">
                      <span className="voucher-expired-badge">Đã hết hạn</span>
                    </div>
                  )}
                  {!isExpired(voucher.endDate) && isExpiringSoon(voucher.endDate) && (
                    <span className="voucher-expiring-badge">Sắp hết hạn</span>
                  )}
                </div>
                
                {/* Voucher Details */}
                <div className="voucher-details">
                  <div className="voucher-details-header">
                    <h3 className="voucher-code">{voucher.code}</h3>
                    <span className="voucher-percent-badge">
                      {formatDiscount(voucher)}
                    </span>
                  </div>
                  
                  <div className="voucher-info-list">
                    <div className="voucher-info-item">
                      <span className="voucher-info-label">Khả dụng</span>
                      <span className="voucher-info-value">{voucher.quantity} phiếu</span>
                    </div>
                    <div className="voucher-info-item">
                      <span className="voucher-info-label">Đơn tối thiểu</span>
                      <span className="voucher-info-value">
                        {voucher.minValue > 0 ? formatCurrency(voucher.minValue) : 'Không'}
                      </span>
                    </div>
                    <div className="voucher-info-item">
                      <span className="voucher-info-label voucher-info-label-with-icon">
                        <Calendar size={16} />
                        Hết hạn
                      </span>
                      <span className={`voucher-info-value ${isExpired(voucher.endDate) ? 'text-red' : isExpiringSoon(voucher.endDate) ? 'text-orange' : ''}`}>
                        {formatDate(voucher.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {vouchers.length === 0 && (
          <div className="voucher-empty">
            <Ticket size={64} className="voucher-empty-icon" />
            <h3 className="voucher-empty-title">Chưa có phiếu giảm giá</h3>
            <p className="voucher-empty-message">Bắt đầu bằng cách thêm phiếu giảm giá đầu tiên</p>
            <button onClick={onAddVoucher} className="admin-btn admin-btn-primary">
              <Plus size={18} />
              Thêm phiếu
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
