---
name: Midnight Tech
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4fdbc8'
  on-tertiary: '#003731'
  tertiary-container: '#00a392'
  on-tertiary-container: '#00302a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is engineered for a premium tech recruitment experience, blending **Modern Corporate** reliability with **Glassmorphism** and **Vaporwave-inspired accents**. The personality is sophisticated, high-velocity, and elite, aimed at senior developers and innovative tech firms.

The visual language utilizes deep layering and luminous accents to create a sense of digital "atmosphere." High-contrast typography ensures readability against dark backgrounds, while subtle glowing borders and backdrop blurs provide a sense of depth and tactile quality found in high-end developer tools.

## Colors

The palette is anchored in **Deep Charcoal** and **Midnight Blue** to provide a restful yet professional dark environment. 

- **Primary (Electric Blue):** Used for main CTAs, progress indicators, and active selection states.
- **Secondary (Vibrant Purple):** Used for "Featured" tags, AI-matching indicators, and premium job badges.
- **Tertiary (Bright Teal):** Used for success states, salary ranges, and "Open to Work" indicators.
- **Surface Strategy:** Cards and modals use a lighter gray with 60-80% opacity to allow for frosted glass effects (backdrop-blur).

## Typography

This design system uses a dual-font strategy: **Outfit** for headlines to provide a modern, geometric character, and **Inter** for body text and interface labels to ensure maximum legibility and a systematic, technical feel.

- **Headlines:** Use tight letter-spacing and bold weights to command attention on job titles and company names.
- **Body:** Maintains generous line-height for long job descriptions to prevent eye fatigue in dark mode.
- **Labels:** Uppercase styling is recommended for secondary metadata (e.g., "LOCATION", "POSTED DATE") to create a structured hierarchy.

## Layout & Spacing

The system follows a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile. 

- **Grid:** Use a 24px gutter to maintain a sense of openness and airiness between job listings.
- **Rhythm:** Spacing follows an 8px base unit. Component internal padding should default to 16px (2 units) or 24px (3 units) for larger cards.
- **Adaptive Strategy:** On desktop, use a sidebar-main layout (3:9 ratio) for filtering. On mobile, filters collapse into a bottom-sheet modal to maintain focus on the job feed.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Glassmorphism**. 

- **Surface Levels:** 
  - Level 0: Background (#121212).
  - Level 1: Sidebar/Nav (#1A1C23).
  - Level 2: Cards (#242731).
- **Glass Effect:** Elevated elements (modals, dropdowns) must use `backdrop-filter: blur(12px)` with a 1px border at 10% white opacity.
- **Glows:** Primary buttons and active cards utilize a subtle outer glow (box-shadow) using the primary color at 20% opacity to simulate light emission.

## Shapes

The design system employs **Rounded** geometry to soften the technical aesthetic and make the platform feel more approachable.

- **Buttons & Inputs:** Use the standard 0.5rem (8px) radius.
- **Cards:** Use `rounded-lg` (16px) to create distinct visual containers.
- **Status Pills:** Use `rounded-full` (pill-shaped) to differentiate tags from actionable buttons.

## Components

- **Buttons:** Primary buttons use a solid gradient (Blue to Purple) with a subtle "inner-glow" top border. Secondary buttons use a ghost style with a 1px colored border.
- **Job Cards:** Feature a 1px border (#FFFFFF10) that brightens to the primary color on hover. The background should slightly transition to a more opaque state on interaction.
- **Input Fields:** Deep backgrounds (#121212) with a focus state that triggers a subtle teal glow. 
- **Loading Skeletons:** Use a shimmer animation moving from #242731 to #2D313C.
- **Progress Bars:** For application tracking, use "Neon" styling—thin, high-saturation lines with a blurred shadow underneath to mimic a light tube.
- **Chips/Badges:** Small, semi-transparent backgrounds with high-contrast text for tech stack keywords (e.g., "React", "Rust").