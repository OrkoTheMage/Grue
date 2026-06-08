import { Press_Start_2P } from 'next/font/google'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

export const metadata = {
  title: 'Project | Grue',
}

export default function ProjectLayout({ children }) {
  return (
    <div className={`min-h-screen min-w-screen ${pressStart.variable} bg-canvas`}>
      <div className="bg-elev">
        <div className="site-container">
          {/* Halftone overlay (fixed, non-interactive) */}
          <div className="halftone-overlay" aria-hidden="true" />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}