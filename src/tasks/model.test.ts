import { describe, expect, it, test } from "vitest"

import {
  completeTask,
  createTask,
  doneTasks,
  renameTask,
  reopenTask,
  TASK_MAX_TITLE_LENGTH,
  todoTasks,
  validateTitle,
} from "./model"

const createdAt = "2026-11-14T10:00:00.000Z"
const updatedAt = "2026-11-14T14:00:00.000Z"
const completedAt = "2026-11-14T16:00:00.000Z"

const newTask = () => createTask("a", "Pay the electricity bill", createdAt)
const at = (minute: number) =>
  `2026-11-14T10:${String(minute).padStart(2, "0")}:00.000Z`
const ids = (tasks: { id: string }[]) => tasks.map((task) => task.id)

test("a new task is open and has no completion time", () => {
  expect(newTask()).toEqual({
    id: "a",
    title: "Pay the electricity bill",
    done: false,
    createdAt,
    updatedAt: createdAt,
    completedAt: null,
  })
})

test("completing a task records the completion time and nothing else", () => {
  const task = newTask()
  expect(completeTask(task, completedAt)).toEqual({
    ...task,
    done: true,
    completedAt,
  })
})

test("reopening a completed task restores it", () => {
  const task = newTask()
  expect(reopenTask(completeTask(task, completedAt))).toEqual(task)
})

test("renaming a task records updatedAt and sets a new title", () => {
  const task = newTask()

  expect(renameTask(task, "New Title", updatedAt)).toEqual({
    ...task,
    title: "New Title",
    updatedAt,
  })

  expect(
    renameTask(completeTask(task, completedAt), "New Title", updatedAt)
  ).toEqual({
    ...task,
    title: "New Title",
    updatedAt,
    done: true,
    completedAt,
  })
})

describe("validateTitle", () => {
  it("trims left and right whitespaces", () => {
    expect(validateTitle("  trim  ")).toEqual({ ok: true, title: "trim" })
  })

  it("replaces each line break with its own space and keeps inner spaces", () => {
    expect(validateTitle("Pay\r\nthe\n\nbill  now")).toEqual({
      ok: true,
      title: "Pay the  bill  now",
    })
  })

  it("counts code points toward the max length", () => {
    expect(validateTitle("👍".repeat(TASK_MAX_TITLE_LENGTH))).toEqual({
      ok: true,
      title: "👍".repeat(TASK_MAX_TITLE_LENGTH),
    })

    expect(validateTitle("👍".repeat(TASK_MAX_TITLE_LENGTH + 1))).toEqual({
      ok: false,
      error: "long",
      over: 1,
    })

    expect(validateTitle("a".repeat(TASK_MAX_TITLE_LENGTH + 1))).toEqual({
      ok: false,
      error: "long",
      over: 1,
    })
  })

  it.each(["", "   ", "\r\n"])("rejects %j as empty", (raw) => {
    expect(validateTitle(raw)).toEqual({ ok: false, error: "empty" })
  })
})

test("To do lists the newest task first", () => {
  const older = createTask("older", "Older", at(0))
  const newer = createTask("newer", "Newer", at(1))

  expect(ids(todoTasks([older, newer]))).toEqual(["newer", "older"])
})

test("Done lists the most recently completed task first", () => {
  // Created first but completed last, so it goes on top.
  const a = completeTask(createTask("a", "A", at(0)), at(5))
  const b = completeTask(createTask("b", "B", at(1)), at(3))

  expect(ids(doneTasks([b, a]))).toEqual(["a", "b"])
})

test("a reopened task returns to its place in To do", () => {
  const older = createTask("older", "Older", at(0))
  const middle = createTask("middle", "Middle", at(1))
  const newer = createTask("newer", "Newer", at(2))
  const reopened = reopenTask(completeTask(middle, at(3)))

  expect(ids(todoTasks([older, newer, reopened]))).toEqual([
    "newer",
    "middle",
    "older",
  ])
})

test("each list holds only its own tasks", () => {
  const open = createTask("open", "Open", at(0))
  const done = completeTask(createTask("done", "Done", at(1)), at(2))

  expect(ids(todoTasks([open, done]))).toEqual(["open"])
  expect(ids(doneTasks([open, done]))).toEqual(["done"])
})
