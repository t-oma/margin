import "@fontsource-variable/inter"
import "../src/app/index.css"

import type { Preview } from "@storybook/react-vite"
import * as stylex from "@stylexjs/stylex"

import { colors, typography } from "../src/tokens.stylex"

const styles = stylex.create({
  root: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.lineHeightMd,
  },
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.root)}>
        <Story />
      </div>
    ),
  ],
}

export default preview
