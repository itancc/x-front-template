import { defineComponent } from 'vue'
import { ElMessage, ElRadio, ElRadioGroup } from 'element-plus'

import { useUiStore, type ColorScheme, type FontFamilyMode, type ThemeBase, type RadiusMode } from '@/stores/ui'

const colorSchemes: ColorScheme[] = ['blue', 'sky', 'indigo', 'violet', 'rose', 'red', 'orange', 'amber', 'lime', 'green', 'emerald', 'cyan']
const themeBases: ThemeBase[] = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const fontFamilies: FontFamilyMode[] = ['sans-serif', 'serif', 'monospace', 'comic']
const radiusModes: RadiusMode[] = ['sharp', 'soft', 'pill']

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const uiStore = useUiStore()

    function saveSettings() {
      ElMessage.success('主题配置已保存')
    }

    return () => (
      <main class="x-settings-page">
        <section class="x-settings-card">
          <h2>Theme Settings</h2>

          <div class="x-settings-group">
            <h4>Color mode</h4>
            <ElRadioGroup modelValue={uiStore.colorMode} onUpdate:modelValue={(value) => uiStore.setColorMode(value as 'light' | 'dark')}>
              <ElRadio value="light">Light</ElRadio>
              <ElRadio value="dark">Dark</ElRadio>
            </ElRadioGroup>
          </div>

          <div class="x-settings-group">
            <h4>Color scheme</h4>
            <div class="x-theme-panel__swatch-grid">
              {colorSchemes.map((scheme) => (
                <button
                  type="button"
                  key={scheme}
                  class={['x-theme-panel__swatch', uiStore.colorScheme === scheme && 'is-active', `is-${scheme}`]}
                  onClick={() => uiStore.setColorScheme(scheme)}
                />
              ))}
            </div>
          </div>

          <div class="x-settings-group">
            <h4>Font family</h4>
            <ElRadioGroup modelValue={uiStore.fontFamily} onUpdate:modelValue={(value) => uiStore.setFontFamily(value as FontFamilyMode)}>
              {fontFamilies.map((item) => (
                <ElRadio key={item} value={item}>{item}</ElRadio>
              ))}
            </ElRadioGroup>
          </div>

          <div class="x-settings-group">
            <h4>Theme base</h4>
            <ElRadioGroup modelValue={uiStore.themeBase} onUpdate:modelValue={(value) => uiStore.setThemeBase(value as ThemeBase)}>
              {themeBases.map((item) => (
                <ElRadio key={item} value={item}>{item}</ElRadio>
              ))}
            </ElRadioGroup>
          </div>

          <div class="x-settings-group">
            <h4>Corner radius</h4>
            <ElRadioGroup modelValue={uiStore.radiusMode} onUpdate:modelValue={(value) => uiStore.setRadiusMode(value as RadiusMode)}>
              {radiusModes.map((item) => (
                <ElRadio key={item} value={item}>{item}</ElRadio>
              ))}
            </ElRadioGroup>
          </div>

          <button type="button" class="x-btn x-btn--primary" onClick={saveSettings}>保存设置</button>
        </section>
      </main>
    )
  },
})
