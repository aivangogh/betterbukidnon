import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Plays a Lottie JSON animation from `public/`, like the legacy `<dotlottie-player>`. The player
 * and the (large) JSON load only when the element scrolls near the viewport; with reduced
 * motion the first frame is shown without playing.
 */
export function LottieAnimation({ src, className }: { src: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = container.current
    if (!element) return
    let destroy: (() => void) | undefined
    let cancelled = false

    const load = async () => {
      const [{ default: lottie }, response] = await Promise.all([
        import('lottie-web/build/player/lottie_light'),
        fetch(src),
      ])
      if (cancelled || !response.ok) return
      const animationData: unknown = await response.json()
      if (cancelled) return
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const animation = lottie.loadAnimation({
        container: element,
        renderer: 'svg',
        loop: true,
        autoplay: !still,
        animationData,
      })
      destroy = () => animation.destroy()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        load().catch(() => {
          // Decorative only: leave the reserved space empty if the animation fails to load.
        })
      },
      { rootMargin: '200px' },
    )
    observer.observe(element)

    return () => {
      cancelled = true
      observer.disconnect()
      destroy?.()
    }
  }, [src])

  return <div ref={container} aria-hidden="true" className={cn('w-full', className)} />
}
