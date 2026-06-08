"use client"
import { useState, useEffect, useCallback } from "react"
import Masonry from "react-masonry-css"

export default function ScreenshotGallery({ screenshots }) {
  const [activeIndex, setActiveIndex] = useState(null)

  const isOpen = activeIndex !== null
  const total  = screenshots.length

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1
  }

  const prev = useCallback(() =>
    setActiveIndex(i => (i - 1 + total) % total), [total])

  const next = useCallback(() =>
    setActiveIndex(i => (i + 1) % total), [total])

  const close = useCallback(() => setActiveIndex(null), [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === "Escape")      close()
      if (e.key === "ArrowLeft")   prev()
      if (e.key === "ArrowRight")  next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, prev, next, close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {screenshots.map((shot, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className="screenshot-item"
          >
            <img
              src={shot.src}
              alt={shot.alt}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "4px",
              }}
              loading="lazy"
            />
          </div>
        ))}
      </Masonry>

      {isOpen && (
        <div
          onClick={close}
          className="modal-overlay"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="modal-content"
          >
            <img
              src={screenshots[activeIndex].src}
              alt={screenshots[activeIndex].alt}
              className="modal-img"
            />

            <div className="modal-tracker">
              {activeIndex + 1} / {total}
            </div>

            {/* Mobile controls */}
            <div className="modal-controls-mobile">
              {total > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); prev() }}
                  aria-label="Previous screenshot"
                  className="modal-btn modal-btn-mobile"
                >
                  [&lt;]
                </button>
              )}

              <button
                onClick={e => { e.stopPropagation(); close() }}
                aria-label="Close"
                className="modal-btn modal-btn-mobile"
              >
                [x]
              </button>

              {total > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); next() }}
                  aria-label="Next screenshot"
                  className="modal-btn modal-btn-mobile"
                >
                  [&gt;]
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
