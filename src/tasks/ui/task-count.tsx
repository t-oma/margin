import { Badge } from "@/components/badge"
import { VisuallyHidden } from "@/components/visually-hidden"

type TaskCountProps = { count: number }

export function TaskCount({ count }: TaskCountProps) {
  return (
    <Badge>
      {count}
      <VisuallyHidden> {count === 1 ? "task" : "tasks"}</VisuallyHidden>
    </Badge>
  )
}
