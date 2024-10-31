// src/utils/environment.js
export function isStaging() {
  return (
    window.location.hostname.includes('staging') ||
    window.location.pathname.includes('/staging')
  )
}
