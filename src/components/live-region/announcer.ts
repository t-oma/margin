type AnnouncerOptions = {
  // Time between clearing the region and writing the new message.
  delay?: number
}

export type Announcer = {
  getMessage: () => string
  subscribe: (listener: () => void) => () => void
  announce: (message: string) => void
}

export function createAnnouncer({ delay = 100 }: AnnouncerOptions = {}) {
  const listeners = new Set<() => void>()
  let message = ""
  let timer: ReturnType<typeof setTimeout> | undefined

  function set(next: string) {
    if (next === message) return
    message = next
    listeners.forEach((listener) => listener())
  }

  const announcer: Announcer = {
    getMessage: () => message,

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    // A screen reader skips a message equal to the one already in the
    // region, so the region is emptied first and filled a moment later.
    announce(next) {
      clearTimeout(timer)
      set("")
      timer = setTimeout(() => {
        set(next)
      }, delay)
    },
  }

  return announcer
}

// One region for the whole app, as the spec asks.
export const announcer = createAnnouncer()
export const announce = announcer.announce
