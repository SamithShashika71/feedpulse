'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import StatsBar from '../../components/StatsBar';
import FeedbackTable from '../../components/FeedbackTable';

export default function DashboardPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    sort: '',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', 10);

      const res = await api.get(`/api/feedback?${params.toString()}`);
      setFeedbacks(res.data.data.feedbacks);
      setPagination({ total: res.data.data.total, pages: res.data.data.pages });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('feedpulse_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/api/feedback/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('feedpulse_token');
    if (!token) { router.push('/login'); return; }
    fetchFeedback();
    fetchStats();
  }, [fetchFeedback, fetchStats, router]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleAISummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get('/api/feedback/summary');
      setSummary(res.data.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('feedpulse_token');
    router.push('/login');
  };

  const selectStyle = {
    background: '#0d1421',
    border: '1px solid #1e2d42',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#f0f4ff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
    }}>
      {/* Navbar */}
      <nav style={{
        background: '#111827',
        borderBottom: '1px solid #1e2d42',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}>💬</div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: '700', fontSize: '18px', color: '#f0f4ff' }}>
            Feed<span style={{ color: '#00d4ff' }}>Pulse</span>
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '6px',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            fontSize: '10px',
            color: '#00d4ff',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: '600',
          }}>ADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              border: '1px solid #1e2d42',
              background: 'transparent',
              color: '#8a9bb5',
            }}
          >
            ← Public Form
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              border: '1px solid rgba(255, 77, 109, 0.3)',
              background: 'rgba(255, 77, 109, 0.08)',
              color: '#ff4d6d',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Page title */}
        <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '26px', fontWeight: '700', color: '#f0f4ff', marginBottom: '4px' }}>
              Feedback Dashboard
            </h1>
            <p style={{ color: '#8a9bb5', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' }}>
              {pagination.total} total submissions · AI-powered insights
            </p>
          </div>
          <button
            onClick={handleAISummary}
            disabled={summaryLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              background: 'rgba(0, 212, 255, 0.08)',
              color: '#00d4ff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {summaryLoading ? '⟳ Generating...' : '✦ AI Weekly Summary'}
          </button>
        </div>

        {/* Stats Bar */}
        <StatsBar stats={stats} />

        {/* AI Summary Panel */}
        {summary && (
          <div style={{
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px' }}>✦</span>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '15px', fontWeight: '600', color: '#00d4ff' }}>
                AI Weekly Themes
              </h3>
              <button
                onClick={() => setSummary(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#4a5a72', cursor: 'pointer', fontSize: '16px' }}
              >✕</button>
            </div>
            {summary.themes ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {summary.themes.map((theme, i) => (
                  <div key={i} style={{
                    background: '#0d1421',
                    border: '1px solid #1e2d42',
                    borderRadius: '10px',
                    padding: '14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        width: '20px', height: '20px',
                        background: 'rgba(0, 212, 255, 0.15)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: '#00d4ff', fontWeight: '700',
                      }}>{i + 1}</span>
                      <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '13px', fontWeight: '600', color: '#f0f4ff' }}>
                        {theme.theme}
                      </p>
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#8a9bb5', lineHeight: '1.5' }}>
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
                {summary.summary}
              </p>
            )}
          </div>
        )}

        {/* Filters */}
        <div style={{
          background: '#111827',
          border: '1px solid #1e2d42',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4a5a72', fontSize: '14px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                ...selectStyle,
                width: '100%',
                paddingLeft: '32px',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Category filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Improvement">Improvement</option>
            <option value="Other">Other</option>
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={selectStyle}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={selectStyle}
          >
            <option value="">Newest First</option>
            <option value="priority">Highest Priority</option>
            <option value="sentiment">Sentiment</option>
            <option value="date_asc">Oldest First</option>
          </select>

          {/* Clear */}
          {(filters.category || filters.status || filters.sort || filters.search) && (
            <button
              onClick={() => setFilters({ category: '', status: '', sort: '', search: '', page: 1 })}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                border: '1px solid rgba(255, 77, 109, 0.3)',
                background: 'rgba(255, 77, 109, 0.08)',
                color: '#ff4d6d',
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{
              width: '32px', height: '32px',
              border: '3px solid #1e2d42',
              borderTop: '3px solid #00d4ff',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animationName: 'spin',
              animationDuration: '0.8s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }} />
            Loading feedback...
          </div>
        ) : (
          <FeedbackTable feedbacks={feedbacks} onRefresh={() => { fetchFeedback(); fetchStats(); }} />
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
          }}>
            <button
              onClick={() => handleFilterChange('page', filters.page - 1)}
              disabled={filters.page === 1}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                cursor: filters.page === 1 ? 'not-allowed' : 'pointer',
                border: '1px solid #1e2d42',
                background: 'transparent',
                color: filters.page === 1 ? '#4a5a72' : '#8a9bb5',
              }}
            >← Prev</button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handleFilterChange('page', p)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  border: `1px solid ${filters.page === p ? 'rgba(0, 212, 255, 0.3)' : '#1e2d42'}`,
                  background: filters.page === p ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  color: filters.page === p ? '#00d4ff' : '#8a9bb5',
                }}
              >{p}</button>
            ))}

            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={filters.page === pagination.pages}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                cursor: filters.page === pagination.pages ? 'not-allowed' : 'pointer',
                border: '1px solid #1e2d42',
                background: 'transparent',
                color: filters.page === pagination.pages ? '#4a5a72' : '#8a9bb5',
              }}
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}