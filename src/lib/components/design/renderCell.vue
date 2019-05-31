<template>
    <span :class="{'td-cell': cindex !=0 }">
        <span :class="{'td-cell': cindex !=0 }" v-if="cellData.cell_render_type=='text'">
            {{cellData.cell_type == 'cell' ? cellData.cell_value : rindex}}
        </span>
        <span :class="{'td-cell': cindex !=0 }" v-else-if="cellData.cell_render_type=='radio'">
            <el-select v-model="cellData.cell_value" placeholder="请选择" size="mini">
                <el-option
                v-for="item in cellData.cell_options"
                :key="item.id"
                :label="item[cellProps.radio.label]"
                :value="item[cellProps.radio.value]">
                </el-option>
            </el-select>
        </span>
        <span :class="{'td-cell': cindex !=0 }" v-else-if="cellData.cell_render_type=='checkbox'">
            <el-select v-model="cellData.cell_value" multiple placeholder="请选择" size="mini">
                <el-option
                v-for="item in cellData.cell_options"
                :key="item.id"
                :label="item[cellProps.checkbox.label]"
                :value="item[cellProps.checkbox.value]">
                </el-option>
            </el-select>
        </span>
        <span :class="{'td-cell': cindex !=0 }" v-else-if="cellData.cell_render_type=='tree'">
            <el-popover
            popper-class="cell-tree-prop"
            placement="right"
            width="400"
            heigh="500"
            trigger="click">
                <div>
                    <el-tree
                    :ref="cellData.cell_id"
                    node-key="id"
                    :props="treeProps"
                    :load="treeLoadNode"
                    lazy
                    show-checkbox>
                    </el-tree>
                    <p style="textAlign:center">
                        <el-button size="mini" type="primary" @click="treeSelected(cellData.cell_id)">确定</el-button>
                        <el-button size="mini" @click="reset(cellData.cell_id)">清空</el-button>
                    </p>
                </div>
                
            <div slot="reference">
                <el-button size="mini">
                    {{cellData.cell_options.name}}
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <div>
                    {{cellData.cell_value}}
                </div>
            </div>
            
            </el-popover>
        </span>
        <span :class="{'td-cell': cindex !=0 }" v-else-if="cellData.cell_render_type=='fixed'">
            <template v-if="!cellData.cell_value">
                <span class="fixed-cell">固定值单元格不可为空</span>
            </template>
            <template v-else>
                {{cellData.cell_type == 'cell' ? cellData.cell_value : rindex}}
            </template>
        </span>
    </span>
</template>
<script>
export default {
    props:{
        rindex:{type:Number,default:null},
        cindex:{type:Number,default:null},
        styles:{type: Object,default(){return {}}},
        cellData:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    inject:["treeProps", "treeLoadNode", "treeSelectedResChange", "clearTreeSelected", "getCellProps"],
    data(){
        return {
            cellProps:{}
        }
    },
    created(){
        this.cellProps = this.getCellProps();
    },
    mounted(){
       
    },
    methods:{
        treeSelected(cellId){
            this.treeSelectedResChange(this.$refs[cellId],cellId)
        },
        reset(cellId){
            this.$refs[cellId].setCheckedNodes([]);
            this.clearTreeSelected(this.$refs[cellId],cellId);
        }
    }
}
</script>
<style lang="less">
    .cell-tree-prop{
        max-height:300px!important;
        overflow: auto;
    }
    .td-cell{
        display: inline-block;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        // text-overflow: ellipsis;
        // overflow: hidden;
    }
    @keyframes fixedCellColor {
        0%{
            color:#409EFF;
            // opacity: 0;
            // font-size: 1rem;
        }
        25%{
            color:#F56C6C;
            // opacity: 1;
            // font-size: 1.1rem;
        }
        50%{
            color:#E6A23C;
            // opacity: 1;
            // font-size: 1rem;
        }
        100%{
            color:#F56C6C;
            // opacity: 0;
            // font-size: 1.1rem;
        }
    }
    .fixed-cell{
        display: inline-block;
        animation: fixedCellColor 1s infinite linear;
    }
</style>
