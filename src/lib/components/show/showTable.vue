<template>
    <div class="show-table">
        <div class="table-title">
            <slot name="title"><strong>{{title}}</strong></slot>
        </div>
        <div class="v-header" v-if="showColNumber">
                <table class="table table-header">
                    <tr>
                        <th class="cell" 
                            v-for="(val,index) in baseColTitle" 
                            :key="index" 
                            :class="{'cell-col-first':index == 0 && showRowNumber,'cell-col-title':index > 0}"
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
                        v-show="cindex == 0 ? showRowNumber : true"
                        class="cell"
                        :ref="cindex == 0 ? `row_${rindex}` : `cell_${rindex}_${cindex}`"
                        :class="{'cell-row-list':cindex == 0}" 
                        :style="tdItem.cell_style" 
                        :type="tdItem.cell_type" 
                        :cell-id="tdItem.cell_id"
                        :rowspan="tdItem.cell_rowspan"
                        :colspan="tdItem.cell_colspan"
                        :col-index="cindex"
                        :row-index="rindex">
                            <span class="td-cell" :style="tdItem.cell_style">
                                {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                            </span>
                            
                        </td>
                    </tr>
                </table>
            </div>
    </div>
</template>
<script>
import {getBaseColTitle} from '../utils/excel'
export default {
    name:'ShowTable',
    props:{
        title:{type:String,default:()=>'默认标题'},
        showRowNumber:{type:Boolean,default(){return true}},
        showColNumber:{type:Boolean,default(){return true}},
        tableDataConf:{
            type:Object,
            default(){
                return {
                    tableData:[],
                    rowCount:null,
                    colCount:null,
                }
            }
        }
    },
    data(){
        return {
            baseColTitle:[],
            parseCellValue(value){
                if(typeof value != 'object'){
                    return value
                }else{
                    if(Object.prototype.toString.call(value) == "[object Array]"){
                        return value.join(',');
                    }else {
                        return JSON.stringify(value);
                    }
                }
            }
        }
    },
    mounted(){
        if(this.tableDataConf && this.tableDataConf.colCount){
            this.baseColTitle = getBaseColTitle(this.tableDataConf.colCount);
            if(this.showRowNumber){
                this.baseColTitle.unshift({style:{},value:''})
            }
        }
    },
    methods:{
       
    }
}
</script>
<style lang="less" scoped>
    .excelReport{
        position: relative;
    }
    .v-header{
        background: #fff;
        position: relative;
        z-index: 100;
    }
    .td-cell{
        display: inline-block;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        // text-overflow: ellipsis;
        // overflow: hidden;
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
        border-collapse: collapse;
        border-spacing: 0;
        color: #000;
        th,td{
            border: 1px solid #e0e2e4;
            word-break:keep-all;/* 不换行 */
            white-space:nowrap;/* 不换行 */
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 4px;
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
            width: 81px;
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
    .mouseRightMenu{
        position: absolute;
        z-index: 300;
    }
</style>
