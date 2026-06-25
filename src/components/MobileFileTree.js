"use client"
import React, { useState } from "react"
import CRTAnimation from "./CRTAnimation"
import projects from "../data/projects"
import games from "../data/games"

export default function MobileFileTree() {
  const [currentDir, setCurrentDir] = useState("/")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentDir])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  const directories = {
    "/": [
      { name: "projects", type: "dir", target: "/projects", slug: "projects" },
      { name: "games", type: "dir", target: "/games", slug: "games" },
      { name: "contact", type: "dir", target: "/contact", slug: "contact" },
    ],
    "/projects": [
      ...Object.values(projects).map(p => ({
        name: p.name,
        slug: p.slug,
        type: "link",
        url: `${baseUrl}/${p.slug}`,
        description: p.tagline,
      })),
      { name: "return", type: "back", target: "/", slug: ".." },
    ],
    "/games": [
      ...Object.values(games).map(g => ({
        name: g.name,
        slug: g.slug,
        type: "link",
        url: g.playUrl || `${baseUrl}/${g.slug}`,
        description: g.tagline,
      })),
      { name: "return", type: "back", target: "/", slug: ".." },
    ],
    "/contact": [
      { name: "GitHub", slug: "github", type: "link", url: "https://github.com/OrkoTheMage", description: "View my GitHub profile" },
      { name: "Resume", slug: "resume", type: "link", url: `${baseUrl}/resume`, description: "View my resume" },
      { name: "contactinfo.md", type: "file", slug: "contactinfo.md", content: "Email: aeryngrindle@gmail.com\nGitHub: github.com/OrkoTheMage" },
      { name: "return", type: "back", target: "/", slug: ".." },
    ],
  }

  const handleItemClick = (item) => {
    if (item.type === "dir" || item.type === "back") {
      setCurrentDir(item.target)
    } else if (item.type === "link" || item.type === "play") {
      setSelectedItem(item)
      setShowModal(true)
    } else if (item.type === "file") {
      setSelectedItem(item)
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
  }

  const items = directories[currentDir] || []

  const getIcon = (type) => {
    switch (type) {
      case "dir": return "[DIR]"
      case "link": return "[LNK]"
      case "play": return "[PLY]"
      case "file": return "[TXT]"
      case "back": return "[..]"
      default: return "[   ]"
    }
  }

  const getItemColor = (type) => {
    switch (type) {
      case "dir": return "text-blue-400"
      case "link": return "text-green-400"
      case "play": return "text-yellow-400"
      case "file": return "text-gray-400"
      default: return "text-white"
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white" style={{ minHeight: '100vh', minHeight: '100dvh' }}>
      {/* CRT Animation */}
      <div className="crt-animation">
        <CRTAnimation />
      </div>

      {/* Content */}
      <div className="cli-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="w-full max-w-2xl mx-auto p-4 pt-8">
          {/* Header */}
          <div className="text-green-400 text-lg mb-4 font-mono">
            grue.sh
          </div>

          {/* Path */}
          <div className="text-blue-400 text-sm mb-6 font-mono">
            {currentDir}
          </div>

          {/* File list */}
          <div className="space-y-1">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className={`flex flex-col gap-1 p-3 rounded cursor-pointer hover:bg-white/10 transition-colors ${getItemColor(item.type)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{getIcon(item.type)}</span>
                  <span className="font-mono text-sm font-bold">{item.name}</span>
                </div>
                {item.description && (
                  <div className="text-xs opacity-70 pl-9 font-mono truncate">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 p-4"
          onClick={closeModal}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="bg-black border border-white rounded-lg p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            {selectedItem.type === "file" ? (
              <>
                <div className="text-blue-400 font-mono text-sm mb-4">
                  ─── {selectedItem.name} ───
                </div>
                <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                  {selectedItem.content}
                </pre>
              </>
            ) : (
              <>
                <div className="text-green-400 font-mono text-lg mb-2">
                  {selectedItem.name}
                </div>
                {selectedItem.description && (
                  <div className="text-gray-400 font-mono text-xs mb-4">
                    {selectedItem.description}
                  </div>
                )}
                <div className="text-gray-500 font-mono text-xs mb-4">
                  [{selectedItem.type === "play" ? "PLAY" : "OPEN"}] {selectedItem.type === "play" ? "Opens game in browser" : "Opens project page"}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 px-4 border border-white rounded text-sm font-mono hover:bg-white hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      window.open(selectedItem.url, "_blank")
                      closeModal()
                    }}
                    className="flex-1 py-2 px-4 bg-white text-black rounded text-sm font-mono hover:bg-gray-200 transition-colors"
                  >
                    {selectedItem.type === "play" ? "Play" : "Open"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
