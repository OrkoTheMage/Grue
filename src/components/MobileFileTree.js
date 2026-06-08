"use client"
import React, { useState, useEffect, useCallback } from "react"
import CRTAnimation from "./CRTAnimation"

export default function MobileFileTree() {
  const [currentDir, setCurrentDir] = useState("/")
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  const directories = {
    "/": [
      { name: "projects", type: "dir" },
      { name: "games", type: "dir" },
      { name: "contact", type: "dir" },
    ],
    "/projects": [
      { name: "js-presenter", type: "link", url: `${baseUrl}/js-presenter` },
      { name: "cli-presenter", type: "link", url: `${baseUrl}/cli-presenter` },
      { name: "orkos-todo-tool", type: "link", url: `${baseUrl}/orkos-todo-tool` },
      { name: "..", type: "dir", target: "/" },
    ],
    "/games": [
      { name: "in-between", type: "play", url: "https://homies-llc.github.io/In-Between/" },
      { name: "sigil", type: "play", url: "https://orkothemage.github.io/Sigil-The-City-of-Doors/sigil.html" },
      { name: "venture", type: "link", url: `${baseUrl}/venture` },
      { name: "..", type: "dir", target: "/" },
    ],
    "/contact": [
      { name: "github", type: "link", url: "https://github.com/OrkoTheMage" },
      { name: "resume", type: "link", url: `${baseUrl}/resume` },
      { name: "contactinfo.md", type: "file", content: "Email: contact@grue.sh\nGitHub: github.com/OrkoTheMage" },
      { name: "..", type: "dir", target: "/" },
    ],
  }

  const handleItemClick = (item) => {
    if (item.type === "dir") {
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
    <div className="relative min-h-screen text-white" style={{ minHeight: '100vh', minHeight: '100dvh' }}>
      <div className="crt-animation" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <CRTAnimation />
      </div>

      <div className="cli-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="w-full max-w-2xl mx-auto p-4 pt-8">
          {/* Header */}
          <div className="text-green-400 text-lg mb-4 font-mono">
            grue.sh mobile explorer
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
                className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white/10 transition-colors ${getItemColor(item.type)}`}
              >
                <span className="font-mono text-sm">{getIcon(item.type)}</span>
                <span className="font-mono text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
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
                <div className="text-green-400 font-mono text-sm mb-4">
                  {selectedItem.name}
                </div>
                <div className="text-gray-400 font-mono text-xs mb-4">
                  {selectedItem.type === "play" ? "Opens game in browser" : "Opens page"}
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
