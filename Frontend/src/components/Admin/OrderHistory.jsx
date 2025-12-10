import { useState } from 'react'
import { ArrowLeft, Package, User, Calendar, DollarSign } from 'lucide-react'
import './OrderHistory.css'

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

export default function OrderHistory({ orders, onBack, onOrderClick }) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  const getStatusLabel = (status) => {
    if (!status) return 'N/A'
    return STATUS_LABELS[status] || status
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0₫'
    return `${amount.toLocaleString('vi-VN')}₫`
  }

  const tabs = STATUS_OPTIONS

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        {/* Header */}
        <div className="order-history-header">
          <button onClick={onBack} className="admin-btn admin-btn-outline">
            <ArrowLeft size={20} />
            Về bảng điều khiển
          </button>
        </div>

        <div className="order-history-title-section">
          <h1 className="order-history-title">Lịch sử đơn hàng</h1>
          <p className="order-history-subtitle">Xem và quản lý tất cả đơn hàng của khách</p>
        </div>

        {/* Tab List */}
        <div className="order-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.value)}
              className={`order-tab ${activeTab === tab.value ? 'order-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="order-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const orderDate = new Date(order.orderDate)
              const formattedDate = orderDate.toLocaleDateString('vi-VN')
              const formattedTime = orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              const totalItems = order.orderItemList?.reduce((sum, item) => sum + item.quantity, 0) || 0
              const bookTitles = order.orderItemList?.map(item => item.book.title).join(', ') || 'N/A'
              
              return (
                <div 
                  key={order.id} 
                  className="order-card"
                  onClick={() => onOrderClick(order.id)}
                >
                  <div className="order-card-header">
                    <div className="order-card-title-section">
                      <h3 className="order-card-title">
                        <Package size={20} />
                        Đơn hàng #{order.id}
                      </h3>
                      <p className="order-card-time">{formattedDate} {formattedTime}</p>
                    </div>
                    <span className="order-status-badge">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="order-card-content">
                    <div className="order-info-grid">
                      <div className="order-info-item">
                        <div className="order-info-label">
                          <User size={16} />
                          <span>Khách hàng</span>
                        </div>
                        <p className="order-info-value">{order.user?.fullname || 'N/A'}</p>
                      </div>
                      <div className="order-info-item">
                        <div className="order-info-label">
                          <Package size={16} />
                          <span>Sách</span>
                        </div>
                        <p className="order-info-value" title={bookTitles}>
                          {bookTitles.length > 50 ? bookTitles.substring(0, 50) + '...' : bookTitles}
                        </p>
                      </div>
                      <div className="order-info-item">
                        <div className="order-info-label">
                          <Calendar size={16} />
                          <span>Phương thức</span>
                        </div>
                        <p className="order-info-value">{order.paymentMethod || 'N/A'}</p>
                      </div>
                      <div className="order-info-item">
                        <div className="order-info-label">
                          <DollarSign size={16} />
                          <span>Tổng</span>
                        </div>
                        <p className="order-info-value">{formatCurrency(order.grandTotalPrice)} (SL: {totalItems})</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="order-empty">
              <Package size={64} className="order-empty-icon" />
              <h3 className="order-empty-title">No orders found</h3>
              <p className="order-empty-message">
                {activeTab === 'all' 
                  ? 'There are no orders yet' 
                  : `No orders with status "${getStatusLabel(activeTab)}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
