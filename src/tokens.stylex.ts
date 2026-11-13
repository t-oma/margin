import * as stylex from "@stylexjs/stylex"

// Values from docs/margin-v1-2.html.
export const colors = stylex.defineVars({
  // Surfaces
  background: "#F6F7F9",
  surface: "#FFFFFF",
  subtle: "#FAFBFC",
  // Subdued surfaces for control states.
  surfaceMuted: "#EEF0F3",
  disabled: "#E4E7EC",
  badge: "#E9EBF0",

  // Text
  // Main content, headings, and labels.
  textPrimary: "#15171C",
  // Descriptions, hints, and metadata.
  textMuted: "#5E6573",
  // Disabled controls can change independently of muted text.
  textDisabled: "#5E6573",
  // Text on dark or saturated backgrounds.
  textInverse: "#FFFFFF",

  // Borders
  border: "#DCDFE5",
  borderControl: "#8A91A0",
  borderControlHover: "#454B57",
  borderRow: "#ECEEF1",
  borderDisabled: "#C9CED7",
  marginRule: "#B8C3EE",

  // Accent and task states
  accent: "#2F54D4",
  accentHover: "#2443B0",
  accentPressed: "#1E3A9E",
  accentTint: "#EBF0FD",
  editing: "#F7F9FF",

  // Errors and storage warnings
  danger: "#B42318",
  dangerHover: "#912018",
  dangerTint: "#FDECEA",
  warningBackground: "#FFF6E0",
  warningBorder: "#E2A93B",
  warningForeground: "#5C3D00",

  // Toast and dialog
  toastBackground: "#15171C",
  toastActionHover: "rgba(255, 255, 255, 0.14)",
  scrim: "rgba(21, 23, 28, 0.5)",
} as const)

// Shared type scales. Rem values follow the root font size.
export const typography = stylex.defineVars({
  fontFamily:
    '"Inter Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',

  // 12, 14, 16, 20, 24, 28px at a 16px root font size.
  fontSizeXs: "0.75rem",
  fontSizeSm: "0.875rem",
  fontSizeMd: "1rem",
  fontSizeLg: "1.25rem",
  fontSizeXl: "1.5rem",
  fontSize2xl: "1.75rem",

  // 18, 20, 24, 28, 32, 36px, paired with the font-size scale.
  lineHeightXs: "1.125rem",
  lineHeightSm: "1.25rem",
  lineHeightMd: "1.5rem",
  lineHeightLg: "1.75rem",
  lineHeightXl: "2rem",
  lineHeight2xl: "2.25rem",

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  letterSpacingTighter: "-0.02em",
  letterSpacingTight: "-0.01em",
  letterSpacingNormal: "0em",
  letterSpacingWide: "0.06em",
} as const)

export const spacing = stylex.defineVars({
  space1: "4px",
  space2: "8px",
  space3: "12px",
  space4: "16px",
  space5: "20px",
  space6: "24px",
  space8: "32px",
  space10: "40px",
  space12: "48px",
} as const)

export const sizes = stylex.defineVars({
  touchTarget: "44px",
  rowMinHeight: "48px",
  checkbox: "22px",
  icon: "20px",
  iconInline: "16px",
  iconToast: "18px",

  marginWidth: "56px",
  marginWidthMobile: "52px",
  contentMaxWidth: "720px",
  headerHeight: "56px",
  dialogMaxWidth: "440px",
  toastMaxWidth: "560px",

  marginRuleWidth: "2px",
  focusRingWidth: "2px",
  focusRingOffset: "2px",
} as const)

export const radii = stylex.defineVars({
  sm: "6px",
  md: "8px",
  lg: "10px",
  xl: "12px",
  full: "999px",
} as const)

export const shadows = stylex.defineVars({
  toast: "0 8px 24px rgba(21, 23, 28, 0.24)",
  dialog: "0 16px 48px rgba(21, 23, 28, 0.28)",
} as const)

export const motion = stylex.defineVars({
  durationFast: "150ms",
  durationHighlight: "600ms",
  delayHighlight: "1600ms",
  easing: "ease-out",
} as const)

// Media queries must be compile-time constants, rather than CSS variables.
export const media = stylex.defineConsts({
  phone: "@media (width < 600px)",
  tablet: "@media (min-width: 600px)",
  desktop: "@media (min-width: 1024px)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
} as const)

export const zIndices = stylex.defineConsts({
  composer: "4",
  header: "6",
  toast: "15",
  dialog: "20",
} as const)
