"use client"

import { useEffect, useState } from "react"
import { authAxios } from "../../utils/auth"
import "./PaymentResult.css"
import { CheckCircle, XCircle, Loader } from "lucide-react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

export default function PaymentResult({ onNavigate, currentUser, setCurrentUser, status }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const processPaymentResult = async () => {
      if (status === "success" && !orderCreated) {
        setIsProcessing(true)
        
        try {
          const pendingOrderData = localStorage.getItem("pendingOrderData")
          
          if (pendingOrderData) {
            const orderData = JSON.parse(pendingOrderData)
            
            orderData.status = "Pending"
            orderData.orderDate = new Date().toISOString()
            
            const response = await authAxios.post("/order", orderData)
            console.log("Order created after payment:", response.data)
            
            localStorage.removeItem("pendingOrderData")
            
            setOrderCreated(true)
          } else {
            setError("Không tìm thấy thông tin đơn hàng")
          }
        } catch (err) {
          console.error("Error creating order after payment:", err)
          setError("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng liên hệ hỗ trợ.")
        } finally {
          setIsProcessing(false)
        }
      }
    }

    processPaymentResult()
  }, [status, orderCreated])

  const handleGoToOrders = () => {
    if (status === "success") {
      onNavigate("orders", null, null, "Pending")
    } else {
      onNavigate("orders")
    }
  }

  const handleGoToHome = () => {
    onNavigate("home")
  }

  const handleRetryPayment = () => {
    onNavigate("checkout")
  }

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="payment-result-page">
        <div className="payment-result-container">
          {isProcessing ? (
            <div className="payment-result-content processing">
              <Loader className="spinner" size={64} />
              <h2>Đang xử lý đơn hàng...</h2>
              <p>Vui lòng đợi trong giây lát</p>
            </div>
          ) : status === "success" ? (
            <div className="payment-result-content success">
              <CheckCircle className="result-icon success-icon" size={80} />
              <h2>Thanh toán thành công!</h2>
              {orderCreated ? (
                <>
                  <p>Đơn hàng của bạn đã được tạo thành công.</p>
                  <p className="sub-text">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.</p>
                </>
              ) : error ? (
                <p className="error-text">{error}</p>
              ) : (
                <p>Đang xử lý đơn hàng của bạn...</p>
              )}
              <div className="result-actions">
                <button className="primary-button" onClick={handleGoToOrders}>
                  Xem đơn hàng
                </button>
                <button className="secondary-button" onClick={handleGoToHome}>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : (
            <div className="payment-result-content failed">
              <XCircle className="result-icon failed-icon" size={80} />
              <h2>Thanh toán thất bại!</h2>
              <p>Giao dịch thanh toán của bạn không thành công.</p>
              <p className="sub-text">Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
              <div className="result-actions">
                <button className="primary-button" onClick={handleRetryPayment}>
                  Thử lại
                </button>
                <button className="secondary-button" onClick={handleGoToHome}>
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
