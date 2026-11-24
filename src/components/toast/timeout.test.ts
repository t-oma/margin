import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createPausableTimeout } from "./timeout"

describe("createPausableTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("calls the callback once, after the delay", () => {
    const callback = vi.fn()

    createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(999)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("does not call the callback while paused", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.pause()
    vi.advanceTimersByTime(5000)

    expect(callback).not.toHaveBeenCalled()
  })

  it("after a resume, waits only for the time that was left", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.pause()
    vi.advanceTimersByTime(5000)
    timeout.resume()

    // 1000 - 400 = 600 left
    vi.advanceTimersByTime(599)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("counts the time from the last resume when paused again", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.pause()
    vi.advanceTimersByTime(5000)
    timeout.resume()
    vi.advanceTimersByTime(200)
    timeout.pause()
    vi.advanceTimersByTime(5000)
    timeout.resume()

    // 1000 - 400 - 200 = 400 left
    vi.advanceTimersByTime(399)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("ignores a pause while already paused", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.pause()
    vi.advanceTimersByTime(300)
    timeout.pause()
    timeout.resume()

    // Still 600 left: the paused 300 ms are not taken off
    vi.advanceTimersByTime(599)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("ignores a resume while running", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.resume()

    vi.advanceTimersByTime(600)
    expect(callback).toHaveBeenCalledOnce()

    vi.advanceTimersByTime(5000)
    expect(callback).toHaveBeenCalledOnce()
  })

  it("never calls the callback after a cancel, even on resume", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(400)
    timeout.cancel()
    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()

    timeout.resume()
    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()
  })

  it("does not call the callback again on a pause and resume after it fired", () => {
    const callback = vi.fn()

    const timeout = createPausableTimeout(callback, 1000)
    vi.advanceTimersByTime(1000)
    timeout.pause()
    timeout.resume()
    vi.advanceTimersByTime(5000)

    expect(callback).toHaveBeenCalledOnce()
  })
})
