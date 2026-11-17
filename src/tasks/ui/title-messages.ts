import type { TitleError } from "../model"

export function titleErrorMessage(error: TitleError) {
  switch (error.error) {
    case "empty":
      return "Type a task title — it can’t be empty or only spaces."
    case "long":
      return `Shorten the title by ${error.over} ${error.over === 1 ? "character" : "characters"} — the limit is 200.`
  }
}
