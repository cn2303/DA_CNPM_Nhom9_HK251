import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { bookAPI, userAPI, orderAPI, voucherAPI } from '../../services/adminApi'
import { getUser, isAdmin, logout } from '../../utils/auth'
import AdminDashboard from '../../components/Admin/AdminDashboard'
import BookEdit from '../../components/Admin/BookEdit'
import BookAdd from '../../components/Admin/BookAdd'
import BookDelete from '../../components/Admin/BookDelete'
import OrderHistory from '../../components/Admin/OrderHistory'
import OrderDetail from '../../components/Admin/OrderDetail'
import VoucherInventory from '../../components/Admin/VoucherInventory'
import VoucherAdd from '../../components/Admin/VoucherAdd'
import VoucherEdit from '../../components/Admin/VoucherEdit'
import VoucherDelete from '../../components/Admin/VoucherDelete'
import CustomerManagement from '../../components/Admin/CustomerManagement'
import CustomerView from '../../components/Admin/CustomerView'
import './Admin.css'

export default function Admin() {
  const navigate = useNavigate()
  const location = useLocation()
  const previousPathRef = useRef('')

  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [books, setBooks] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login')
    }
  }, [navigate])

  const refreshBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const booksData = await bookAPI.getAll()
      setBooks(booksData)
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu sách từ server')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshVouchers = async () => {
    try {
      const vouchersData = await voucherAPI.getAll()
      setVouchers(vouchersData)
    } catch (err) {
      console.error('Error fetching vouchers:', err)
      throw err
    }
  }

  const refreshCustomers = async () => {
    try {
      const usersData = await userAPI.getAll()
      const customersOnly = usersData.filter(user => 
        user.role?.toUpperCase() === 'CUSTOMER'
      )
      setCustomers(customersOnly)
    } catch (err) {
      console.error('Error fetching customers:', err)
      throw err
    }
  }

  const getCustomerStats = (customerId) => {
    const customerOrders = orders.filter(order => order.user?.id === customerId)
    const totalOrders = customerOrders.length
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.grandTotalPrice || 0), 0)
    
    return {
      totalOrders,
      totalSpent
    }
  }

  const refreshOrders = async () => {
    try {
      const ordersData = await orderAPI.getAll()
      setOrders(ordersData)
    } catch (err) {
      console.error('Error fetching orders:', err)
      throw err
    }
  }

  useEffect(() => {
    refreshBooks()
  }, [])

  const handleAddBook = async (newBook) => {
    try {
      const createdBook = await bookAPI.create(newBook)
      setBooks([...books, createdBook])
      setCurrentView('dashboard')
    } catch (err) {
      throw new Error(err.message || 'Không thể thêm sách')
    }
  }

  const handleSaveBook = async (updatedBook) => {
    try {
      const savedBook = await bookAPI.update(updatedBook)
      setBooks(books.map(book => book.id === savedBook.id ? savedBook : book))
      setCurrentView('dashboard')
      setSelectedBook(null)
    } catch (err) {
      throw new Error(err.message || 'Không thể cập nhật sách')
    }
  }

  const handleDeleteBook = async (bookId) => {
    try {
      await bookAPI.delete(bookId)
      setBooks(books.filter(book => book.id !== bookId))
      setCurrentView('dashboard')
      setSelectedBook(null)
    } catch (err) {
      throw new Error(err.message || 'Không thể xóa sách')
    }
  }

  const handleAddVoucher = async (newVoucher) => {
    try {
      const user = getUser()
      const voucherWithUser = {
        ...newVoucher,
        user: { id: user?.id || 1 }
      }
      const createdVoucher = await voucherAPI.create(voucherWithUser)
      setVouchers([...vouchers, createdVoucher])
      setCurrentView('vouchers')
    } catch (err) {
      throw new Error(err.message || 'Không thể thêm voucher')
    }
  }

  const handleSaveVoucher = async (updatedVoucher) => {
    try {
      const user = getUser()
      const voucherWithUser = {
        ...updatedVoucher,
        user: { id: user?.id || 1 }
      }
      const savedVoucher = await voucherAPI.update(voucherWithUser)
      setVouchers(vouchers.map(voucher => voucher.code === savedVoucher.code ? savedVoucher : voucher))
      setCurrentView('vouchers')
      setSelectedVoucher(null)
    } catch (err) {
      throw new Error(err.message || 'Không thể cập nhật voucher')
    }
  }

  const handleDeleteVoucher = async (voucherCode) => {
    try {
      await voucherAPI.delete(voucherCode)
      setVouchers(vouchers.filter(voucher => voucher.code !== voucherCode))
      setCurrentView('vouchers')
      setSelectedVoucher(null)
    } catch (err) {
      throw new Error(err.message || 'Không thể xóa voucher')
    }
  }

  const handleSaveOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderAPI.updateStatus(orderId, newStatus)
      
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
      
      setSelectedOrder(updatedOrder)
    } catch (err) {
      console.error('Error updating order status:', err)
      throw new Error(err.message || 'Không thể cập nhật trạng thái đơn hàng')
    }
  }

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedBook(null)
    setSelectedOrder(null)
    setSelectedVoucher(null)
    setSelectedCustomer(null)
  }

  const handleNavigateToOrders = async () => {
    await refreshOrders()
    await refreshCustomers()
    setCurrentView('orders')
  }

  const handleNavigateToVouchers = async () => {
    await refreshVouchers()
    setCurrentView('vouchers')
  }

  const handleNavigateToCustomers = async () => {
    await Promise.all([refreshCustomers(), refreshOrders()])
    setCurrentView('customers')
  }

  const handleBookClick = (bookId) => {
    const book = books.find(b => b.id === bookId)
    setSelectedBook(book)
    setCurrentView('editBook')
  }

  const handleOrderClick = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    setSelectedOrder(order)
    setCurrentView('orderDetail')
  }

  const handleVoucherClick = (voucherCode) => {
    const voucher = vouchers.find(v => v.code === voucherCode)
    setSelectedVoucher(voucher)
    setCurrentView('editVoucher')
  }

  const handleCustomerClick = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    setSelectedCustomer(customer)
    setCurrentView('viewCustomer')
  }

  const handleViewCustomerFromOrder = (userId) => {
    const customer = customers.find(c => c.id === userId)
    setSelectedCustomer(customer)
    setCurrentView('viewCustomer')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="admin-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="admin-error-content">
          <div className="admin-error-icon">⚠️</div>
          <h2>Không thể kết nối đến server</h2>
          <p>{error}</p>
          
          <div className="admin-error-help">
            <h3>📌 Hướng dẫn khắc phục:</h3>
            <ol>
              <li>1. Đảm bảo Spring Boot backend đang chạy trên <code>http://localhost:8080</code></li>
              <li>2. Kiểm tra CORS configuration trong backend</li>
              <li>3. Kiểm tra console log để xem chi tiết lỗi</li>
            </ol>
          </div>

          <button onClick={() => window.location.reload()} className="admin-btn admin-btn-primary">
            🔄 Thử lại
          </button>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <AdminDashboard
            books={books}
            onBookClick={handleBookClick}
            onAddBook={() => setCurrentView('addBook')}
            onDeleteBook={() => setCurrentView('deleteBook')}
            onNavigateToOrders={handleNavigateToOrders}
            onNavigateToVouchers={handleNavigateToVouchers}
            onNavigateToCustomers={handleNavigateToCustomers}
            onLogout={handleLogout}
          />
        )
      
      case 'editBook':
        return selectedBook ? (
          <BookEdit
            book={selectedBook}
            onBack={handleNavigateToDashboard}
            onSave={handleSaveBook}
            onDelete={handleDeleteBook}
          />
        ) : null
      
      case 'addBook':
        return (
          <BookAdd
            onBack={handleNavigateToDashboard}
            onAdd={handleAddBook}
          />
        )
      
      case 'deleteBook':
        return (
          <BookDelete
            books={books}
            onBack={handleNavigateToDashboard}
            onDelete={handleDeleteBook}
          />
        )
      
      case 'orders':
        return (
          <OrderHistory
            orders={orders}
            onBack={handleNavigateToDashboard}
            onOrderClick={handleOrderClick}
          />
        )
      
      case 'orderDetail':
        return selectedOrder ? (
          <OrderDetail
            order={selectedOrder}
            onBack={() => setCurrentView('orders')}
            onSaveStatus={handleSaveOrderStatus}
            onViewCustomer={handleViewCustomerFromOrder}
          />
        ) : null
      
      case 'vouchers':
        return (
          <VoucherInventory
            vouchers={vouchers}
            onBack={handleNavigateToDashboard}
            onVoucherClick={handleVoucherClick}
            onAddVoucher={() => setCurrentView('addVoucher')}
            onDeleteVoucher={() => {
              setSelectedVoucher(null)
              setCurrentView('deleteVoucher')
            }}
          />
        )
      
      case 'addVoucher':
        return (
          <VoucherAdd
            onBack={() => setCurrentView('vouchers')}
            onAdd={handleAddVoucher}
          />
        )
      
      case 'editVoucher':
        return selectedVoucher ? (
          <VoucherEdit
            voucher={selectedVoucher}
            onBack={() => setCurrentView('vouchers')}
            onSave={handleSaveVoucher}
            onDelete={handleDeleteVoucher}
          />
        ) : null
      
      case 'deleteVoucher':
        return (
          <VoucherDelete
            vouchers={selectedVoucher ? null : vouchers}
            voucher={selectedVoucher}
            onBack={() => setCurrentView('vouchers')}
            onConfirmDelete={handleDeleteVoucher}
          />
        )
      
      case 'customers':
        const customersWithStats = customers.map(customer => ({
          ...customer,
          ...getCustomerStats(customer.id)
        }))
        return (
          <CustomerManagement
            customers={customersWithStats}
            onBack={handleNavigateToDashboard}
            onCustomerClick={handleCustomerClick}
          />
        )
      
      case 'viewCustomer':
        const customerWithStats = selectedCustomer ? {
          ...selectedCustomer,
          ...getCustomerStats(selectedCustomer.id)
        } : null
        return customerWithStats ? (
          <CustomerView
            customer={customerWithStats}
            onBack={() => {
              if (selectedOrder) {
                setCurrentView('orderDetail')
              } else {
                setCurrentView('customers')
              }
              setSelectedCustomer(null)
            }}
          />
        ) : null
      
      default:
        return null
    }
  }

  return (
    <div className="admin-page">
      {renderView()}
    </div>
  )
}
