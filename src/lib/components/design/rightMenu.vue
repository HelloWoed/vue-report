<template>
    <div class="rightMenu">
        <ul class="menu" @click="menuBoxClick($event)">
            <li class="menu-item" :class="{disable:disableMergeCell}" @click="mergeCell">合并单元格</li>
            <li class="menu-item" :class="{disable:disableSplitCell}" @click="splitCell">拆分单元格</li>
            <li class="menu-item" @click="delRow($event)">删除行</li>
            <li class="menu-item" @click="delCol($event)">删除列</li>
            <li class="menu-item" @click="insertRow($event)">
                <span name="insert">插入</span>
                <el-input-number v-model="insertRowNum" size="mini" controls-position="right" :min="1" :max="10"></el-input-number>
                <span name="insert">行</span>
            </li>
            <li class="menu-item" @click="insertCol($event)">
                <span name="insert">插入</span>
                <el-input-number v-model="insertColNum" size="mini" controls-position="right" :min="1" :max="10"></el-input-number>
                <span name="insert">列</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'excel-right-menu',
    data(){
        return {
            activeIndex:'1',
            insertRowNum:0,
            insertColNum:0
        }
    },
    computed:{
        disableMergeCell(){
            if(this.$parent.borderConf.startTarget == this.$parent.borderConf.endTarget){
                return true;
            }
            else {
                return false;
            }
        },
        disableSplitCell(){
            if(this.$parent.borderConf.startTarget != this.$parent.borderConf.endTarget){
                return true;
            }else{
                if(this.$parent.borderConf.rowSpan ==1 && this.$parent.borderConf.colSpan ==1){
                    return true;
                }else{
                    return false;
                }
            }
        },
        borderConf(){
            return this.$parent.borderConf;
        }
    },
    mounted(){
        
    },
    methods:{
        insertRow(e){
            if(e.target.getAttribute('name') == 'insert'){
                this.$emit('insertRow',this.insertRowNum);
            }
            
        },
        delRow(e){
            this.$emit('deleteRow');
        },
        delCol(e){
            this.$emit('deleteCol');
        },
        insertCol(e){
            if(e.target.getAttribute('name') == 'insert'){
                this.$emit('insertCol',this.insertColNum);
            }
        },
        menuBoxClick(){
            // this.$parent.$emit('hideMenuBox');
        },
        mergeCell(){
            this.$parent.$emit('cellMerge');
            this.$parent.$emit('hideMenuBox');
        },
        splitCell(){
            this.$parent.$emit('cellSplit');
            this.$parent.$emit('hideMenuBox');
        }
    },
    destroyed(){
        this.$off('insertRow');
        this.$off('deleteRow');
        this.$off('insertCol');
        this.$off('deleteCol');
        this.$off('cellMerge');
        this.$off('cellSplit');
        this.$off('hideMenuBox');
    }
}
</script>
<style lang="less" scoped>
    ul{
        border:1px solid #aaa;
        padding:0;
        margin:0;
        background: #fff;
        text-align: left;
        li{
            padding:5px 10px;
            list-style: none;
            cursor: pointer;
            &:hover{
                background: #909399;
            }
        }
        li.disable{
            background-color: #F5F5F5;   
            color:#ACA899;
            cursor: not-allowed;
        }
    }
</style>

