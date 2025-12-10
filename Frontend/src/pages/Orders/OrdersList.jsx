import { useEffect, useState } from "react"
import { authAxios } from "../../utils/auth"
import "./OrdersList.css"
import { ShoppingCart } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

const API_BASE_URL = "http://localhost:8080"

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

const STATUS_CLASSES = {
  pending: "status-pending",
  processing: "status-processing",
  completed: "status-completed",
  cancelled: "status-cancelled",
}

const normalizeStatus = (raw) => {
  if (!raw) return "all"
  const lower = raw.toString().toLowerCase()
  const matched = STATUS_OPTIONS.find(
    (opt) => opt.label.toLowerCase() === lower || opt.value.toLowerCase() === lower,
  )
  return matched ? matched.value : "all"
}

const formatCurrency = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return "0 đ"
  return `${num.toLocaleString("vi-VN")} đ`
}

const formatDate = (value) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("vi-VN")
}

const getItemCount = (order) => {
  if (!order?.orderItemList) return 0
  return order.orderItemList.reduce((sum, item) => sum + (item.quantity || 0), 0)
}

export default function OrdersList({ onNavigate, currentUser, setCurrentUser, initialFilter }) {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState(() => normalizeStatus(initialFilter))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    setActiveTab(normalizeStatus(initialFilter))
  }, [initialFilter])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id) {
        setOrders([])
        setLoading(false)
        setError("Vui lòng đăng nhập để xem đơn hàng")
        return
      }

      setLoading(true)
      setError("")

      try {
        const { data } = await authAxios.get(`/order/user/${currentUser.id}`)
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        const message = err?.response?.data || "Không thể tải danh sách đơn hàng"
        setError(typeof message === "string" ? message : "Không thể tải danh sách đơn hàng")
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser?.id, reloadKey])

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => (order.status || "").toLowerCase() === activeTab.toLowerCase())

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="orders-page">
        <div className="breadcrumb">
          <span onClick={() => onNavigate?.("home")} className="breadcrumb-link">
            Trang chủ
          </span>
          <span className="breadcrumb-separator">/</span>
          <span>Đơn hàng</span>
        </div>

        <div className="orders-container">
          <h2 className="orders-title">Đơn hàng của tôi</h2>

          <div className="orders-tabs">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.key}
                className={`tab ${activeTab === option.value ? "active" : ""}`}
                onClick={() => setActiveTab(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {loading && <div className="orders-state">Đang tải danh sách đơn hàng...</div>}

          {!loading && error && (
            <div className="orders-state error">
              <p>{error}</p>
              <button className="state-action" onClick={() => setReloadKey((v) => v + 1)}>Thử lại</button>
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className="orders-state empty">
              <ShoppingCart size={24} />
              <p>Bạn chưa có đơn hàng nào</p>
              <button className="state-action" onClick={() => onNavigate?.("home")}>Tiếp tục mua sắm</button>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Mã đơn hàng: {order.id}</h3>
                      <div className="order-meta">
                        <span className="order-date">{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                    <span
                      className={`order-status ${STATUS_CLASSES[(order.status || "").toLowerCase()] || ""}`}
                    >
                      {STATUS_LABELS[order.status] || order.status || "Chưa xác định"}
                    </span>
                  </div>

                  <div className="order-items">
                    {(order.orderItemList || []).map((item, idx) => (
                      <div
                        key={item.id?.bookId ?? item.book?.id ?? idx}
                        className="order-item"
                      >
                        <div className="item-thumb">
                          <img src={item.book?.imageUrl || "/placeholder.svg"} alt={item.book?.title || "Sản phẩm"} />
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.book?.title || "Sản phẩm"}</p>
                          {item.book?.author && <p className="item-author">{item.book?.author}</p>}
                          <p className="item-qty">Số lượng: {item.quantity || 0}</p>
                        </div>
                        <span className="item-price">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <span className="total-label">Tổng cộng:</span>
                    <div className="footer-right">
                      <span className="total-price">{formatCurrency(order.grandTotalPrice)}</span>
                      <button className="view-details" onClick={() => onNavigate("order-details", null, order.id)}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
