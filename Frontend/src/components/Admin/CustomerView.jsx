import { ArrowLeft, ShoppingBag, Lock, MapPin, Phone } from 'lucide-react'
import './CustomerView.css'

export default function CustomerView({ customer, onBack }) {
  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString('vi-VN')}₫`
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Chưa cung cấp'
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN')
    } catch {
      return dateString
    }
  }

  const getDisplayName = () => {
    return customer.fullname || customer.name || 'Unknown'
  }

  return (
    <div className="customer-view-page">
      <div className="customer-view-container">
        {/* Header */}
        <div className="customer-view-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về chi tiết đơn hàng
          </button>
        </div>

        <div className="customer-view-card">
          <div className="customer-view-card-header">
            <h2 className="customer-view-title">Hồ sơ khách hàng</h2>
            <p className="customer-view-subtitle">Chế độ xem chỉ đọc thông tin khách hàng</p>
          </div>

          <div className="customer-view-card-content">
            {/* Avatar Section */}
            <div className="customer-view-avatar-section">
              <div className="customer-view-avatar">
                <span className="customer-view-avatar-text">
                  {getInitials(getDisplayName())}
                </span>
              </div>
              <div className="customer-view-avatar-info">
                <h3 className="customer-view-name">{getDisplayName()}</h3>
                <p className="customer-view-email">{customer.email}</p>
              </div>
            </div>

            <hr className="customer-view-separator" />

            {/* Basic Information */}
            <div className="customer-view-section">
              <div className="customer-view-section-header">
                <Lock size={20} className="section-icon" />
                <h3 className="section-title">Thông tin khách hàng</h3>
              </div>
              <div className="customer-view-info-grid">
                <div className="info-field">
                  <p className="info-label">Họ và tên</p>
                  <div className="info-value-box">
                    <p>{getDisplayName()}</p>
                  </div>
                </div>

                {customer.username && (
                  <div className="info-field">
                    <p className="info-label">Tên đăng nhập</p>
                    <div className="info-value-box">
                      <p>{customer.username}</p>
                    </div>
                  </div>
                )}

                <div className="info-field">
                  <p className="info-label">Địa chỉ Email</p>
                  <div className="info-value-box">
                    <p>{customer.email}</p>
                  </div>
                </div>

                <div className="info-field">
                  <p className="info-label">Số điện thoại</p>
                  <div className="info-value-box">
                    <p>{customer.phone || 'Chưa cung cấp'}</p>
                  </div>
                </div>

                <div className="info-field">
                  <p className="info-label">Ngày sinh</p>
                  <div className="info-value-box">
                    <p>{formatDate(customer.birthday)}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="customer-view-separator" />

            {/* Address Information */}
            <div className="customer-view-section">
              <div className="customer-view-section-header">
                <MapPin size={20} className="section-icon" />
                <h3 className="section-title">Địa chỉ</h3>
              </div>

              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="address-list">
                  {customer.addresses.map((address) => (
                    <div key={address.id} className="address-card">
                      <div className="address-card-content">
                        <div className="address-header">
                          <p className="address-detail">{address.addressDetail}</p>
                          {address.default && (
                            <span className="address-default-badge">Mặc định</span>
                          )}
                        </div>
                        <p className="address-location">
                          {address.ward}, {address.city}
                        </p>
                        <p className="address-phone">
                          <Phone size={16} />
                          {address.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="info-value-box">
                  <p className="text-muted">Chưa có địa chỉ nào</p>
                </div>
              )}
            </div>

            <hr className="customer-view-separator" />

            {/* Purchase Statistics */}
            <div className="customer-view-section">
              <div className="customer-view-section-header">
                <ShoppingBag size={20} className="section-icon" />
                <h3 className="section-title">Lịch sử mua hàng</h3>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-label">Tổng đơn hàng</p>
                  <p className="stat-value">{customer.totalOrders || 0}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Tổng chi tiêu</p>
                  <p className="stat-value stat-value-primary">{formatCurrency(customer.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
