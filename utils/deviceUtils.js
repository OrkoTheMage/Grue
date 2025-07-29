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
