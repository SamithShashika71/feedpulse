'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('feedpulse_token', res.data.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#0d1421',
    border: '1px solid #1e2d42',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f0f4ff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top left, #0d1f35 0%, #080c14 50%, #080c14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
          }}>⚡</div>
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '28px',
            fontWeight: '800',
            color: '#f0f4ff',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}>
            Feed<span style={{ color: '#00d4ff' }}>Pulse</span>
          </h1>
          <p style={{ color: '#8a9bb5', fontSize: '14px' }}>Admin Dashboard Access</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111827',
          border: '1px solid #1e2d42',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        }}>
          <h2 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '18px',
            fontWeight: '700',
            color: '#f0f4ff',
            marginBottom: '24px',
          }}>Sign In</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#8a9bb5',
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif',
              }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@feedpulse.com"
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#1e2d42';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#8a9bb5',
                marginBottom: '8px',
                fontFamily: 'DM Sans, sans-serif',
              }}>Password</label>
              <div style={{ position: 'relative' }}>
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder="••••••••"
    style={{ ...inputStyle, paddingRight: '44px' }}
    onFocus={e => {
      e.target.style.borderColor = '#00d4ff';
      e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
    }}
    onBlur={e => {
      e.target.style.borderColor = '#1e2d42';
      e.target.style.boxShadow = 'none';
    }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4a5a72',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {showPassword ? (
      // Eye off icon
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ) : (
      // Eye icon
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )}
  </button>
</div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255, 77, 109, 0.1)',
                border: '1px solid rgba(255, 77, 109, 0.3)',
                color: '#ff4d6d',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'rgba(0, 212, 255, 0.1)'
                  : 'linear-gradient(135deg, #00d4ff, #0099cc)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                color: loading ? '#4a5a72' : '#080c14',
                padding: '14px',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(0, 212, 255, 0.3)',
                    borderTop: '2px solid #00d4ff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animationName: 'spin',
                    animationDuration: '0.8s',
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                  }} />
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#4a5a72',
          fontSize: '12px',
          marginTop: '20px',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          FeedPulse Admin · Restricted Access
        </p>
      </div>
    </main>
  );
}