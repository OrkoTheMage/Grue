"use client"

export default function ProjectVideo({ src, type = "video/mp4" }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        onClick={(e) => e.target.requestFullscreen()}
        className="demo-video"
        style={{ borderRadius: '8px', maxWidth: '1200px', width: '100%', cursor: 'pointer' }}
      >
        <source src={src} type={type} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
