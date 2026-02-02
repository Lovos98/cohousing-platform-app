/**
 * Get CSS variable value from the document root
 */
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return ''
  }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()
}

/**
 * Get map theme colors from CSS variables
 */
export function getMapThemeColors() {
  return {
    primary: getCSSVariable('--map-primary') || '#2D7E5A',
    primaryLight: getCSSVariable('--map-primary-light') || 'rgba(45, 126, 90, 0.15)',
    edgeHandle: getCSSVariable('--map-edge-handle') || '#F59E0B',
  }
}
