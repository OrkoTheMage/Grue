// Resume page - displays the user's resume as an embedded PDF
import ResumeActions from './ResumeActions'

export const metadata = {
  title: 'Resume | Grue',
}

export default function ResumePage() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '2rem', alignSelf: 'flex-start' }}>
        <span
          className="pixel-font-small neon-title"
          style={{ fontSize: '0.5rem' }}
        >
          grue.sh / resume
        </span>
      </nav>

      {/* PDF iframe */}
      <iframe
        src="https://drive.google.com/file/d/1hMx4fIxql8_8HXbCaEp7ZtpA4BRUiWxo/preview?usp=embed_googleplus"
        style={{
          border: 'none',
          maxWidth: '1000px',
          width: '100%',
          aspectRatio: '8.5 / 11',
          height: 'auto',
          borderRadius: '8px',
        }}
        title="Resume"
        allow="fullscreen"
      />

      <ResumeActions />

      {/* Footer */}
      <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <span
          className="pixel-font-small"
          style={{ fontSize: '0.45rem', color: '#ffffff' }}
        >
          grue.sh
        </span>
      </footer>
    </div>
  )
}