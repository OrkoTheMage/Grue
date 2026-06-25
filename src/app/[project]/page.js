import { notFound } from 'next/navigation'
import projects from '../../data/projects'
import games from '../../data/games'
import ScreenshotGallery from '../../components/ScreenshotGallery'
import ProjectVideo from '../../components/ProjectVideo'

// ── Tag colour map ────────────────────────────────────────────────────────────
const PROJECT_TAG_COLORS = {
  'JavaScript':    { bg: '#f7df1e', color: '#1a1a00' },
  'HTML':          { bg: '#e34c26', color: '#fff' },
  'CSS':           { bg: '#264de4', color: '#fff' },
  'React':         { bg: '#61dafb', color: '#1a1a00' },
  'Tailwind':      { bg: '#38bdf8', color: '#1a1a00' },
  'Vite':          { bg: '#646cff', color: '#fff' },
  'Node.JS':       { bg: '#3c873a', color: '#fff' },
  'Node.js':       { bg: '#3c873a', color: '#fff' },
  'CLI':           { bg: '#2b2b2b', color: '#fff', border: 'rgba(255,255,255,0.25)' },
  'ASCII':         { bg: '#1a1a1a', color: '#fff', border: 'rgba(255,255,255,0.25)' },
  'Python':        { bg: '#3572A5', color: '#fff' },
  'Local Storage': { bg: '#ff7043', color: '#fff' },
  'Markdown':      { bg: '#4a90d9', color: '#fff' },
  'LocalStorage':  { bg: '#ff7043', color: '#fff' },
  'neofetch':      { bg: '#4a90d9', color: '#fff' },
}

const GAME_TAG_COLORS = {
  'JavaScript':     { bg: '#f7df1e', color: '#1a1a00' },
  'Python':         { bg: '#3572A5', color: '#fff' },
  'Browser Game':   { bg: '#28a745', color: '#fff' },
  'Card Game':      { bg: '#6f42c1', color: '#fff' },
  'Multiplayer':    { bg: '#007bff', color: '#fff' },
  'Text Adventure': { bg: '#d39e00', color: '#fff' },
  'RPG':            { bg: '#dc3545', color: '#fff' },
  'CLI':            { bg: '#2b2b2b', color: '#fff', border: 'rgba(255,255,255,0.25)' },
  'ASCII':          { bg: '#1a1a1a', color: '#fff', border: 'rgba(255,255,255,0.25)' },
  'Management':     { bg: '#6f42c1', color: '#fff' },
  'Idle Game':      { bg: '#007bff', color: '#fff' },
  'CPU':            { bg: '#dc3545', color: '#fff' },
  'Modes':          { bg: '#fd7e14', color: '#fff' },
  'MUD-Inspired':   { bg: '#20c997', color: '#1a1a00' },
  'WIP':            { bg: '#e83e8c', color: '#1a1a00' },
}

const DEFAULT_TAG = { bg: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'rgba(255,255,255,0.25)' }

// ── GitHub SVG mark ───────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18"
    height="18"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

// ── Metadata ──────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const projectSlugs = Object.keys(projects)
  const gameSlugs = Object.keys(games)
  return [...projectSlugs, ...gameSlugs].map((slug) => ({ project: slug }))
}

export async function generateMetadata({ params }) {
  const { project: slug } = await params
  const item = projects[slug] || games[slug]
  if (!item) return {}
  return { title: `${item.name} | Grue` }
}

