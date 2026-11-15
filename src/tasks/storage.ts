import * as z from "zod/mini"

import type { Task } from "./model"

export const STORAGE_KEY = "margin.v1"

const timestamp = z.iso.datetime({ precision: 3 })

const taskBase = {
  id: z.string(),
  title: z.string(),
  createdAt: timestamp,
  updatedAt: timestamp,
}

// Annotated with the model's type, so the schema and Task cannot drift apart.
const taskSchema: z.ZodMiniType<Task> = z.discriminatedUnion("done", [
  z.object({ ...taskBase, done: z.literal(false), completedAt: z.null() }),
  z.object({ ...taskBase, done: z.literal(true), completedAt: timestamp }),
])

const storedStateSchema = z.object({
  version: z.literal(1),
  tasks: z.array(taskSchema),
  ui: z.object({ doneCollapsed: z.boolean() }),
})

export type StoredState = z.infer<typeof storedStateSchema>

export type LoadResult =
  | { ok: true; state: StoredState } // also the first run, when the key is missing
  | { ok: false; raw: string } // invalid JSON or wrong shape

const emptyState: StoredState = {
  version: 1,
  tasks: [],
  ui: { doneCollapsed: false },
}

export function parseStoredState(raw: string | null): LoadResult {
  if (raw === null) return { ok: true, state: emptyState }

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, raw }
  }

  const result = storedStateSchema.safeParse(json)
  return result.success ? { ok: true, state: result.data } : { ok: false, raw }
}
