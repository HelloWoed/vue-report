<template>
  <div class="cell-edit" v-if="activeCellEdit" :style="styles">
    <textarea 
      autofocus
      class="input-area"
      :value="textAreaVal"
      :style="textAreaStyle"
      @mousedown.stop="()=>{}"
      @input="updateValue($event.target.value)"></textarea>
  </div>
</template>
<script>
import {getAttrs} from '../utils/excel'
export default {
  name:'excel-edit',
  props:{
    target:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      styles:{},
      activeCellEdit:false,
      textAreaStyle:{},
      textAreaVal:''
    }
  },
  watch:{
    target:{
      handler(nVal,oVal){
        if(nVal.target)this.activeCellEdit = true;
        else this.activeCellEdit = false;
        this.setEditInfo();
      },deep:true
    }
  },
  mounted(){
    
  },
  methods:{
    updateValue(val){
      this.$emit('cellEditUpdate',{
        row:this.target.row,
        col:this.target.col,
        value:val
      });
    },
    setEditInfo(){
      if(!this.target.target)return {};
      let attr = getAttrs(this.target.target);
      this.styles =  {
        top:attr.top + 'px',
        left:attr.left + 'px',
        height:attr.height + 'px',
        width:attr.width + 'px',
      }
      let {tableData} = this.$parent;
      this.textAreaStyle = tableData[this.target.row][this.target.col].cell_style;
      this.textAreaVal = tableData[this.target.row][this.target.col].cell_value;
    }
  },
  destroyed(){
    this.$off('cellEditUpdate');
  }
}
</script>
<style lang="less" scoped>
  .cell-edit{
    position: absolute;
    .input-area{
      width: 100%;
      height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-family: inherit;
      font-size: inherit;
      padding: 4px 10px;
      float: left;
      resize: none;
      overflow-y: hidden;
      border: none;
      outline-width: 0;
    }
  }
</style>
