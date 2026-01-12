import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Sidebar'
// import { useUserStore } from '../../store/store'
// import useCheckPermission from '../../utils/checkPermission'
import './routewithsidebar.scss'
import Navbar from '../Navbar/Navbar'

// Check if running on demo host or low-power mode - skip scroll optimizations
const shouldSkipScrollOptimizations = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('gs-low-power')

const RouteWithSidebar = ({ children }) => {
  // const { userDetails } = useUserStore((state) => state)
  // const { isHidden } = useCheckPermission()
  const [open, setOpen] = useState(false)
  const [collapseSidebar, setCollapseSidebar] = useState(false)
  const scrollRafRef = useRef(null)
  const scrollEndTimerRef = useRef(null)
  const layoutAnimTimerRef = useRef(null)
  const prevCollapsedRef = useRef(false)
  const [layoutAnimClass, setLayoutAnimClass] = useState('')

  // Perf: disable GPU-heavy blur while actively scrolling to keep scrolling snappy.
  // Skip this on low-power mode since effects are already disabled.
  useEffect(() => {
    // In low-power mode, effects are already disabled via CSS, so no need for scroll class
    if (shouldSkipScrollOptimizations()) return

    const root = document.documentElement

    const onScroll = () => {
      if (scrollRafRef.current) return
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null
        root.classList.add('gs-is-scrolling')
        if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current)
        scrollEndTimerRef.current = window.setTimeout(() => {
          root.classList.remove('gs-is-scrolling')
        }, 140)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
      if (scrollRafRef.current) window.cancelAnimationFrame(scrollRafRef.current)
      if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current)
      root.classList.remove('gs-is-scrolling')
    }
  }, [])

  // "Premium but cheap" layout nudge on sidebar collapse/expand (transform-only animation).
  useEffect(() => {
    const prev = prevCollapsedRef.current
    prevCollapsedRef.current = collapseSidebar

    // First render: no animation
    if (prev === collapseSidebar) return

    const dir = collapseSidebar ? 'gs-layout-shift-left' : 'gs-layout-shift-right'
    setLayoutAnimClass(dir)
    if (layoutAnimTimerRef.current) window.clearTimeout(layoutAnimTimerRef.current)
    layoutAnimTimerRef.current = window.setTimeout(() => {
      setLayoutAnimClass('')
    }, 170)

    return () => {
      if (layoutAnimTimerRef.current) window.clearTimeout(layoutAnimTimerRef.current)
    }
  }, [collapseSidebar])

  return (
    <>
      <Sidebar open={open} collapseSidebar={collapseSidebar} setCollapseSidebar={setCollapseSidebar} />
      <main className={`${!collapseSidebar ? 'content px-0' : 'content-collapsed px-0'} ${open ? 'is-menu-open' : ''} ${layoutAnimClass}`}>
        <Navbar open={open} setOpen={setOpen} collapseSidebar={collapseSidebar} setCollapseSidebar={setCollapseSidebar} />
        <div className='component-container'>
          {children}
        </div>
      </main>
    </>
  )
}

export default RouteWithSidebar
