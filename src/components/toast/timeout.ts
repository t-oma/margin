export type PausableTimeout = ReturnType<typeof createPausableTimeout>

export function createPausableTimeout(callback: () => void, ms: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let startTime: number
  let remaining = ms

  function _start() {
    startTime = Date.now()

    timeout = setTimeout(() => {
      timeout = undefined
      remaining = 0
      callback()
    }, remaining)
  }

  function pause() {
    if (timeout === undefined) return

    clearTimeout(timeout)
    timeout = undefined

    remaining -= Date.now() - startTime
  }

  function resume() {
    if (timeout !== undefined || remaining <= 0) return

    _start()
  }

  function cancel() {
    clearTimeout(timeout)
    timeout = undefined
    remaining = 0
  }

  _start()

  return { pause, resume, cancel }
}
