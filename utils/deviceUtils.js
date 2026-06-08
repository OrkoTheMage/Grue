// Utility functions to detect device type
// These functions check if the current device is a mobile or tablet device
// Used in page.js to conditionally render components

export const isMobile = () => {
  if (typeof window === 'undefined') return false
  
  // Check for touch device and screen size
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isMobileSize = window.innerWidth <= 768
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  return hasTouch && (isMobileSize || isMobileUserAgent)
}

export const isTablet = () => {
  if (typeof window === 'undefined') return false
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isTabletSize = window.innerWidth > 768 && window.innerWidth <= 1024
  const isTabletUserAgent = /iPad|Android.*(?!Mobile)/i.test(navigator.userAgent)
  
  return hasTouch && (isTabletSize || isTabletUserAgent)
}

// Detects if the device likely uses an on-screen keyboard
// Returns true for touch devices that would trigger virtual keyboards
export const usesOnScreenKeyboard = () => {
  if (typeof window === 'undefined') return false
  
  // Use screen width as primary indicator
  const isSmallScreen = window.innerWidth < 1024
  
  // Check for mobile user agent
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Touch capability check
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Coarse pointer indicates touch/pen input
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  
  return isSmallScreen || isMobileDevice || hasTouch || hasCoarsePointer
}
