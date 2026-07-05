import { defineComponent } from 'vue'
import { ElButton, ElEmpty, ElResult, ElSkeleton } from 'element-plus'

export const AppSkeletonCard = defineComponent({
  name: 'XStateSkeletonCard',
  props: {
    rows: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    return () => (
      <div class="x-state-card">
        <ElSkeleton animated rows={props.rows} />
      </div>
    )
  },
})

export const AppEmptyState = defineComponent({
  name: 'XStateEmpty',
  props: {
    title: {
      type: String,
      default: '暂无数据',
    },
    description: {
      type: String,
      default: '请稍后再试',
    },
    actionText: {
      type: String,
      default: '',
    },
  },
  emits: ['action'],
  setup(props, { emit }) {
    return () => (
      <div class="x-state-card">
        <ElEmpty
          description={props.description}
          v-slots={{
            description: () => (
              <div>
                <strong>{props.title}</strong>
                <p>{props.description}</p>
              </div>
            ),
            default: () =>
              props.actionText ? (
                <ElButton type="primary" onClick={() => emit('action')}>
                  {props.actionText}
                </ElButton>
              ) : null,
          }}
        />
      </div>
    )
  },
})

export const AppErrorState = defineComponent({
  name: 'XStateError',
  props: {
    message: {
      type: String,
      default: '加载失败',
    },
  },
  emits: ['retry'],
  setup(props, { emit }) {
    return () => (
      <div class="x-state-card">
        <ElResult
          title="请求失败"
          subTitle={props.message}
          icon="error"
          v-slots={{
            extra: () => (
              <ElButton type="primary" onClick={() => emit('retry')}>
                重试
              </ElButton>
            ),
          }}
        />
      </div>
    )
  },
})
