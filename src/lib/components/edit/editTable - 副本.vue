<template>
    <div class="show-table">
        <div class="table-title">
            <slot name="title"><strong>{{title}}</strong></slot>
        </div>
        <div class="v-header">
                <table class="table table-header">
                    <tr>
                        <th class="cell" 
                            v-for="(val,index) in baseColTitle" 
                            :key="index" 
                            :class="{'cell-col-first':index == 0,'cell-col-title':index > 0}"
                            :ref="`col_h${index}`" 
                            :style="val.style">
                            {{val.value}}
                        </th>
                    </tr>
                </table>
            </div>
            <div class="v-body" ref="body" @contextmenu.prevent="visibleRightMouseMenu($event)">
                <table class="table table-body">
                    <tr v-for="(trItem,rindex) in tableDataConf.tableData" :key="rindex" v-show="rindex > 0">
                        <td v-for="(tdItem,cindex) in trItem" 
                        :key="cindex" 
                        class="cell"
                        :ref="cindex == 0 ? `row_${rindex}` : `cell_${rindex}_${cindex}`"
                        :class="{'cell-row-list':cindex == 0}" 
                        @click="cindex == 0 ? ()=>{} :cellmousedown(rindex,cindex,tdItem,$event)"
                        :style="tdItem.style" 
                        :type="tdItem.type" 
                        :cell-id="tdItem.cell_id"
                        :rowspan="tdItem.rowspan"
                        :colspan="tdItem.colspan"
                        :col-index="cindex"
                        :row-index="rindex">
                            <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
                        </td>
                    </tr>
                </table>
                <excel-border ref="eborder" :paintDash="paintDash" :state="'edit'" />
            </div>
            <div class="foot">
                <el-button size="small" type="primary" @click="save">保 存</el-button>
                <el-button size="small" @click="reset">重 置</el-button>
            </div>
    </div>
</template>
<script>
import {getBaseColTitle, getAttrs} from '../utils/excel'
import ExcelBorder from '../design/excelBorders'
import RenderCell from '../design/renderCell'
export default {
    name:'EditTable',
    props:{
        title:{type:String,default:()=>'默认标题'},
        tableDataConf:{
            type:Object,
            default(){
                return {
                    tableData:[],
                    rowCount:null,
                    colCount:null,
                }
            }
        },
        treeLoadNode:{type:Function,default:(node, resolve)=>{
            if (node.level === 0) {
                return resolve([{ name: 'region' }]);
            }
            if (node.level > 1) return resolve([]);

            setTimeout(() => {
                const data = [{
                    name: 'leaf',
                    leaf: true
                }, {
                    name: 'zone'
                }];

                resolve(data);
            }, 500);
        }},
        treeSelectedResChange:{type:Function,default:(treeVm,cellId)=>{}},
        clearTreeSelected:{type:Function,default:(treeVm,cellId)=>{}},
    },
    data(){
        return {
            baseColTitle:[],
            paintDash:{},
            borderConf:{},
            activeTdData:{},
            currentActiveCell:null,
        }
    },
    provide(){//使用依赖注入，在子组件中调用祖先组件的数据
        return {
            getTableData:this.getTableData,
            setTableData:this.setTableData,
            getBorderConf:this.provideBorderConf,
            setBorderConf:this.provideSetBorderConf,
            treeProps:this.treeProps,
            treeLoadNode:this.treeLoadNode,
            treeSelectedResChange:this.treeSelectedResChange,
            clearTreeSelected:this.clearTreeSelected,
            setPaintDash:this.setPaintDash,
        }
    },
    components:{ExcelBorder,RenderCell},
    mounted(){
        if(this.tableDataConf && this.tableDataConf.colCount){
            this.baseColTitle = getBaseColTitle(this.tableDataConf.colCount);
            this.baseColTitle.unshift({style:{},value:''})
        }
    },
    methods:{
        setPaintDash(data){
            this.$set(this,'paintDash',data);
        },
        getCurrentActiveCell(){
            return this.currentActiveCell
        },
        getTableData(){
            return this.tableDataConf.tableData;
        },
        setTableData(data){
            this.$set(this,'tableDataConf.tableData',data);
        },
        provideBorderConf(){
            return this.borderConf;
        },
        provideSetBorderConf(data){
            this.$set(this,'borderConf',data);
        },
        save(){
            this.$emit('save',this.tableDataConf.tableData);
        },
        reset(){
            this.tableDataConf.tableData.forEach((row,rindex) => {
                if(rindex > 0){
                    row.forEach((cell,cindex)=>{
                        if(cindex > 0){
                            cell.cell_value = null;
                        }
                    });
                }
            });
            this.$emit('reset',this.tableDataConf.tableData);
        },
        cellmousedown(rindex,cindex,tdItem,evt){
            this.$set(this,'currentActiveCell',tdItem);
            this.activeTdData = tdItem;
            this.activeTdData.row_index = rindex;
            this.activeTdData.col_index = cindex;
            const downtarget = evt.target;
            if(downtarget.getAttribute('type')!=='cell')return false;
            let attr = getAttrs(downtarget);
            this.$set(this,'paintDash',{
                attrs:attr,
                paintInfo:{
                    maxCol:attr.col,
                    minCol:attr.col,
                    maxRow:attr.row,
                    minRow:attr.row
                }
            })
            Object.assign(this.borderConf, {startTarget: downtarget, endTarget: downtarget});
        }
    }
}
</script>
<style lang="less" scoped>
    .foot{
        margin:15px 0;
        text-align: center;
    }
    .excelReport{
        position: relative;
    }
    .v-header{
        background: #fff;
        position: relative;
        z-index: 100;
    }
    .table{
        .cell{
           width: 200px;
        }
        .cell.cell-row-list,.cell.cell-col-first{
            width: 60px;
        }
        .cell-col-title,.cell-row-list{
            text-align: center;
            background: #f4f5f8;
            color: #666;
        }
        // width:100%;
        border-collapse: collapse;
        border-spacing: 0;
        color: #000;
        th,td{
            border: 1px solid #e0e2e4;
            // word-break:keep-all;/* 不换行 */
            // white-space:nowrap;/* 不换行 */
            // overflow: hidden;
            // text-overflow: ellipsis;
            // padding: 5px;
            // height: 22px;
            line-height: 22px;
        }
    }
    .cell-info{
        &:after{
            content: '';
            display: block;
            clear: both;
        }
        .cell-position{
            width: 71px;
            min-height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 1.05rem;
            float: left;
            border-right: 1px solid #e0e2e4;
        }
        .cell-cellValue{
            width:calc(100% - 93px);;
            height:100%;
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
    .v-body{
        position:relative;
    }
</style>
