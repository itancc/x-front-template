/// <reference types="vue/jsx" />
import { defineComponent } from 'vue'

import {
  ACCENT_COLORS,
  type ColorMode,
  type CornerRadius,
  type FontFamily,
  type ThemeBase,
  useUiStore,
} from '../../../stores/ui'

interface RadioOption<T> {
  label: string
  value: T
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--app-text-main)' }}>
        {title}
      </p>
      <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--app-text-muted)' }}>
        {desc}
      </p>
    </div>
  )
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: RadioOption<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--app-text-main)',
          }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border:
                value === opt.value
                  ? '5px solid var(--app-accent-strong)'
                  : '2px solid var(--app-border)',
              background: 'var(--app-surface)',
              flexShrink: 0,
              transition: 'border .15s',
              cursor: 'pointer',
            }}
            onClick={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

const COLOR_MODES: RadioOption<ColorMode>[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const FONT_FAMILIES: RadioOption<FontFamily>[] = [
  { label: 'Sans-serif', value: 'sans' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'mono' },
  { label: 'Comic', value: 'comic' },
]

const THEME_BASES: RadioOption<ThemeBase>[] = [
  { label: 'Slate', value: 'slate' },
  { label: 'Gray', value: 'gray' },
  { label: 'Zinc', value: 'zinc' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Stone', value: 'stone' },
]

const CORNER_RADII: RadioOption<CornerRadius>[] = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
]

export default defineComponent({
  name: 'ThemeDrawer',
  setup() {
    const uiStore = useUiStore()

    return () => {
      if (!uiStore.themeDrawerVisible) return null

      return (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(0,0,0,.24)',
            }}
            onClick={() => (uiStore.themeDrawerVisible = false)}
          />

          {/* Drawer */}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              width: '340px',
              overflowY: 'auto',
              background: 'var(--app-surface)',
              borderLeft: '1px solid var(--app-border)',
              boxShadow: '-20px 0 60px rgba(0,0,0,.12)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--app-text-main)',
                }}
              >
                Theme Settings
              </h2>
              <button
                type="button"
                class="icon-btn"
                onClick={() => (uiStore.themeDrawerVisible = false)}
              >
                ✕
              </button>
            </div>

            <hr style={{ margin: 0, border: 'none', borderTop: '1px solid var(--app-border)' }} />

            {/* Color mode */}
            <div>
              <SectionTitle
                title="Color mode"
                desc="Choose the color mode for your app."
              />
              <RadioGroup
                options={COLOR_MODES}
                value={uiStore.colorMode}
                onChange={(v) => uiStore.setColorMode(v)}
              />
            </div>

            {/* Color scheme */}
            <div>
              <SectionTitle
                title="Color scheme"
                desc="The perfect color mode for your app."
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: color,
                      border:
                        uiStore.accentColor === color
                          ? '3px solid var(--app-text-main)'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      transition: 'transform .15s',
                      transform: uiStore.accentColor === color ? 'scale(1.12)' : 'scale(1)',
                    }}
                    onClick={() => uiStore.setAccentColor(color)}
                  >
                    {uiStore.accentColor === color ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div>
              <SectionTitle
                title="Font family"
                desc="Choose the font family that fits your app."
              />
              <RadioGroup
                options={FONT_FAMILIES}
                value={uiStore.fontFamily}
                onChange={(v) => uiStore.setFontFamily(v)}
              />
            </div>

            {/* Theme base */}
            <div>
              <SectionTitle
                title="Theme base"
                desc="Choose the gray shade for your app."
              />
              <RadioGroup
                options={THEME_BASES}
                value={uiStore.themeBase}
                onChange={(v) => uiStore.setThemeBase(v)}
              />
            </div>

            {/* Corner Radius */}
            <div>
              <SectionTitle
                title="Corner Radius"
                desc="Choose the border radius factor for your app."
              />
              <RadioGroup
                options={CORNER_RADII}
                value={uiStore.cornerRadius}
                onChange={(v) => uiStore.setCornerRadius(v)}
              />
            </div>
          </aside>
        </>
      )
    }
  },
})
