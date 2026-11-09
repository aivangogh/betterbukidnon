import { useEffect, useRef, useState } from 'react'

export function PwaUpdateNotice() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>()
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const refreshOnUpdate = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const onControllerChange = () => {
      if (!refreshOnUpdate.current) return
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    void navigator.serviceWorker.register('/sw.js').then((nextRegistration) => {
      setRegistration(nextRegistration)

      nextRegistration.addEventListener('updatefound', () => {
        const worker = nextRegistration.installing
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true)
          }
        })
      })
    })

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])

  if (!updateAvailable) return null

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl border border-civic-100 bg-white p-4 shadow-xl"
      aria-live="polite"
    >
      <p className="font-semibold text-slate-950">An update is available</p>
      <p className="mt-1 text-sm text-slate-600">Refresh to use the latest public information.</p>
      <button
        type="button"
        onClick={() => {
          refreshOnUpdate.current = true
          registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
        }}
        className="mt-3 rounded-md bg-civic-700 px-4 py-2 text-sm font-semibold text-white hover:bg-civic-800"
      >
        Refresh now
      </button>
    </aside>
  )
}
