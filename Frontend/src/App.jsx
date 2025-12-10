import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import SignUp from "./pages/SignUp/SignUp"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import Account from "./pages/Account/Account"
import OrdersList from "./pages/Orders/OrdersList"
import OrderDetails from "./pages/OrderDetails/OrderDetails"
import Search from "./pages/Search/Search"
import Category from "./pages/Category/Category"
import PaymentResult from "./pages/PaymentResult/PaymentResult"
import Admin from "./pages/Admin/Admin"
import { logout as authLogout, getCurrentUser, setCurrentUser as setAuthCurrentUser, getToken, isAdmin } from "./utils/auth"
import "./App.css"

function ProtectedRoute({ children }) {
  const currentUser = getCurrentUser()
  const token = getToken()
  
  if (!currentUser || !token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AdminRoute({ children }) {
  const currentUser = getCurrentUser()
  const token = getToken()
  
  if (!currentUser || !token) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function HomeWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    switch (page) {
      case "home":
        navigate("/")
        break
      case "login":
        navigate("/login")
        break
      case "signup":
        navigate("/signup")
        break
      case "product-detail":
        navigate(`/product/${productId}`)
        break
      case "cart":
        navigate("/cart")
        break
      case "checkout":
        navigate("/checkout")
        break
      case "account":
        navigate("/account")
        break
      case "orders":
        if (filter) {
          navigate(`/orders?status=${encodeURIComponent(filter)}`)
        } else {
          navigate("/orders")
        }
        break
      case "order-details":
        navigate(`/orders/${orderId}`)
        break
      case "admin":
        navigate("/admin")
        break
      case "search":
        if (searchQuery) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        } else {
          navigate("/search")
        }
        break
      case "category":
        if (categoryId) {
          navigate(`/category/${categoryId}`)
        } else {
          navigate("/category")
        }
        break
      default:
        navigate("/")
    }
  }

  return (
    <Home 
      onNavigate={handleNavigate} 
      currentUser={currentUser} 
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }} 
    />
  )
}

function LoginWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "signup") navigate("/signup")
    else if (page === "admin") navigate("/admin")
  }

  return (
    <Login 
      onNavigate={handleNavigate}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        }
      }}
      previousPage="home"
    />
  )
}

function SignUpWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "login") navigate("/login")
  }

  return (
    <SignUp 
      onNavigate={handleNavigate}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        }
      }}
    />
  )
}

function ProductDetailWrapper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "cart") navigate("/cart")
    else if (page === "checkout") navigate("/checkout")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "order-details") navigate(`/orders/${orderId}`)
    else if (page === "login") navigate("/login")
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <ProductDetail 
      bookId={id}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function CartWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "checkout") navigate("/checkout")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "login") navigate("/login")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <Cart 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function CheckoutWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "cart") navigate("/cart")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "login") navigate("/login")
    else if (page === "search") {
      if (searchQuery) navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      else navigate("/search")
    }
    else if (page === "category") {
      if (categoryId) navigate(`/category/${categoryId}`)
      else navigate("/category")
    }
  }

  return (
    <Checkout 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function AccountWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "login") navigate("/login")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "cart") navigate("/cart")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <Account 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function OrdersListWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  
  const searchParams = new URLSearchParams(window.location.search)
  const statusFilter = searchParams.get('status')

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "order-details") navigate(`/orders/${orderId}`)
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "cart") navigate("/cart")
    else if (page === "login") navigate("/login")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <OrdersList 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
      initialFilter={statusFilter}
    />
  )
}

function SearchWrapper() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, newSearchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "login") navigate("/login")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "cart") navigate("/cart")
    else if (page === "search") {
      if (newSearchQuery) {
        navigate(`/search?q=${encodeURIComponent(newSearchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <Search 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
      searchQuery={searchQuery}
    />
  )
}

function CategoryWrapper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "login") navigate("/login")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "cart") navigate("/cart")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <Category
      categoryId={id}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function OrderDetailsWrapper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "account") navigate("/account")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "order-details") navigate(`/orders/${orderId}`)
    else if (page === "product-detail") navigate(`/product/${productId}`)
    else if (page === "cart") navigate("/cart")
    else if (page === "login") navigate("/login")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <OrderDetails 
      orderId={id}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
    />
  )
}

function PaymentResultWrapper() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const status = searchParams.get('status') || 'failed'

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null, searchQuery = null, categoryId = null) => {
    if (page === "home") navigate("/")
    else if (page === "checkout") navigate("/checkout")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "cart") navigate("/cart")
    else if (page === "login") navigate("/login")
    else if (page === "account") navigate("/account")
    else if (page === "search") {
      if (searchQuery) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate("/search")
      }
    }
    else if (page === "category") {
      if (categoryId) {
        navigate(`/category/${categoryId}`)
      } else {
        navigate("/category")
      }
    }
  }

  return (
    <PaymentResult 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          setAuthCurrentUser(user)
        } else {
          authLogout()
        }
      }}
      status={status}
    />
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignUpWrapper />} />
        <Route path="/search" element={<SearchWrapper />} />
        <Route path="/category" element={<CategoryWrapper />} />
        <Route path="/category/:id" element={<CategoryWrapper />} />
        <Route path="/product/:id" element={<ProductDetailWrapper />} />
        
        {/* Protected Routes */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <CartWrapper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutWrapper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountWrapper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersListWrapper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <ProtectedRoute>
              <OrderDetailsWrapper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment-result" 
          element={
            <ProtectedRoute>
              <PaymentResultWrapper />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
