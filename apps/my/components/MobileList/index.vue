<script lang="jsx">
export default defineComponent({
  name: 'MobileList',
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tagTpl: {
      type: Object,
      default: () => ({})
    },
    listTpl: {
      type: Array,
      default: () => []
    },
  },
  setup(props, { attrs, emit  }){
    const renderValue = (row, node) => {
      const v = row[node.props.prop]
      if (typeof(node.props.formatter) === 'function') {
        return node.props.formatter(row, node.props, v)
      }
      return v
    }

    const emptyText = ref('')
    watch(
      () => props.data,
      (value) => {
        emptyText.value = props.data.length > 0 ? '' : '暂无数据'
      }
    )
    return () => <div class="row-m-list">
      {!props.data.length
      ? <div class="empty">{emptyText.value}</div>
      : props.data.map((row, i) => (
        <div key={i} class="row" onClick={() => emit('cardClick', row)}>
          {props.tagTpl.node && <div class="state">
            { props.tagTpl.node.children ? props.tagTpl.node.children.default({row}) : renderValue(row, props.tagTpl.node) }
          </div>}
          {props.listTpl.map(({ label, node }, j) => (
            <div key={i+'_'+j} class="row-item">
              <div class="label">{label}</div>
              <div class="value">
                {node.children ? node.children.default({row}) : renderValue(row, node)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  }
})
</script>

<style lang="scss" scoped>
@import url('./style.scss')
</style>
