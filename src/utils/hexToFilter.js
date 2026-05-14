export function hexToFilter(hex) {
  if (!hex || hex.length < 7) return 'none'

  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lPct = Math.round(l * 100)

  return `brightness(0) saturate(100%) invert(${lPct > 50 ? 1 : 0}) sepia(1) saturate(3) hue-rotate(${h}deg) brightness(${lPct / 50})`
}