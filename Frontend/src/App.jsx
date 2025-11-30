import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"
import Home from "./pages/Home/Home"
//import Login from "./pages/Login/Login"
//import SignUp from "./pages/SignUp/SignUp"
//import ProductDetail from "./pages/ProductDetail/ProductDetail"
//import Cart from "./pages/Cart/Cart"
//import Checkout from "./pages/Checkout/Checkout"
//import Account from "./pages/Account/Account"
//import OrdersList from "./pages/Orders/OrdersList"
//import OrderDetails from "./pages/OrderDetails/OrderDetails"
import "./App.css"

function ProtectedRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function HomeWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null) => {
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
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }} 
    />
  )
}

function LoginWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "signup") navigate("/signup")
  }

  return (
    <Login 
      onNavigate={handleNavigate}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        }
      }}
      previousPage="home"
    />
  )
}

function SignUpWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

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
          localStorage.setItem('currentUser', JSON.stringify(user))
        }
      }}
    />
  )
}

function ProductDetailWrapper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null) => {
    if (page === "home") navigate("/")
    else if (page === "cart") navigate("/cart")
    else if (page === "login") navigate("/login")
    else if (page === "product-detail") navigate(`/product/${productId}`)
  }

  return (
    <ProductDetail 
      bookId={id}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
    />
  )
}

function CartWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "checkout") navigate("/checkout")
    else if (page === "login") navigate("/login")
  }

  return (
    <Cart 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
    />
  )
}

function CheckoutWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null, filter = null) => {
    if (page === "cart") navigate("/cart")
    else if (page === "orders") {
      if (filter) {
        navigate(`/orders?status=${encodeURIComponent(filter)}`)
      } else {
        navigate("/orders")
      }
    }
    else if (page === "login") navigate("/login")
  }

  return (
    <Checkout 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
    />
  )
}

function AccountWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "login") navigate("/login")
  }

  return (
    <Account 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
    />
  )
}

function OrdersListWrapper() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  const searchParams = new URLSearchParams(window.location.search)
  const statusFilter = searchParams.get('status')

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page, productId = null, orderId = null) => {
    if (page === "home") navigate("/")
    else if (page === "order-details") navigate(`/orders/${orderId}`)
    else if (page === "login") navigate("/login")
  }

  return (
    <OrdersList 
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
      initialFilter={statusFilter}
    />
  )
}

function OrderDetailsWrapper() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser'))
  )

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleNavigate = (page) => {
    if (page === "home") navigate("/")
    else if (page === "orders") navigate("/orders")
    else if (page === "login") navigate("/login")
  }

  return (
    <OrderDetails 
      orderId={id}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      setCurrentUser={(user) => {
        setCurrentUser(user)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
        } else {
          localStorage.removeItem('currentUser')
        }
      }}
    />
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignUpWrapper />} />
        <Route path="/product/:id" element={<ProductDetailWrapper />} />
        
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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
