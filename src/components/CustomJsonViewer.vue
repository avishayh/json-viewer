<template>
  <div class="json-viewer" ref="jsonViewerRef">
    <div ref="jsonContainer" class="json-container">
      <vue-json-pretty
        :data="data"
        :deep="999"
        :show-double-quotes="true"
        :show-length="true"
        :collapsed-strings-length="50"
        :collapsed-on-click-brackets="true"
        :show-collapsed-on-click-brackets="true"
        :show-line="true"
        :show-icon="true"
        :path-selectable="true"
        @rendered="handleRendered"
        @node-click="handleNodeClick"
      />
    </div>
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <div class="tooltip-content">
        <div class="tooltip-header">Original Value:</div>
        <pre>{{ tooltipContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

type JsonValue = string | number | boolean | null | Record<string, any> | any[]

export default defineComponent({
  name: 'CustomJsonViewer',
  components: {
    VueJsonPretty
  },
  props: {
    data: {
      type: Object as PropType<JsonValue>,
      required: true
    },
    getOriginalValue: {
      type: Function as PropType<(obj: object) => string | undefined>,
      required: true
    },
    highlightPath: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const jsonContainer = ref<HTMLElement | null>(null)
    const tooltipVisible = ref(false)
    const tooltipContent = ref('')
    const tooltipStyle = ref({
      top: '0px',
      left: '0px'
    })
    const jsonViewerRef = ref<HTMLElement | null>(null)

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.classList.contains('transformed-icon')) {
        const treeNode = target.closest('.vjs-tree')
        if (treeNode) {
          const dataValue = treeNode.getAttribute('data-value')
          if (dataValue) {
            try {
              const value = JSON.parse(dataValue)
              if (value && typeof value === 'object') {
                const originalValue = props.getOriginalValue(value)
                if (originalValue) {
                  tooltipContent.value = originalValue
                  tooltipStyle.value = {
                    top: `${event.clientY + 10}px`,
                    left: `${event.clientX + 10}px`
                  }
                  tooltipVisible.value = true
                }
              }
            } catch (e) {
              // Not a JSON value, ignore
            }
          }
        }
      } else {
        tooltipVisible.value = false
      }
    }

    const addIconsToTransformedFields = () => {
      if (!jsonContainer.value) return

      const treeNodes = jsonContainer.value.querySelectorAll('.vjs-tree')
      treeNodes.forEach((node) => {
        const dataValue = node.getAttribute('data-value')
        if (dataValue) {
          try {
            const value = JSON.parse(dataValue)
            if (value && typeof value === 'object') {
              const originalValue = props.getOriginalValue(value)
              if (originalValue) {
                const keyNode = node.querySelector('.vjs-key')
                if (keyNode && !keyNode.querySelector('.transformed-icon')) {
                  const icon = document.createElement('span')
                  icon.className = 'transformed-icon'
                  icon.innerHTML = '🔄'
                  icon.title = 'Click to see original value'
                  keyNode.appendChild(icon)
                }
              }
            }
          } catch (e) {
            // Not a JSON value, ignore
          }
        }
      })
    }

    const handleRendered = () => {
      // Wait for the next tick to ensure the DOM is updated
      setTimeout(addIconsToTransformedFields, 0)
    }

    // Watch for data changes to update icons
    watch(() => props.data, () => {
      setTimeout(addIconsToTransformedFields, 0)
    })

    // Watch for changes in highlightPath
    watch(() => props.highlightPath, (newPath) => {
      if (newPath && jsonContainer.value) {
        // Wait for the next tick to ensure the DOM is updated
        nextTick(() => {
          const element = jsonContainer.value.querySelector(`[data-path="${newPath}"]`);
          if (element) {
            // Add highlight class
            element.classList.add('highlighted-field');
            
            // Scroll into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after animation
            setTimeout(() => {
              element.classList.remove('highlighted-field');
            }, 2000);
          }
        });
      }
    });

    const handleNodeClick = (node: any) => {
      // Implement the logic to handle node click
    }

    onMounted(() => {
      if (jsonContainer.value) {
        jsonContainer.value.addEventListener('click', handleClick)
        // Initial icon addition
        setTimeout(addIconsToTransformedFields, 0)
      }
    })

    onBeforeUnmount(() => {
      if (jsonContainer.value) {
        jsonContainer.value.removeEventListener('click', handleClick)
      }
    })

    return {
      jsonContainer,
      tooltipVisible,
      tooltipContent,
      tooltipStyle,
      handleRendered,
      jsonViewerRef,
      handleNodeClick
    }
  }
})
</script>

<style scoped>
.json-viewer {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  background-color: var(--surface-color);
  overflow-y: auto;
  height: calc(100vh - 300px);
}

:deep(.vjs-tree) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
}

:deep(.vjs-key) {
  color: var(--primary-color);
}

:deep(.vjs-value) {
  color: var(--text-primary);
}

:deep(.vjs-value.vjs-value-string) {
  color: #a6e22e;
}

:deep(.vjs-value.vjs-value-number) {
  color: #ae81ff;
}

:deep(.vjs-value.vjs-value-boolean) {
  color: #f92672;
}

:deep(.vjs-value.vjs-value-null) {
  color: #f92672;
}

:deep(.vjs-line) {
  color: var(--text-secondary);
}

:deep(.vjs-icon) {
  color: var(--text-secondary);
}

:deep(.highlighted-field) {
  background-color: rgba(255, 255, 0, 0.2);
  transition: background-color 0.3s ease;
}

:deep(.vjs-tree-node) {
  position: relative;
}

:deep(.vjs-tree-node[data-path]) {
  cursor: pointer;
}

.tooltip {
  position: fixed;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.875rem;
  max-width: 400px;
  word-break: break-all;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}
</style> 