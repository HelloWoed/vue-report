<template>
<div v-if="target">
  <div :class="[`ve-resizer`, vertical ? 'vertical' : 'horizontal']"
    :style="style"
    @mousedown.left="mousedownHandler($event)"
    ref="resizer"></div>
  <div :class="[`ve-resizer-line`, vertical ? 'vertical' : 'horizontal']"
    :style="lineStyle"
    ref="resizerLine" v-if="lineVisable"></div>
</div>
</template>
<script>
import {mouseMoveUp} from '../utils/event.js'
export default {
  name: 'excel-resizer',
  props: {
    target: { type: HTMLElement },
    vertical: { type: Boolean, default: false },
    index: { type: [String, Number] }
  },
  data () {
    return {
      startEvent: null,
      lineVisable: false,
      distance: 0,
      style: this.styleObject(this.target),
      lineStyle: this.lineStyleObject(this.target)
    }
  },
  watch: {
    target (nVal, oVal) {
      this.style = this.styleObject(nVal)
      this.lineStyle = this.lineStyleObject(nVal)
    }
  },
  methods: {
    mousedownHandler (evt) {
      this.startEvent = evt
      this.lineVisable = true
      mouseMoveUp(this.mousemoveHandler, this.mouseupHandler)
    },
    mousemoveHandler (evt) {
      const { startEvent, vertical, $refs } = this
      if (startEvent !== null && evt.buttons === 1) {
        if (vertical) {
          const d = evt.x - startEvent.x
          this.distance += d
          this.style.left = `${$refs.resizer.offsetLeft + d}px`
          this.lineStyle.left = `${$refs.resizerLine.offsetLeft + d}px`
        } else {
          const d = evt.y - startEvent.y
          this.distance += d
          this.style.top = `${$refs.resizer.offsetTop + d}px`
          this.lineStyle.top = `${$refs.resizerLine.offsetTop + d}px`
        }
        this.startEvent = evt
      }
    },
    mouseupHandler (evt) {
      if (this.startEvent !== null) {
        this.$emit('change', this.index, this.distance)
        this.startEvent = null
        this.lineVisable = false
        this.distance = 0
      }
    },
    styleObject (target) {
      const { vertical } = this
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = target
      return {
        left: `${vertical ? offsetLeft + offsetWidth - 5 : offsetLeft}px`,
        top: `${vertical ? offsetTop : offsetTop + offsetHeight - 5}px`,
        width: `${vertical ? 5 : offsetWidth}px`,
        height: `${vertical ? offsetHeight : 5}px`
      }
    },
    lineStyleObject (target) {
      const { vertical } = this
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth, parentNode } = target
      return {
        left: `${vertical ? offsetLeft + offsetWidth : offsetLeft}px`,
        top: `${vertical ? offsetTop : offsetTop + offsetHeight}px`,
        width: `${vertical ? 0 : parentNode.offsetWidth}px`,
        height: `${vertical ? this.$parent.$refs.body.offsetHeight + parentNode.offsetHeight : 0}px`
      }
    }
  },
  destroyed(){
    this.$off('change');
  }
}

</script>
<style lang="less" scoped>
    .ve-resizer {
        position: absolute;
        &.horizontal {
            cursor: row-resize;
        }
        &.vertical {
            cursor: col-resize;
        }
    }
    .ve-resizer-line {
        position: absolute;
        z-index: 100;
        &.horizontal {
            border-bottom: 2px dashed rgb(75, 137, 255);
        }
        &.vertical {
            border-right: 2px dashed rgb(75, 137, 255);
        }
    }
</style>
