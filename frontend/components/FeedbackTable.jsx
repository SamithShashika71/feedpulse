'use client';
import { useState } from 'react';
import SentimentBadge from './SentimentBadge';
import api from '../lib/api';

const STATUS_COLORS = {
  'New': { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)' },
  'In Review': { color: '#ffd166', bg: 'rgba(255, 209, 102, 0.1)', border: 'rgba(255, 209, 102, 0.3)' },
  'Resolved': { color: '#00e5a0', bg: 'rgba(0, 229, 160, 0.1)', border: 'rgba(0, 229, 160, 0.3)' },
};

const CATEGORY_COLORS = {
  'Bug': { color: '#ff4d6d', bg: 'rgba(255, 77, 109, 0.1)' },
  'Feature Request': { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)' },
  'Improvement': { color: '#ffd166', bg: 'rgba(255, 209, 102, 0.1)' },
  'Other': { color: '#8a9bb5', bg: 'rgba(138, 155, 181, 0.1)' },
};

export default function FeedbackTable({ feedbacks, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [reanalyzingId, setReanalyzingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/api/feedback/${id}`, { status });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReanalyze = async (id) => {
    setReanalyzingId(id);
    try {
      await api.post(`/api/feedback/${id}/reanalyze`);
      onRefresh();
    } catch (err) {
      console.error('Failed to reanalyze:', err);
    } finally {
      setReanalyzingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/feedback/${id}`);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 24px',
        background: '#111827',
        border: '1px solid #1e2d42',
        borderRadius: '16px',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
        <p style={{ color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif' }}>
          No feedback found
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {feedbacks.map((item) => {
        const isExpanded = expandedId === item._id;
        const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS['New'];
        const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];

        return (
          <div
            key={item._id}
            style={{
              background: '#111827',
              border: `1px solid ${isExpanded ? '#243447' : '#1e2d42'}`,
              borderRadius: '14px',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Main row */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : item._id)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto auto',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Title + summary */}
              <div>
                <p style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f0f4ff',
                  marginBottom: '4px',
                }}>
                  {item.title}
                </p>
                {item.ai_summary && (
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: '#8a9bb5',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '400px',
                  }}>
                    {item.ai_summary}
                  </p>
                )}
              </div>

              {/* Category */}
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                color: categoryStyle.color,
                background: categoryStyle.bg,
                whiteSpace: 'nowrap',
              }}>
                {item.category}
              </span>

              {/* Sentiment */}
              <SentimentBadge sentiment={item.ai_sentiment} />

              {/* Priority */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: item.ai_priority >= 7
                    ? 'rgba(255, 77, 109, 0.15)'
                    : item.ai_priority >= 4
                    ? 'rgba(255, 209, 102, 0.15)'
                    : 'rgba(0, 229, 160, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: item.ai_priority >= 7
                    ? '#ff4d6d'
                    : item.ai_priority >= 4
                    ? '#ffd166'
                    : '#00e5a0',
                }}>
                  {item.ai_priority ?? '—'}
                </div>
              </div>

              {/* Status */}
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                color: statusStyle.color,
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                whiteSpace: 'nowrap',
              }}>
                {item.status}
              </span>
            </div>

            {/* Expanded panel */}
            {isExpanded && (
              <div style={{
                borderTop: '1px solid #1e2d42',
                padding: '20px',
                background: '#0d1421',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {/* Description */}
                <div>
                  <p style={{ fontSize: '11px', color: '#4a5a72', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</p>
                  <p style={{ fontSize: '14px', color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' }}>{item.description}</p>
                </div>

                {/* AI Tags */}
                {item.ai_tags && item.ai_tags.length > 0 && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#4a5a72', fontFamily: 'DM Sans, sans-serif', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Tags</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.ai_tags.map((tag, i) => (
                        <span key={i} style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontFamily: 'DM Sans, sans-serif',
                          background: 'rgba(0, 212, 255, 0.08)',
                          color: '#00d4ff',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                        }}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submitter info */}
                {(item.submitterName || item.submitterEmail) && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#4a5a72', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submitted By</p>
                    <p style={{ fontSize: '13px', color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif' }}>
                      {item.submitterName && <span>{item.submitterName}</span>}
                      {item.submitterEmail && <span style={{ color: '#4a5a72' }}> · {item.submitterEmail}</span>}
                    </p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <p style={{ fontSize: '11px', color: '#4a5a72', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submitted</p>
                  <p style={{ fontSize: '13px', color: '#8a9bb5', fontFamily: 'DM Sans, sans-serif' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #1e2d42' }}>
                  {/* Status update */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#4a5a72', fontFamily: 'DM Sans, sans-serif' }}>Status:</span>
                    {['New', 'In Review', 'Resolved'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(item._id, s)}
                        disabled={item.status === s || updatingId === item._id}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          fontFamily: 'DM Sans, sans-serif',
                          cursor: item.status === s ? 'default' : 'pointer',
                          border: `1px solid ${item.status === s ? STATUS_COLORS[s].border : '#1e2d42'}`,
                          background: item.status === s ? STATUS_COLORS[s].bg : 'transparent',
                          color: item.status === s ? STATUS_COLORS[s].color : '#4a5a72',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    {/* Re-analyze */}
                    <button
                      onClick={() => handleReanalyze(item._id)}
                      disabled={reanalyzingId === item._id}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        background: 'rgba(0, 212, 255, 0.08)',
                        color: '#00d4ff',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {reanalyzingId === item._id ? '⟳ Analyzing...' : '✦ Re-analyze AI'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer',
                        border: '1px solid rgba(255, 77, 109, 0.3)',
                        background: 'rgba(255, 77, 109, 0.08)',
                        color: '#ff4d6d',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {deletingId === item._id ? 'Deleting...' : '✕ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}