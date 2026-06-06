/// <reference types="vue/jsx" />

import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import { init, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import './x-chart.css'

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer,
])

export default defineComponent({
  name: 'XChart',
  props: {
    option: {
      type: Object as () => EChartsOption,
      required: true,
    },
    height: {
      type: String,
      default: '320px',
    },
    width: {
      type: String,
      default: '100%',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: undefined,
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    notMerge: {
      type: Boolean,
      default: false,
    },
    replaceMerge: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  setup(props, { expose }) {
    const chartRef = ref<HTMLDivElement>()
    let chartInstance: EChartsType | null = null
    let resizeObserver: ResizeObserver | null = null

    function applyOption() {
      if (!chartInstance) {
        return
      }

      chartInstance.setOption(props.option, {
        notMerge: props.notMerge,
        replaceMerge: props.replaceMerge,
        lazyUpdate: true,
      })
    }

    function applyLoading() {
      if (!chartInstance) {
        return
      }

      if (props.loading) {
        chartInstance.showLoading('default', { text: '图表加载中...' })
        return
      }

      chartInstance.hideLoading()
    }

    function initChart() {
      if (!chartRef.value || chartInstance) {
        return
      }

      chartInstance = init(chartRef.value, props.theme)
      applyOption()
      applyLoading()

      if (props.autoResize && typeof window !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          chartInstance?.resize()
        })
        resizeObserver.observe(chartRef.value)
      }
    }

    function resize() {
      chartInstance?.resize()
    }

    function dispose() {
      resizeObserver?.disconnect()
      resizeObserver = null

      chartInstance?.dispose()
      chartInstance = null
    }

    watch(
      () => props.option,
      () => {
        applyOption()
      },
      { deep: true },
    )

    watch(
      () => props.loading,
      () => {
        applyLoading()
      },
    )

    onMounted(() => {
      initChart()
    })

    onBeforeUnmount(() => {
      dispose()
    })

    expose({
      getInstance: () => chartInstance,
      resize,
    })

    return () => <div ref={chartRef} class="x-chart" style={{ height: props.height, width: props.width }} />
  },
})