// ── Tag renderer ──────────────────────────────────────────────────────────────
function TagList({ tags, tagColors }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
      {tags.map((tag) => {
        const scheme = (tagColors[tag] ?? DEFAULT_TAG)
        return (
          <span
            key={tag}
            style={{
              fontSize: '0.72rem',
              fontFamily: 'ui-monospace, Cascadia Code, Consolas, monospace',
              fontWeight: 700,
              letterSpacing: '0.03em',
              padding: '0.35rem 0.8rem',
              background: scheme.bg,
              color: scheme.color,
              border: `1px solid ${scheme.border ?? 'transparent'}`,
              borderRadius: '4px',
            }}
          >
            {tag}
          </span>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ItemPage({ params }) {
  const { project: slug } = await params
  
  // Check both projects and games
  const project = projects[slug]
  const game = games[slug]
  const item = project || game
  
  if (!item) notFound()
  
  const isProject = !!project
  const tagColors = isProject ? PROJECT_TAG_COLORS : GAME_TAG_COLORS
  const itemType = isProject ? 'projects' : 'games'

  return (
    <div className="project-page-container">

      {/* ── Path / breadcrumb ─────────────────────────────────────────────── */}
      <nav style={{ marginBottom: '3rem' }}>
        <span
          className="pixel-font-small neon-title"
          style={{ fontSize: '0.5rem' }}
        >
          grue.sh / {itemType} / {item.slug}
        </span>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header style={{ marginBottom: '3.5rem' }}>

        {/* Main title — same glow + font as the GRUE logo */}
        <h1
          className="pixel-font"
          style={{
            fontSize: 'clamp(1.1rem, 3.5vw, 2rem)',
            color: '#ffffff',
            marginBottom: '1.25rem',
            lineHeight: 1.5,
          }}
        >
          {item.name}
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: '1.05rem',
          color: '#ffffff',
          maxWidth: '640px',
          lineHeight: 1.75,
          marginBottom: '1.75rem',
        }}>
          {item.tagline}
        </p>

        {/* Colour-coded tags */}
        <TagList tags={item.tags} tagColors={tagColors} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {item.github && slug !== 'cli-system-fetch' && (
            <a
              href={item.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-font-small github-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.4rem',
                background: '#24292e',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '0.55rem',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
            >
              <GitHubIcon />
              GitHub
            </a>
          )}
          {item.playUrl && (
            <a
              href={item.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-font-small play-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.4rem',
                background: '#24292e',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '0.55rem',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'background 150ms ease, border-color 150ms ease',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </a>
          )}
        </div>
        <style>{`.github-button:hover { background: #ffffff !important; color: #24292e !important; }`}</style>
        <style>{`.play-button:hover { background: rgba(40, 167, 69, 1) !important; }`}</style>
        <style>{`.demo-video:hover { transform: scale(1.02); }`}</style>
        <style>{`.demo-video { transition: transform 150ms ease; }`}</style>
      </header>

      <hr className="project-divider" />

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2
          className="pixel-font neon-title"
          style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}
        >
          About
        </h2>
        <div className="text-section-box">
          <p style={{ fontSize: '1rem', color: '#ffffff', maxWidth: '720px', lineHeight: 1.85 }}>
            {item.description}
          </p>
        </div>
      </section>

      {isProject ? (
        <>
          <hr className="project-divider" />

          {/* ── Video Demo ────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2
              className="pixel-font neon-title"
              style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}
            >
              Video Demo
            </h2>

            {item.localVideo ? (
              <ProjectVideo src={item.localVideo} type={item.localVideo.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            ) : item.video ? (
              <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '1200px', aspectRatio: '16/9' }}>
                <iframe
                  src={item.video}
                  width="100%"
                  height="100%"
                  style={{ display: 'block', border: 'none' }}
                  allowFullScreen
                  title={`${item.name} demo video`}
                />
              </div>
            ) : (
              <div className="content-placeholder" style={{ maxWidth: '800px', height: '360px' }}>
                video coming soon
              </div>
            )}
          </section>

          <hr className="project-divider" />

          {/* ── Screenshots ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2
              className="pixel-font neon-title"
              style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}
            >
              Screenshots
            </h2>

            {item.screenshots.length > 0 ? (
              <ScreenshotGallery screenshots={item.screenshots} />
            ) : (
              <div className="content-placeholder" style={{ height: '220px' }}>
                screenshots coming soon
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <hr className="project-divider" />

          {/* ── Video Demo ────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2
              className="pixel-font neon-title"
              style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}
            >
              Video Demo
            </h2>

            {item.localVideo ? (
              <video
                controls
                autoPlay
                muted
                loop
                style={{ borderRadius: '8px', maxWidth: '1200px', width: '100%' }}
              >
                <source src={item.localVideo} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : item.video ? (
              <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '1200px', aspectRatio: '16/9' }}>
                <iframe
                  src={item.video}
                  width="100%"
                  height="100%"
                  style={{ display: 'block', border: 'none' }}
                  allowFullScreen
                  title={`${item.name} demo video`}
                />
              </div>
            ) : (
              <div className="content-placeholder" style={{ maxWidth: '1200px', height: '450px' }}>
                video coming soon
              </div>
            )}
          </section>

          <hr className="project-divider" />

          {/* ── Screenshots ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2
              className="pixel-font neon-title"
              style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}
            >
              Screenshots
            </h2>

            {item.screenshots.length > 0 ? (
              <ScreenshotGallery screenshots={item.screenshots} />
            ) : (
              <div className="content-placeholder" style={{ height: '220px' }}>
                screenshots coming soon
              </div>
            )}
          </section>
        </>
      )}

      <hr className="project-divider" />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
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