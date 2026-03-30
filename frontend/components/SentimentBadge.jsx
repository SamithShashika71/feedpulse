export default function SentimentBadge({ sentiment }) {
  if (!sentiment) return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      background: '#1e2d42',
      color: '#4a5a72',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      Pending
    </span>
  );

  const styles = {
    Positive: {
      background: 'rgba(0, 229, 160, 0.15)',
      color: '#00e5a0',
      border: '1px solid rgba(0, 229, 160, 0.3)',
    },
    Neutral: {
      background: 'rgba(255, 209, 102, 0.15)',
      color: '#ffd166',
      border: '1px solid rgba(255, 209, 102, 0.3)',
    },
    Negative: {
      background: 'rgba(255, 77, 109, 0.15)',
      color: '#ff4d6d',
      border: '1px solid rgba(255, 77, 109, 0.3)',
    },
  };

  const icons = {
    Positive: '↑',
    Neutral: '→',
    Negative: '↓',
  };

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      fontFamily: 'DM Sans, sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      ...styles[sentiment],
    }}>
      {icons[sentiment]} {sentiment}
    </span>
  );
}