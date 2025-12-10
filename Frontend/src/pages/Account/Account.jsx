"use client"

import { useEffect, useState } from "react"
import { authAxios } from "../../utils/auth"
import "./Account.css"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"

const API_BASE_URL = "http://localhost:8080"
const DEFAULT_AVATAR = "/avatar_trang_1.jpg"
const EMPTY_ADDRESS = {
  id: null,
  ward: "",
  city: "",
  addressDetail: "",
  phone: "",
  default: false,
}

const formatAddress = (address) => {
  if (!address) return ""
  return `${address.addressDetail || ""}, ${address.ward || ""}, ${address.city || ""}`
    .replace(/,\s*,/g, ", ")
    .replace(/^,\s*|,\s*$/g, "")
}

export default function Account({ onNavigate, currentUser, setCurrentUser }) {
  const [refreshCartCount, setRefreshCartCount] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [addressMode, setAddressMode] = useState("create")
  const [addressSubmitting, setAddressSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({
    id: null,
    fullname: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    birthday: "",
    role: "CUSTOMER",
    address: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.id) return
      setLoading(true)
      setError("")
      try {
        const [{ data: userData }, { data: addressData }] = await Promise.all([
          authAxios.get(`/user/${currentUser.id}`),
          authAxios.get(`/address/user/${currentUser.id}`),
        ])

        const defaultAddress = Array.isArray(addressData)
          ? addressData.find((addr) => addr.default) || addressData[0]
          : null

        setAddresses(Array.isArray(addressData) ? addressData : [])
        setProfileData({
          id: userData.id ?? currentUser.id,
          fullname: userData.fullname || "",
          email: userData.email || "",
          username: userData.username || "",
          password: userData.password || "",
          phone: userData.phone || "",
          birthday: userData.birthday || "",
          role: userData.role || "CUSTOMER",
          address: formatAddress(defaultAddress),
        })
      } catch (err) {
        console.error("Failed to load profile", err)
        setError("Không thể tải thông tin tài khoản")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [currentUser?.id])

  useEffect(() => {
    const defaultAddress = Array.isArray(addresses)
      ? addresses.find((addr) => addr.default) || addresses[0]
      : null

    setProfileData((prev) => ({
      ...prev,
      address: formatAddress(defaultAddress),
    }))
  }, [addresses])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (!isEditing) return
    if (name !== "fullname" && name !== "phone") return
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!profileData.id) return
    setLoading(true)
    setError("")
    try {
      const payload = {
        id: profileData.id,
        fullname: profileData.fullname,
        email: profileData.email,
        username: profileData.username,
        password: profileData.password,
        phone: profileData.phone,
        birthday: profileData.birthday,
        role: profileData.role || "CUSTOMER",
        address: null,
      }

      const { data } = await authAxios.put(`/user`, payload)
      setProfileData((prev) => ({ ...prev, ...data }))
      setIsEditing(false)

      if (typeof setCurrentUser === "function") {
        const updatedUser = { ...currentUser, ...data }
        setCurrentUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error("Failed to save profile", err)
      setError("Không thể lưu thông tin")
    } finally {
      setLoading(false)
    }
  }

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleOpenNewAddress = () => {
    setError("")
    setAddressForm(EMPTY_ADDRESS)
    setAddressMode("create")
    setIsAddressFormOpen(true)
  }

  const handleEditAddress = (address) => {
    setError("")
    setAddressForm({
      id: address.id,
      ward: address.ward || "",
      city: address.city || "",
      addressDetail: address.addressDetail || "",
      phone: address.phone || "",
      default: !!address.default,
    })
    setAddressMode("edit")
    setIsAddressFormOpen(true)
  }

  const resetAddressForm = () => {
    setAddressForm(EMPTY_ADDRESS)
    setIsAddressFormOpen(false)
  }

  const upsertAddress = async () => {
    if (!currentUser?.id) return
    if (!addressForm.ward || !addressForm.city || !addressForm.addressDetail || !addressForm.phone) {
      setError("Vui lòng điền đầy đủ thông tin địa chỉ")
      return
    }

    setAddressSubmitting(true)
    setError("")
    try {
      const payload = {
        ward: addressForm.ward.trim(),
        city: addressForm.city.trim(),
        addressDetail: addressForm.addressDetail.trim(),
        phone: addressForm.phone.trim(),
        default: !!addressForm.default,
        user: { id: currentUser.id },
      }

      let savedAddress
      if (addressMode === "edit" && addressForm.id) {
        payload.id = addressForm.id
        const { data } = await authAxios.put(`/address`, payload)
        savedAddress = data
      } else {
        const { data } = await authAxios.post(`/address`, payload)
        savedAddress = data
      }

      let nextAddresses

      if (payload.default) {
        const resetDefaultPromises = addresses
          .filter((addr) => addr.id !== savedAddress.id && addr.default)
          .map((addr) =>
            authAxios.put(`/address`, {
              ...addr,
              default: false,
              user: { id: currentUser.id },
            })
          )

        if (resetDefaultPromises.length) {
          await Promise.all(resetDefaultPromises)
        }

        nextAddresses = [
          ...addresses
            .filter((addr) => addr.id !== savedAddress.id)
            .map((addr) => ({ ...addr, default: false })),
          { ...savedAddress, default: true },
        ]
      } else {
        nextAddresses = addressMode === "edit"
          ? addresses.map((addr) => (addr.id === savedAddress.id ? savedAddress : addr))
          : [...addresses, savedAddress]
      }

      setAddresses(nextAddresses)
      resetAddressForm()
    } catch (err) {
      console.error("Failed to save address", err)
      setError("Không thể lưu địa chỉ")
    } finally {
      setAddressSubmitting(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!currentUser?.id || !addressId) return
    setAddressSubmitting(true)
    setError("")
    try {
      await authAxios.delete(`/address/${addressId}`)
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
    } catch (err) {
      console.error("Failed to delete address", err)
      setError("Không thể xóa địa chỉ")
    } finally {
      setAddressSubmitting(false)
    }
  }

  const handleSetDefault = async (addressId) => {
    if (!currentUser?.id) return
    setAddressSubmitting(true)
    setError("")
    try {
      const updateCalls = addresses
        .map((addr) => {
          const shouldBeDefault = addr.id === addressId
          if (addr.default === shouldBeDefault) return null
          return authAxios.put(`/address`, {
            ...addr,
            default: shouldBeDefault,
            user: { id: currentUser.id },
          })
        })
        .filter(Boolean)

      if (updateCalls.length) {
        await Promise.all(updateCalls)
      }

      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          default: addr.id === addressId,
        }))
      )
    } catch (err) {
      console.error("Failed to set default address", err)
      setError("Không thể đặt địa chỉ mặc định")
    } finally {
      setAddressSubmitting(false)
    }
  }

  return (
    <>
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} onCartCountUpdate={setRefreshCartCount} />
      <div className="account-page">
        <div className="breadcrumb">
          <span onClick={() => onNavigate("home")} className="breadcrumb-link">
            Trang chủ
          </span>
          <span className="breadcrumb-separator">/</span>
          <span>Thông tin tài khoản</span>
        </div>

        <div className="account-container">
          <div className="account-header">
            <h2>Thông tin tài khoản</h2>
            <div className="button-group">
              {isEditing ? (
                <>
                  <button className="cancel-button" onClick={handleCancel}>Hủy</button>
                  <button className="save-button-header" onClick={handleSave} disabled={loading}>Lưu thay đổi</button>
                </>
              ) : (
                <button className="edit-button" onClick={handleEdit}>Chỉnh sửa thông tin cá nhân</button>
              )}
            </div>
          </div>

          {error && <div className="account-error">{error}</div>}

          <div className="profile-section">
            <div className="avatar-container">
              <div className="avatar">
                <img src={DEFAULT_AVATAR} alt="Avatar" />
              </div>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" name="fullname" value={profileData.fullname} onChange={handleChange} disabled={!isEditing} />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={profileData.email} disabled />
              </div>

              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" name="username" value={profileData.username} disabled />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} disabled={!isEditing} />
              </div>

              <div className="form-group">
                <label>Địa chỉ mặc định</label>
                <input type="text" name="address" placeholder="Chưa có địa chỉ" value={profileData.address} onChange={handleChange} disabled />
                <small className="address-hint">Địa chỉ được lấy từ địa chỉ mặc định của bạn</small>
              </div>
            </div>
          </div>

          <div className="address-section">
            <div className="address-header-row">
              <h3>Địa chỉ giao hàng</h3>
              <button className="add-address-button" onClick={handleOpenNewAddress} disabled={addressSubmitting}>
                Thêm địa chỉ
              </button>
            </div>

            {Array.isArray(addresses) && addresses.length > 0 ? (
              <div className="address-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-card ${addr.default ? "is-default" : ""}`}>
                    <div className="address-main">
                      <div className="address-lines">
                        <div className="address-line">{addr.addressDetail}</div>
                        <div className="address-line subtle">{[addr.ward, addr.city].filter(Boolean).join(", ")}</div>
                        <div className="address-line subtle">SĐT: {addr.phone}</div>
                      </div>
                      {addr.default && <span className="default-badge">Mặc định</span>}
                    </div>
                    <div className="address-actions">
                      {!addr.default && (
                        <button className="secondary" onClick={() => handleSetDefault(addr.id)} disabled={addressSubmitting}>
                          Đặt mặc định
                        </button>
                      )}
                      <button className="ghost" onClick={() => handleEditAddress(addr)} disabled={addressSubmitting}>
                        Sửa
                      </button>
                      <button className="danger" onClick={() => handleDeleteAddress(addr.id)} disabled={addressSubmitting}>
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="address-empty">Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</div>
            )}

            {isAddressFormOpen && (
              <div className="address-form">
                <div className="address-form-row">
                  <div className="form-group">
                    <label>Tên phường / Quận</label>
                    <input
                      type="text"
                      name="ward"
                      placeholder="VD: Quận 1"
                      value={addressForm.ward}
                      onChange={handleAddressInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="VD: Hồ Chí Minh"
                      value={addressForm.city}
                      onChange={handleAddressInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    name="addressDetail"
                    placeholder="Số nhà, tên đường"
                    value={addressForm.addressDetail}
                    onChange={handleAddressInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại nhận hàng</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="VD: 0900000000"
                    value={addressForm.phone}
                    onChange={handleAddressInputChange}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="default"
                      checked={addressForm.default}
                      onChange={handleAddressInputChange}
                    />
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                <div className="address-form-actions">
                  <button className="ghost" onClick={resetAddressForm} disabled={addressSubmitting}>
                    Hủy
                  </button>
                  <button className="save-button-header" onClick={upsertAddress} disabled={addressSubmitting}>
                    {addressMode === "edit" ? "Cập nhật" : "Lưu địa chỉ"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
