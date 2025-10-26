import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng nhập với email: ${email}`);
  };

  return (
    <div style={{ width: 448, margin: '60px auto', position: 'relative' }}>
      <div style={{
        width: 448,
        minHeight: 530,
        background: 'rgba(255,255,255,0.60)',
        boxShadow: '0px 8px 10px -6px rgba(0,0,0,0.10)',
        borderRadius: 14,
        outline: '0.8px rgba(255,255,255,0.20) solid',
        padding: '40px 24px 32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#101828', fontSize: 24, fontFamily: 'Arimo', fontWeight: 400, lineHeight: '32px' }}>Chào mừng</div>
          <div style={{ color: '#4A5565', fontSize: 16, fontFamily: 'Arimo', fontWeight: 400, lineHeight: '24px', marginTop: 8 }}>Đăng nhập để tiếp tục</div>
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ width: '100%' }}>
            <div style={{ color: '#0A0A0A', fontSize: 14, fontFamily: 'Arimo', fontWeight: 400, marginBottom: 8 }}>Email</div>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Nhập email của bạn"
                style={{
                  width: '100%',
                  height: 36,
                  background: 'rgba(255,255,255,0.80)',
                  borderRadius: 8,
                  border: '0.8px solid rgba(229,231,235,0.50)',
                  padding: '0 40px',
                  fontSize: 14,
                  color: '#101828',
                  outline: 'none',
                  fontFamily: 'Arimo',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: 12, top: 10 }}>
                <svg width="16" height="16" fill="none"><rect x="1.33" y="2.67" width="13.33" height="10.67" rx="2" stroke="#99A1AF" strokeWidth="1.33"/><rect x="1.33" y="2.67" width="13.33" height="4" rx="2" stroke="#99A1AF" strokeWidth="1.33"/></svg>
              </span>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ color: '#0A0A0A', fontSize: 14, fontFamily: 'Arimo', fontWeight: 400, marginBottom: 8 }}>Password</div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
                style={{
                  width: '100%',
                  height: 36,
                  background: 'rgba(255,255,255,0.80)',
                  borderRadius: 8,
                  border: '0.8px solid rgba(229,231,235,0.50)',
                  padding: '0 40px',
                  fontSize: 14,
                  color: '#101828',
                  outline: 'none',
                  fontFamily: 'Arimo',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', left: 12, top: 10 }}>
                <svg width="16" height="16" fill="none"><ellipse cx="8" cy="8" rx="6" ry="4" stroke="#99A1AF" strokeWidth="1.33"/><circle cx="8" cy="8" r="2" stroke="#99A1AF" strokeWidth="1.33"/></svg>
              </span>
              <span style={{ position: 'absolute', right: 12, top: 10, cursor: 'pointer' }}>
                <svg width="16" height="16" fill="none"><circle cx="8" cy="8" r="6" stroke="#99A1AF" strokeWidth="1.33"/><circle cx="8" cy="8" r="2" stroke="#99A1AF" strokeWidth="1.33"/></svg>
              </span>
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <a href="#" style={{ color: '#155DFC', fontSize: 14, fontFamily: 'Arimo', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>
          </div>
          <button type="submit" style={{
            width: '100%',
            height: 36,
            background: 'linear-gradient(90deg, #155DFC 0%, #9810FA 100%)',
            boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.10)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Arimo',
            fontWeight: 400,
            border: 'none',
            marginTop: 8,
            cursor: 'pointer'
          }}>Đăng nhập</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: '#4A5565', fontSize: 16, fontFamily: 'Arimo', fontWeight: 400 }}>Chưa có tài khoản?</span>
          <a href="#" style={{ color: '#155DFC', fontSize: 16, fontFamily: 'Arimo', fontWeight: 400, marginLeft: 8, textDecoration: 'none' }}>Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
