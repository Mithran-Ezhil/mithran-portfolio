/**
 * Tiny signal so the loading screen can hold until the hero video is playable.
 * Module scope (not context) because the two components are siblings under
 * ClientShell and never re-render each other.
 */

let ready = false
const waiters = new Set<() => void>()

export function markHeroVideoReady() {
  if (ready) return
  ready = true
  waiters.forEach((f) => f())
  waiters.clear()
}

export function isHeroVideoReady() {
  return ready
}

/**
 * Resolves when the hero video can play, or after `timeoutMs` — whichever comes
 * first. The timeout matters: a slow network or a dead CDN must never be able
 * to trap the visitor behind the loading screen.
 */
export function waitForHeroVideo(timeoutMs: number): Promise<void> {
  if (ready) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer)
      waiters.delete(done)
      resolve()
    }
    const timer = setTimeout(done, timeoutMs)
    waiters.add(done)
  })
}
