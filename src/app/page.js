"use client"
import { useState, useEffect } from "react"
import CLI from "@/components/CLI"
import CRTAnimation from "@/components/CRTAnimation"
import MobileFileTree from "@/components/MobileFileTree"
import { usesOnScreenKeyboard } from "../../utils/deviceUtils"

export default function Home() {
  const [useTouchUI, setUseTouchUI] = useState(false)

  useEffect(() => {
    // Check if device uses on-screen keyboard
    const checkDevice = () => {
      setUseTouchUI(usesOnScreenKeyboard())
    }

    checkDevice()
    
    // Also check on window resize
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Show touch-friendly file tree for touch devices
  if (useTouchUI) {
    return <MobileFileTree />
  }

  // Show normal CLI for desktop
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="crt-animation">
        <CRTAnimation/>
      </div>

      <div className="cli-container">
        <CLI/>
      </div>
    </div>
  )
}
