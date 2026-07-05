import { defineComponent, ref } from 'vue'
import { ElDrawer, ElRadio, ElRadioGroup } from 'element-plus'
import { useUiStore, type ColorScheme, type FontFamilyMode, type ThemeBase, type RadiusMode } from '@/stores/ui'
import './HeaderBar.scss'

const colorSchemes: ColorScheme[] = ['blue', 'sky', 'indigo', 'violet', 'rose', 'red', 'orange', 'amber', 'lime', 'green', 'emerald', 'cyan']
const fontFamilies: FontFamilyMode[] = ['sans-serif', 'serif', 'monospace', 'comic']
const themeBases: ThemeBase[] = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const radiusModes: RadiusMode[] = ['sharp', 'soft', 'pill']

export default defineComponent({
  name: 'HeaderBar',
  setup() {
    const uiStore = useUiStore()
    const drawerVisible = ref(false)

    return () => (
      <header class="crm-header">
        {/* Breadcrumb */}
        <nav class="crm-header__crumb">
          <span class="crm-header__crumb-seg">E-commerce</span>
          <span class="crm-header__crumb-sep">/</span>
          <span class="crm-header__crumb-seg">Customers</span>
          <span class="crm-header__crumb-sep">/</span>
          <span class="crm-header__crumb-active">Default View</span>
        </nav>

        {/* Actions */}
        <div class="crm-header__actions">
          <button
            type="button"
            class="crm-header__icon-btn"
            title="Toggle dark mode"
            onClick={() => uiStore.toggleTheme()}
          >
            {uiStore.colorMode === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button
            type="button"
            class="crm-header__icon-btn"
            title="Theme settings"
            onClick={() => (drawerVisible.value = true)}
          >
            Settings
          </button>

          <div class="crm-header__segment">
            <button type="button" class="crm-header__seg-btn is-active">
              Data
            </button>
            <button type="button" class="crm-header__seg-btn">
              Details
            </button>
          </div>

          <button type="button" class="crm-header__share">
            Share
          </button>
        </div>

        {/* Theme drawer */}
        <ElDrawer
          modelValue={drawerVisible.value}
          onUpdate:modelValue={(v: boolean) => (drawerVisible.value = v)}
          title="Theme Settings"
          size="360px"
          appendToBody
        >
          <div class="crm-theme-drawer">
            <div class="crm-theme-drawer__group">
              <h4>Color mode</h4>
              <p>Switch between light and dark interface.</p>
              <ElRadioGroup
                modelValue={uiStore.colorMode}
                onUpdate:modelValue={(v: unknown) => uiStore.setColorMode(v as 'light' | 'dark')}
              >
                <ElRadio value="light">Light</ElRadio>
                <ElRadio value="dark">Dark</ElRadio>
              </ElRadioGroup>
            </div>

            <div class="crm-theme-drawer__group">
              <h4>Color scheme</h4>
              <p>Pick the accent color for your workspace.</p>
              <div class="crm-theme-swatches">
                {colorSchemes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    class={['crm-theme-swatch', `is-${s}`, uiStore.colorScheme === s && 'is-active']}
                    onClick={() => uiStore.setColorScheme(s)}
                  />
                ))}
              </div>
            </div>

            <div class="crm-theme-drawer__group">
              <h4>Font family</h4>
              <ElRadioGroup
                modelValue={uiStore.fontFamily}
                onUpdate:modelValue={(v: unknown) => uiStore.setFontFamily(v as FontFamilyMode)}
              >
                {fontFamilies.map((f) => (
                  <ElRadio key={f} value={f}>{f}</ElRadio>
                ))}
              </ElRadioGroup>
            </div>

            <div class="crm-theme-drawer__group">
              <h4>Theme base</h4>
              <ElRadioGroup
                modelValue={uiStore.themeBase}
                onUpdate:modelValue={(v: unknown) => uiStore.setThemeBase(v as ThemeBase)}
              >
                {themeBases.map((b) => (
                  <ElRadio key={b} value={b}>{b}</ElRadio>
                ))}
              </ElRadioGroup>
            </div>

            <div class="crm-theme-drawer__group">
              <h4>Corner radius</h4>
              <ElRadioGroup
                modelValue={uiStore.radiusMode}
                onUpdate:modelValue={(v: unknown) => uiStore.setRadiusMode(v as RadiusMode)}
              >
                {radiusModes.map((r) => (
                  <ElRadio key={r} value={r}>{r}</ElRadio>
                ))}
              </ElRadioGroup>
            </div>
          </div>
        </ElDrawer>
      </header>
    )
  },
})
