import * as stylex from "@stylexjs/stylex"

const styles = stylex.create({
  header: {
    backgroundColor: "#000",
    color: "#fff",
  },
})

function App() {
  return <header {...stylex.props(styles.header)}>Home</header>
}

export default App
