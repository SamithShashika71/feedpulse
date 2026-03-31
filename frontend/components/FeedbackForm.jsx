'use client';
import { useState } from 'react';
import api from '../lib/api';

export default function FeedbackForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Feature Request',
    submitterName: '',
    submitterEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (form.title.length > 120) return 'Title cannot exceed 120 characters';
    if (form.description.length < 20) return 'Description must be at least 20 characters';
    if (form.submitterEmail && !/^\S+@\S+\.\S+$/.test(form.submitterEmail))
      return 'Please enter a valid email';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/feedback', form);
      setSuccess(true);
      setForm({
        title: '',
        description: '',
        category: 'Feature Request',
        submitterName: '',
        submitterEmail: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#8a9bb5',
    marginBottom: '8px',
    fontFamily: 'DM Sans, sans-serif',
  };

  const goHomeLinkStyle = {
    background: 'transparent',
    border: '1px solid #1e2d42',
    color: '#8a9bb5',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: 'rgba(0, 229, 160, 0.2)',
          border: '2px solid rgba(0, 229, 160, 0.6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px',
          color: '#00e5a0',
          boxShadow: '0 0 20px rgba(0, 229, 160, 0.3)',
        }}>
          &#10003;
        </div>
        <h2 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '24px',
          color: '#f0f4ff',
          marginBottom: '12px',
        }}>
          Feedback Received!
        </h2>
        <p style={{
          color: '#8a9bb5',
          marginBottom: '32px',
          lineHeight: '1.6',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Thank you! Your feedback has been submitted and our AI is already analyzing it.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => setSuccess(false)}
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: '#00d4ff',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Submit Another
          </button>
          <a href="/" style={goHomeLinkStyle}>
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>
          Title <span style={{ color: '#ff4d6d' }}>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          maxLength={120}
          placeholder="Brief summary of your feedback"
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
        <p style={{ fontSize: '11px', color: '#4a5a72', marginTop: '6px', textAlign: 'right' }}>
          {form.title.length}/120
        </p>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>
          Description <span style={{ color: '#ff4d6d' }}>*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your feedback in detail (minimum 20 characters)"
          style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
          onFocus={e => {
            e.target.style.borderColor = '#00d4ff';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#1e2d42';
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={{
          fontSize: '11px',
          marginTop: '6px',
          color: form.description.length < 20 ? '#ff4d6d' : '#00e5a0',
        }}>
          {form.description.length} characters{' '}
          {form.description.length < 20
            ? `— ${20 - form.description.length} more needed`
            : '— ✓ Good to go'}
        </p>
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>
          Category <span style={{ color: '#ff4d6d' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              paddingRight: '40px',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#00d4ff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#1e2d42';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="Feature Request">Feature Request</option>
            <option value="Bug">Bug</option>
            <option value="Improvement">Improvement</option>
            <option value="Other">Other</option>
          </select>
          <svg
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8a9bb5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Name + Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>
            Name <span style={{ color: '#4a5a72', fontSize: '11px' }}>(optional)</span>
          </label>
          <input
            type="text"
            name="submitterName"
            value={form.submitterName}
            onChange={handleChange}
            placeholder="Your name"
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
        <div>
          <label style={labelStyle}>
            Email <span style={{ color: '#4a5a72', fontSize: '11px' }}>(optional)</span>
          </label>
          <input
            type="email"
            name="submitterEmail"
            value={form.submitterEmail}
            onChange={handleChange}
            placeholder="your@email.com"
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

      {/* Submit Button */}
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
          letterSpacing: '0.3px',
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
            Submitting...
          </span>
        ) : 'Submit Feedback →'}
      </button>
    </form>
  );
}