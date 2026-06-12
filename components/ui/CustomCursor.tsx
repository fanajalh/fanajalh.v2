"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  
  // Track mouse position
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring config for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Fast track inner dot
  const fastSpringConfig = { damping: 50, stiffness: 1000 }
  const innerCursorXSpring = useSpring(cursorX, fastSpringConfig)
  const innerCursorYSpring = useSpring(cursorY, fastSpringConfig)

  useEffect(() => {
    // Check if device has mouse (not touch)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16) // Center the 32px circle
      cursorY.set(e.clientY - 16)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [cursorX, cursorY, isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Outer trailing circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-black dark:border-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      
      {/* Inner dot (immediate following) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-black dark:bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: innerCursorXSpring,
          y: innerCursorYSpring,
          translateX: 12, // Offset to center 8px dot inside 32px circle
          translateY: 12,
        }}
      />
    </>
  )
}
