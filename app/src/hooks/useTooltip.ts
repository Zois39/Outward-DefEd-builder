import { useState, useCallback, useRef, useEffect } from 'react'

interface TooltipState {
  visible: boolean
  x: number
  y: number
  content: React.ReactNode
}

export function useTooltip(delay = 300) {
  const [state, setState] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: null })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTouch = useRef(false)

  // Detect touch device once
  useEffect(() => {
    isTouch.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  const show = useCallback((e: React.MouseEvent | React.TouchEvent, content: React.ReactNode) => {
    if (timer.current) clearTimeout(timer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)

    let clientX: number, clientY: number
    if ('touches' in e) {
      const t = e.touches[0]
      clientX = t.clientX
      clientY = t.clientY
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }

    const display = () => {
      // Smart positioning
      const tw = 320, th = 220
      let x = clientX + 12
      let y = clientY + 12
      if (x + tw > window.innerWidth) x = clientX - tw - 8
      if (y + th > window.innerHeight) y = clientY - th - 8
      if (x < 0) x = 8
      if (y < 0) y = 8
      setState({ visible: true, x, y, content })
    }

    if (isTouch.current) {
      // On touch: show immediately on tap
      display()
    } else {
      timer.current = setTimeout(display, delay)
    }
  }, [delay])

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    hideTimer.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 100)
  }, [])

  // Hide on scroll or outside tap (for iOS)
  useEffect(() => {
    if (!state.visible) return
    const hideNow = () => setState(s => ({ ...s, visible: false }))
    window.addEventListener('scroll', hideNow, { passive: true })
    window.addEventListener('touchstart', hideNow, { passive: true })
    return () => {
      window.removeEventListener('scroll', hideNow)
      window.removeEventListener('touchstart', hideNow)
    }
  }, [state.visible])

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  return { ...state, show, hide }
}
