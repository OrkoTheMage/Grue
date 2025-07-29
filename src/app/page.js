"use client"
import { useState, useEffect } from "react"
import CLI from "@/components/CLI"
import CRTAnimation from "@/components/CRTAnimation"
import MobileDisabled from "@/components/MobileDisabled"
import { isMobile, isTablet } from "../../utils/deviceUtils"

export default function Home() {
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    // Check if device is mobile or tablet
    const checkDevice = () => {
      setIsMobileDevice(isMobile() || isTablet())
    }

    checkDevice()
    
    // Also check on window resize
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Show mobile disabled message
  if (isMobileDevice) {
    return <MobileDisabled />
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
