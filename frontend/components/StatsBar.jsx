export default function StatsBar({ stats }) {
  const cards = [
    {
      label: 'Total Feedback',
      value: stats?.total ?? '—',
      icon: '📋',
      color: '#00d4ff',
      bg: 'rgba(0, 212, 255, 0.08)',
      border: 'rgba(0, 212, 255, 0.2)',
    },
    {
      label: 'Open Items',
      value: stats?.open ?? '—',
      icon: '🔴',
      color: '#ff4d6d',
      bg: 'rgba(255, 77, 109, 0.08)',
      border: 'rgba(255, 77, 109, 0.2)',
    },
    {
      label: 'Avg Priority',
      value: stats?.avgPriority ?? '—',
      icon: '⚡',
      color: '#ffd166',
      bg: 'rgba(255, 209, 102, 0.08)',
      border: 'rgba(255, 209, 102, 0.2)',
    },
    {
      label: 'Top Tag',
      value: stats?.mostCommonTag ?? '—',
      icon: '🏷️',
      color: '#00e5a0',
      bg: 'rgba(0, 229, 160, 0.08)',
      border: 'rgba(0, 229, 160, 0.2)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: card.bg,
          border: `1px solid ${card.border}`,
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <span style={{
              fontSize: '11px',
              color: card.color,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: '600',
              background: `rgba(${card.color}, 0.1)`,
            }}>LIVE</span>
          </div>
          <p style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: card.color,
            lineHeight: '1',
          }}>{card.value}</p>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
            color: '#8a9bb5',
          }}>{card.label}</p>
        </div>
      ))}
    </div>
  );
}