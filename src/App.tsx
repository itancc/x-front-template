import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'XApp',
  setup() {
    return () => (
      <ElConfigProvider size="default">
        <RouterView />
      </ElConfigProvider>
    )
  },
})
