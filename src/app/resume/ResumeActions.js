"use client"

export default function ResumeActions() {
  return (
    <>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <a
          href="https://drive.google.com/uc?export=download&id=1hMx4fIxql8_8HXbCaEp7ZtpA4BRUiWxo"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-font-small resume-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '0.65rem',
            border: '1px solid rgba(255,255,255,0.7)',
          }}
        >
          Download
        </a>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Resume',
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied to clipboard!')
            }
          }}
          className="pixel-font-small resume-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: '#000',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '0.65rem',
            border: '1px solid rgba(255,255,255,0.7)',
            cursor: 'pointer',
          }}
        >
          Share
        </button>
      </div>
    </>
  )
}