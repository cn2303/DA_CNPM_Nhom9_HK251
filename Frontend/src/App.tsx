import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Dashboard } from './routes/Dashboard';
import { EditBook } from './routes/EditBook';
import { AddBook } from './routes/AddBook';
import { DeleteBook } from './routes/DeleteBook';
import { Orders } from './routes/Orders';
import { Vouchers } from './routes/Vouchers';
import { Customers } from './routes/Customers';
import { Login } from './components/Login';
import { Toaster } from './components/ui/sonner';
import { bookAPI, userAPI, orderAPI, voucherAPI, authAPI } from './services/api';
import { authService } from './services/auth';
import type { LoginResponse } from './services/auth';

// ... 保持所有接口定义不变 ...

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authState = authService.getAuthState();
    console.log('🔐 Auth state on mount:', authState);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  // Handle login success
  const handleLoginSuccess = (token: string, role: string, userId: number) => {
    const loginResponse: LoginResponse = {
      token,
      role,
      userId,
      authenticated: true
    };
    
    authService.saveAuth(loginResponse);
    setIsAuthenticated(true);
    console.log('✅ User logged in:', { role, userId });
  };

  // Handle logout
  const handleLogout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setBooks([]);
    setVouchers([]);
    setCustomers([]);
    setOrders([]);
    console.log('👋 User logged out');
  };

  // Function to refresh books only
  const refreshBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await bookAPI.getAll();
      setBooks(booksData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu sách từ server');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh vouchers
  const refreshVouchers = async () => {
    try {
      const vouchersData = await voucherAPI.getAll();
      setVouchers(vouchersData);
    } catch (err: any) {
      console.error('Error fetching vouchers:', err);
      throw err;
    }
  };

  // Function to refresh customers
  const refreshCustomers = async () => {
    try {
      console.log('🔍 Fetching customers from API...');
      const usersData = await userAPI.getAll();
      console.log('📦 Raw users data:', usersData);
      console.log('📊 Total users:', usersData?.length || 0);
      
      const customersOnly = usersData.filter((user: any) => 
        user.role?.toUpperCase() === 'CUSTOMER'
      );
      console.log('👥 Filtered customers:', customersOnly);
      console.log('📈 Total customers:', customersOnly?.length || 0);
      
      setCustomers(customersOnly);
    } catch (err: any) {
      console.error('❌ Error fetching customers:', err);
      throw err;
    }
  };

  // Function to refresh orders
  const refreshOrders = async () => {
    try {
      const ordersData = await orderAPI.getAll();
      setOrders(ordersData);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  };

  // Load only books on mount
  useEffect(() => {
    refreshBooks();
  }, []);

  // Book handlers
  const handleAddBook = async (newBook: Omit<Book, 'id'>) => {
    try {
      const createdBook = await bookAPI.create(newBook);
      setBooks([...books, createdBook]);
    } catch (err: any) {
      throw new Error(err.message || 'Không thể thêm sách');
    }
  };

  const handleSaveBook = async (updatedBook: Book) => {
    try {
      const savedBook = await bookAPI.update(updatedBook);
      setBooks(books.map(book => book.id === savedBook.id ? savedBook : book));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể cập nhật sách');
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await bookAPI.delete(bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể xóa sách');
    }
  };

  // Voucher handlers
  const handleAddVoucher = async (newVoucher: Omit<Voucher, 'code'> & { code: string }) => {
    try {
      const createdVoucher = await voucherAPI.create(newVoucher);
      setVouchers([...vouchers, createdVoucher]);
    } catch (err: any) {
      throw new Error(err.message || 'Không thể thêm voucher');
    }
  };

  const handleSaveVoucher = async (updatedVoucher: Voucher) => {
    try {
      const savedVoucher = await voucherAPI.update(updatedVoucher);
      setVouchers(vouchers.map(voucher => voucher.code === savedVoucher.code ? savedVoucher : voucher));
    } catch (err: any) {
      throw new Error(err.message || 'Khng thể cập nhật voucher');
    }
  };

  const handleDeleteVoucher = async (voucherCode: string) => {
    try {
      await voucherAPI.delete(voucherCode);
      setVouchers(vouchers.filter(voucher => voucher.code !== voucherCode));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể xóa voucher');
    }
  };

  // Customer handlers
  const handleSaveCustomer = async (updatedCustomer: Customer) => {
    try {
      const savedCustomer = await userAPI.update(updatedCustomer);
      setCustomers(customers.map(customer => customer.id === savedCustomer.id ? savedCustomer : customer));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể cập nhật khách hàng');
    }
  };

  // Order handlers
  const handleSaveOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const updatedOrder = await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="text-center max-w-lg">
          <div className="text-destructive text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl mb-4">Không thể kết nối đến server</h2>
          <p className="text-muted-foreground mb-6 text-lg">{error}</p>
          
          <div className="bg-card border rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">📌 Hướng dẫn khắc phục:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Đảm bảo Spring Boot backend đang chạy trên <code className="bg-muted px-2 py-1 rounded">http://localhost:8080</code></li>
              <li>2. Kiểm tra CORS configuration trong backend (cho phép origin <code className="bg-muted px-2 py-1 rounded">http://localhost:5173</code>)</li>
              <li>3. Kiểm tra console log để xem chi tiết lỗi</li>
              <li>4. Thử truy cập trực tiếp: <a href="http://localhost:8080/book" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://localhost:8080/book</a></li>
            </ol>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 - 登录页面 */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        {/* 受保护的路由 */}
        <Route path="/*" element={
          isAuthenticated ? (
            <AppContent 
              books={books}
              vouchers={vouchers}
              customers={customers}
              orders={orders}
              refreshBooks={refreshBooks}
              refreshVouchers={refreshVouchers}
              refreshCustomers={refreshCustomers}
              refreshOrders={refreshOrders}
              handleAddBook={handleAddBook}
              handleSaveBook={handleSaveBook}
              handleDeleteBook={handleDeleteBook}
              handleAddVoucher={handleAddVoucher}
              handleSaveVoucher={handleSaveVoucher}
              handleDeleteVoucher={handleDeleteVoucher}
              handleSaveCustomer={handleSaveCustomer}
              handleSaveOrderStatus={handleSaveOrderStatus}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

// Separate component to access useLocation hook
function AppContent({
  books,
  vouchers,
  customers,
  orders,
  refreshBooks,
  refreshVouchers,
  refreshCustomers,
  refreshOrders,
  handleAddBook,
  handleSaveBook,
  handleDeleteBook,
  handleAddVoucher,
  handleSaveVoucher,
  handleDeleteVoucher,
  handleSaveCustomer,
  handleSaveOrderStatus,
  handleLogout,
}: {
  books: Book[];
  vouchers: Voucher[];
  customers: Customer[];
  orders: Order[];
  refreshBooks: () => Promise<void>;
  refreshVouchers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  handleAddBook: (newBook: Omit<Book, 'id'>) => Promise<void>;
  handleSaveBook: (updatedBook: Book) => Promise<void>;
  handleDeleteBook: (bookId: number) => Promise<void>;
  handleAddVoucher: (newVoucher: Omit<Voucher, 'code'> & { code: string }) => Promise<void>;
  handleSaveVoucher: (updatedVoucher: Voucher) => Promise<void>;
  handleDeleteVoucher: (voucherCode: string) => Promise<void>;
  handleSaveCustomer: (updatedCustomer: Customer) => Promise<void>;
  handleSaveOrderStatus: (orderId: number, newStatus: string) => Promise<void>;
  handleLogout: () => void;
}) {
  const location = useLocation();
  const previousPathRef = useRef<string>('');

  // Refresh books when returning to main page (only if coming from another page)
  useEffect(() => {
    if (location.pathname === '/' && previousPathRef.current !== '' && previousPathRef.current !== '/') {
      refreshBooks();
    }
    previousPathRef.current = location.pathname;
  }, [location.pathname, refreshBooks]);

  return (
    <Routes>
      <Route path="/" element={<Dashboard books={books} handleLogout={handleLogout} />} />
      <Route path="/book/:id" element={<EditBook books={books} onSave={handleSaveBook} onDelete={handleDeleteBook} />} />
      <Route path="/book/add" element={<AddBook onAdd={handleAddBook} />} />
      <Route path="/book/delete" element={<DeleteBook books={books} onDelete={handleDeleteBook} />} />
      <Route path="/orders" element={<Orders orders={orders} customers={customers} refreshOrders={refreshOrders} refreshCustomers={refreshCustomers} onSaveOrderStatus={handleSaveOrderStatus} />} />
      <Route path="/vouchers" element={<Vouchers vouchers={vouchers} refreshVouchers={refreshVouchers} onAddVoucher={handleAddVoucher} onSaveVoucher={handleSaveVoucher} onDeleteVoucher={handleDeleteVoucher} />} />
      <Route path="/customers" element={<Customers customers={customers} orders={orders} refreshCustomers={refreshCustomers} refreshOrders={refreshOrders} onSaveCustomer={handleSaveCustomer} handleLogout={handleLogout} />} />
    </Routes>
  );
}