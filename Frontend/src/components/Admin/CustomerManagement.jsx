import { useState } from 'react'
import { ArrowLeft, Search, Users } from 'lucide-react'
import './CustomerManagement.css'

export default function CustomerManagement({ customers, onBack, onCustomerClick }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  )

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

  const getDisplayName = (customer) => {
    return customer.name || customer.fullname || 'Unknown'
  }

  return (
    <div className="customer-management-page">
      <div className="customer-management-container">
        {/* Header */}
        <div className="customer-management-header">
          <div className="customer-management-header-left">
            <button onClick={onBack} className="admin-btn admin-btn-outline">
              <ArrowLeft size={20} />
              Về bảng điều khiển
            </button>
            <div className="customer-management-title-wrapper">
              <Users size={32} className="customer-management-icon" />
              <h1 className="customer-management-title">Quản lý khách hàng</h1>
            </div>
          </div>
          <div className="customer-management-count">
            {filteredCustomers.length} khách hàng
          </div>
        </div>

        {/* Search Bar */}
        <div className="customer-search-wrapper">
          <Search size={20} className="customer-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="customer-search-input"
          />
        </div>

        {/* Customers List */}
        <div className="customer-list">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id}
              className="customer-card"
              onClick={() => onCustomerClick(customer.id)}
            >
              <div className="customer-card-content">
                {/* Avatar */}
                <div className="customer-avatar">
                  <span className="customer-avatar-text">
                    {getInitials(getDisplayName(customer))}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="customer-info-grid">
                  <div className="customer-info-item">
                    <p className="customer-info-label">Tên</p>
                    <p className="customer-info-value">{getDisplayName(customer)}</p>
                  </div>
                  <div className="customer-info-item">
                    <p className="customer-info-label">Email</p>
                    <p className="customer-info-value">{customer.email}</p>
                  </div>
                  <div className="customer-info-item">
                    <p className="customer-info-label">Điện thoại</p>
                    <p className="customer-info-value">{customer.phone}</p>
                  </div>
                  <div className="customer-stats-group">
                    <div className="customer-stat">
                      <p className="customer-info-label">Đơn hàng</p>
                      <p className="customer-info-value">{customer.totalOrders || 0}</p>
                    </div>
                    <div className="customer-stat">
                      <p className="customer-info-label">Tổng chi</p>
                      <p className="customer-info-value">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="customer-empty-state">
            <Users size={64} className="customer-empty-icon" />
            <h3 className="customer-empty-title">
              {searchQuery ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng'}
            </h3>
            <p className="customer-empty-text">
              {searchQuery ? 'Thử điều chỉnh tiêu chí tìm kiếm của bạn' : 'Khách hàng sẽ xuất hiện ở đây khi họ đăng ký'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
