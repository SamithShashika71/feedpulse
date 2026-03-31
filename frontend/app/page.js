import FeedbackForm from '../components/FeedbackForm';

export const metadata = {
  title: 'FeedPulse — Submit Feedback',
  description: 'Share your feedback and help us improve',
};

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top left, #0d1f35 0%, #080c14 50%, #080c14 100%)',
      padding: '0',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Navbar */}
      <nav style={{
        background: 'rgba(17, 24, 39, 0.8)',
        borderBottom: '1px solid #1e2d42',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <span style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: '700',
            fontSize: '18px',
            color: '#f0f4ff',
          }}>
            Feed<span style={{ color: '#00d4ff' }}>Pulse</span>
          </span>
        </div>

        {/* Admin Login Button */}
        <a href="/login" style={{
          padding: '8px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          fontFamily: 'DM Sans, sans-serif',
          cursor: 'pointer',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          background: 'rgba(0, 212, 255, 0.08)',
          color: '#00d4ff',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}>
          Admin Login →
        </a>
      </nav>

      {/* Main content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05))',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
            }}>
              💬
            </div>
            <h1 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '36px',
              fontWeight: '800',
              color: '#f0f4ff',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}>
              Feed<span style={{ color: '#00d4ff' }}>Pulse</span>
            </h1>
            <p style={{ color: '#8a9bb5', fontSize: '15px', lineHeight: '1.6' }}>
              Share your feedback — our AI will prioritize what matters most
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#111827',
            border: '1px solid #1e2d42',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          }}>
            {/* AI badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
              marginBottom: '24px',
            }}>
              <span style={{ fontSize: '10px' }}>✦</span>
              <span style={{ fontSize: '12px', color: '#00d4ff', fontWeight: '600', fontFamily: 'DM Sans, sans-serif' }}>
                AI-Powered Analysis
              </span>
            </div>

            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: '#f0f4ff',
              marginBottom: '28px',
            }}>
              Submit Your Feedback
            </h2>

            <FeedbackForm />
          </div>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            color: '#4a5a72',
            fontSize: '12px',
            marginTop: '24px',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            Powered by Groq AI · All feedback is reviewed by our team
          </p>
        </div>
      </div>
    </main>
  );
}