import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

export const getToken = () => localStorage.getItem("authToken")
export const setToken = (token) => localStorage.setItem("authToken", token)
export const removeToken = () => localStorage.removeItem("authToken")

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const removeCurrentUser = () => {
  localStorage.removeItem("currentUser")
}

export const logout = () => {
  removeToken()
  removeCurrentUser()
}

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  })
  
  const { token, authenticated, userId, role } = response.data
  
  if (authenticated && token) {
    setToken(token)
    return { token, userId, role, authenticated }
  }
  
  throw new Error("Đăng nhập thất bại")
}

export const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  })

  instance.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const authAxios = createAuthAxios()

export const authRequest = async (method, url, data = null, config = {}) => {
  const token = getToken()
  const headers = {
    ...config.headers,
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    headers,
    ...config,
  })
}

export const isAuthenticated = () => {
  const token = getToken()
  const user = getCurrentUser()
  return !!(token && user)
}

export const getUser = () => {
  return getCurrentUser()
}

export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.role?.toUpperCase() === 'ADMIN'
}

export const isCustomer = () => {
  const user = getCurrentUser()
  return user && user.role?.toUpperCase() === 'CUSTOMER'
}

export const getUserRole = () => {
  const user = getCurrentUser()
  return user?.role?.toUpperCase() || null
}
