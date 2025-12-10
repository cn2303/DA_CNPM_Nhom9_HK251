import { useState } from 'react'
import { ArrowLeft, Package, User, Mail, Phone, MapPin, Calendar, DollarSign, Save } from 'lucide-react'
import './OrderDetail.css'

const STATUS_OPTIONS = [
  { key: "all", label: "Tất cả", value: "all" },
  { key: "Pending", label: "Đã thanh toán", value: "Pending" },
  { key: "Processing", label: "Đang xử lý", value: "Processing" },
  { key: "Completed", label: "Hoàn thành", value: "Completed" },
  { key: "Cancelled", label: "Đã hủy", value: "Cancelled" },
]

const STATUS_LABELS = {
  Pending: "Đã thanh toán",
  Processing: "Đang xử lý",
  Completed: "Hoàn thành",
  Cancelled: "Đã hủy",
}

export default function OrderDetail({ order, onBack, onSaveStatus, onViewCustomer }) {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!onSaveStatus) {
      console.error('onSaveStatus is not provided')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)
      await onSaveStatus(order.id, status)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái')
    } finally {
      setSaving(false)
    }
  }

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    return STATUS_LABELS[status] || status
  }

  const getInitials = (name) => {
    if (!name) return 'NA'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}₫`
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-container">
        {/* Header */}
        <div className="order-detail-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về lịch sử đơn hàng
          </button>
          <span className="order-detail-status-badge">
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="order-detail-title-section">
          <h1 className="order-detail-title">
            <Package size={40} />
            Đơn hàng #{order.id}
          </h1>
          <p className="order-detail-time">
            {new Date(order.orderDate).toLocaleDateString('vi-VN')} {new Date(order.orderDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Customer Information Card */}
        <div className="order-detail-card">
          <div className="order-detail-card-header">
            <h2 className="order-detail-card-title">Thông tin khách hàng</h2>
            <button onClick={() => onViewCustomer(order.user?.id)} className="admin-btn admin-btn-outline">
              Xem hồ sơ đầy đủ
            </button>
          </div>
          <div className="order-detail-card-content">
            <div className="customer-info-section">
              <div className="customer-avatar">
                <span>{getInitials(order.user?.fullname)}</span>
              </div>
              <div className="customer-details-grid">
                <div className="customer-detail-item">
                  <User size={20} className="customer-detail-icon" />
                  <div>
                    <p className="customer-detail-label">Tên</p>
                    <p className="customer-detail-value">{order.user?.fullname || 'N/A'}</p>
                  </div>
                </div>
                <div className="customer-detail-item">
                  <Mail size={20} className="customer-detail-icon" />
                  <div>
                    <p className="customer-detail-label">Email</p>
                    <p className="customer-detail-value">{order.user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="customer-detail-item">
                  <Phone size={20} className="customer-detail-icon" />
                  <div>
                    <p className="customer-detail-label">Điện thoại</p>
                    <p className="customer-detail-value">{order.user?.phone || 'N/A'}</p>
                  </div>
                </div>
                {order.orderAddress && (
                  <div className="customer-detail-item">
                    <MapPin size={20} className="customer-detail-icon" />
                    <div>
                      <p className="customer-detail-label">Địa chỉ giao hàng</p>
                      <p className="customer-detail-value">
                        {order.orderAddress.addressDetail}, {order.orderAddress.ward}, {order.orderAddress.city}
                      </p>
                    </div>
                  </div>
                )}
                {order.orderAddress?.phone && (
                  <div className="customer-detail-item">
                    <Phone size={20} className="customer-detail-icon" />
                    <div>
                      <p className="customer-detail-label">Điện thoại giao hàng</p>
                      <p className="customer-detail-value">{order.orderAddress.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="order-detail-card">
          <div className="order-detail-card-header">
            <h2 className="order-detail-card-title">Chi tiết đơn hàng</h2>
          </div>
          <div className="order-detail-card-content">
            {/* Order Items */}
            <div className="order-items-section">
              <h3 className="order-items-title">Sản phẩm</h3>
              {order.orderItemList?.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    <p className="order-item-title">{item.book.title}</p>
                    <p className="order-item-detail">
                      {item.book.author} • {item.book.publisher}
                    </p>
                  </div>
                  <div className="order-item-pricing">
                    <p className="order-item-quantity">x{item.quantity}</p>
                    <p className="order-item-price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-details-grid">
              <div className="order-detail-item">
                <Calendar size={20} className="order-detail-icon" />
                <div>
                  <p className="order-detail-label">Ngày đặt hàng</p>
                  <p className="order-detail-value">
                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="order-detail-item">
                <DollarSign size={20} className="order-detail-icon" />
                <div>
                  <p className="order-detail-label">Phương thức thanh toán</p>
                  <p className="order-detail-value">{order.paymentMethod || 'N/A'}</p>
                </div>
              </div>
              <div className="order-detail-item">
                <Package size={20} className="order-detail-icon" />
                <div>
                  <p className="order-detail-label">Tổng phụ</p>
                  <p className="order-detail-value">{formatCurrency(order.subtotalPrice)}</p>
                </div>
              </div>
              <div className="order-detail-item">
                <Package size={20} className="order-detail-icon" />
                <div>
                  <p className="order-detail-label">Phí vận chuyển</p>
                  <p className="order-detail-value">{formatCurrency(order.shippingFee)}</p>
                </div>
              </div>
              {order.voucher && (
                <div className="order-detail-item">
                  <Package size={20} className="order-detail-icon" />
                  <div>
                    <p className="order-detail-label">Voucher ({order.voucher.code})</p>
                    <p className="order-detail-value">-{formatCurrency(order.discountTotal)}</p>
                  </div>
                </div>
              )}
              <div className="order-detail-item">
                <DollarSign size={20} className="order-detail-icon" />
                <div>
                  <p className="order-detail-label">Tổng tiền</p>
                  <p className="order-detail-value order-total">{formatCurrency(order.grandTotalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="order-status-management">
              <h3 className="order-status-title">Quản lý trạng thái đơn hàng</h3>
              <div className="order-status-form">
                <div className="order-status-select-group">
                  <label htmlFor="status" className="form-label">Cập nhật trạng thái đơn hàng</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-select"
                  >
                    {STATUS_OPTIONS.filter(opt => opt.value !== 'all').map((opt) => (
                      <option key={opt.key} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSave} 
                  className="admin-btn admin-btn-primary"
                  disabled={status === order.status || saving}
                >
                  <Save size={18} />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
              {error && (
                <p className="order-status-error">
                  ❌ {error}
                </p>
              )}
              {success && (
                <p className="order-status-success">
                  ✅ Cập nhật trạng thái thành công!
                </p>
              )}
              {status !== order.status && !success && (
                <p className="order-status-hint">
                  Bạn có thay đổi chưa được lưu. Nhấp "Lưu thay đổi" để cập nhật trạng thái đơn hàng.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
