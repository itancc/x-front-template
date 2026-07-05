import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { ElSkeleton } from 'element-plus'

export default defineComponent({
  name: 'XChart',
  props: {
    option: {
      type: Object as PropType<EChartsOption>,
      required: true,
    },
    height: {
      type: String,
      default: '280px',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement | null>(null)
    let chart: echarts.ECharts | null = null

    function updateChart() {
      if (!chart) {
        return
      }
      chart.setOption(props.option, true)
    }

    function initChart() {
       if (!chartRef.value) {
         return
       }
       chart = echarts.init(chartRef.value)
      updateChart()
     }
 
     onMounted(() => {
       initChart()
      window.addEventListener('resize', handleResize)
     })
 
     onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
       chart?.dispose()
       chart = null
     })

    function handleResize() {
      chart?.resize()
    }
 
     watch(
       () => props.option,
       () => {
        updateChart()
       },
       { deep: true },
     )
 
     return () => (
       <div class="x-chart" style={{ height: props.height }}>
         {props.loading ? <ElSkeleton animated rows={6} /> : <div ref={chartRef} class="x-chart__canvas" style={{ height: props.height }} />}
       </div>
     )
   },
 })
