import * as stylex from "@stylexjs/stylex"

export const visuallyHidden = stylex.create({
  base: {
    margin: "-1px",
    padding: 0,
    borderWidth: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    position: "absolute",
    whiteSpace: "nowrap",
    height: "1px",
    width: "1px",
  },
})
