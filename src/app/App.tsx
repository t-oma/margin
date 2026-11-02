import * as stylex from "@stylexjs/stylex"
import { Header } from "@/components/header"
import { typography } from "@/tokens.stylex"

const styles = stylex.create({
  root: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.lineHeightMd,
  },
})

function App() {
  return (
    <div {...stylex.props(styles.root)}>
      <Header />
    </div>
  )
}

export default App
