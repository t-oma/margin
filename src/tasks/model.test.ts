import { expect, test } from "vitest"

import { completeTask, createTask, reopenTask } from "./model"

const createdAt = "2026-11-14T10:00:00.000Z"
const completedAt = "2026-11-14T16:00:00.000Z"

const newTask = () => createTask("a", "Pay the electricity bill", createdAt)

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
