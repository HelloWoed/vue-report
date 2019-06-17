<template>
    <div class="excelReport">
        <div class="table-title">
            <slot name="title"><strong>{{title}}</strong></slot>
        </div>
        <div class="v-excel" ref="excelRef">
            <div class="v-table" ref="scrollTableBox" :style="{width:tableConfig.width,height:tableConfig.height+'px'}">
                <div ref="scrollTableHeader" :style="{top:scrollTableHeaderPositionTop,height:showColNumber ? '32px' : 0}" class="table-Header-box">
                    <div v-if="attrDataConf.fixedHeaderCount" class="fixedColHeader">
                        <table class="table table-header" :style="reportBoxstyle">
                            <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount+1)">
                                <tr :key="rindex" v-if="rindex == 0 && showColNumber">
                                    <th class="cell fixed_cell" 
                                        v-for="(val,cindex) in baseColTitle" 
                                        :key="cindex" 
                                        :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0,hideRowNumber:cindex == 0 && !showRowNumber}"
                                        :ref="`col_h${cindex}`" 
                                        :style="val.cell_style">
                                        {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                    </th>
                                </tr>
                                <tr :key="rindex" v-if="rindex > 0">
                                    <td v-for="(tdItem,cindex) in trItem" 
                                    :key="cindex" 
                                    class="cell fixed_cell"
                                    :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                    :class="{'cell-row-list':cindex == 0,hideRowNumber:cindex == 0 && !showRowNumber}" 
                                    :style="tdItem.cell_style" 
                                    :type="tdItem.cell_type" 
                                    :areatype="tdItem.cell_area_type"
                                    :cell-id="tdItem.cell_id"
                                    :rowspan="tdItem.cell_rowspan"
                                    :colspan="tdItem.cell_colspan"
                                    :col-index="cindex"
                                    :row-index="rindex">
                                        {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <div v-else class="v-header">
                        <table v-if="showColNumber" class="table table-header" :style="reportBoxstyle">
                            <tr>
                                <th class="cell" 
                                    v-for="(val,cindex) in baseColTitle" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0,hideRowNumber:cindex == 0 && !showRowNumber}"
                                    :ref="`col_h${cindex}`" 
                                    :style="val.cell_style">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                        </table>
                    </div>
                </div>
                <div ref="leftFixedTable" class="fixedLeft" :style="{left:fixedColPositionscroll,width:fixedLeftColWidth+'px'}">
                    <table class="table table-header" :style="{width:fixedLeftColWidth+'px'}">
                        <template v-for="(trItem,rindex) in tableData">
                            <tr :key="rindex" v-if="rindex == 0  && showColNumber">
                                <th class="cell fixed_left_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0,attrDataConf.fixedLeftCount+1)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0,hideRowNumber:cindex == 0 && !showRowNumber}"
                                    :ref="`col_h_fixed${cindex}`" 
                                    :style="val.cell_style">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0,attrDataConf.fixedLeftCount+1)" 
                                :key="cindex" 
                                class="cell fixed_left_cell"
                                :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                :class="{'cell-row-list':cindex == 0,hideRowNumber:cindex == 0 && !showRowNumber}" 
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="cindex"
                                :row-index="rindex">
                                    {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div class="fixedLeft fixedLeftHeader" :style="{left:fixedColPositionscroll,width:fixedLeftColWidth+'px',top:scrollTableHeaderPositionTop}">
                    <table class="table table-header" :style="{width:fixedLeftColWidth+'px'}">
                        <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount ? attrDataConf.fixedHeaderCount + 1 : 1)">
                            <tr :key="rindex" v-if="rindex == 0 && showColNumber">
                                <th class="cell fixed_left_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0,attrDataConf.fixedLeftCount+1)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0,hideRowNumber:cindex == 0 && !showRowNumber}"
                                    :ref="`col_h_fixed${cindex}`" 
                                    :style="val.cell_style">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0,attrDataConf.fixedLeftCount+1)" 
                                :key="cindex" 
                                class="cell fixed_left_cell"
                                :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                :class="{'cell-row-list':cindex == 0,hideRowNumber:cindex == 0 && !showRowNumber}" 
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="cindex"
                                :row-index="rindex">
                                    {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div class="v-body" ref="body">
                    <table class="table table-body" :style="reportBoxstyle">
                        <tr v-for="(trItem,rindex) in tableData" :key="rindex" v-show="rindex > 0">
                            <td v-for="(tdItem,cindex) in trItem" 
                            :key="cindex" 
                            class="cell"
                            :ref="cindex == 0 ? `row_${rindex}` : `cell_${rindex}_${cindex}`"
                            :class="{'cell-row-list':cindex == 0,hideRowNumber:cindex == 0 && !showRowNumber}" 
                            :style="tdItem.cell_style" 
                            :type="tdItem.cell_type" 
                            :areatype="tdItem.cell_area_type"
                            :cell-id="tdItem.cell_id"
                            :rowspan="tdItem.cell_rowspan"
                            :colspan="tdItem.cell_colspan"
                            :col-index="cindex"
                            :row-index="rindex">
                                {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-if="attrDataConf.fixedRightCount" ref="rightFixedTable" class="fixedRight" :style="{right:'-' + fixedColPositionscroll}">
                    <table class="table table-header" :style="{width:fixedRightColWidth + 'px'}">
                        <template v-for="(trItem,rindex) in tableData">
                            <tr :key="rindex" v-if="rindex == 0 && showColNumber">
                                <th class="cell fixed_right_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0-attrDataConf.fixedRightCount)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':calcColIndex(cindex) == 0,'cell-col-title':calcColIndex(cindex) > 0}"
                                    :ref="`col_h_fixed_right${calcColIndex(cindex)}`" 
                                    :style="val.cell_style">
                                    {{tableHeaderData[calcColIndex(cindex)-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0-attrDataConf.fixedRightCount)" 
                                :key="cindex" 
                                class="cell fixed_right_cell"
                                :ref="calcColIndex(cindex) == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${calcColIndex(cindex)}`"
                                :class="{'cell-row-list':calcColIndex(cindex) == 0}" 
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="calcColIndex(cindex)"
                                :row-index="rindex">
                                    {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div v-if="attrDataConf.fixedRightCount" class="fixedRight fixedRightHeader" :style="{right:'-' + fixedColPositionscroll,top:scrollTableHeaderPositionTop}">
                    <table class="table table-header" :style="{width:fixedRightColWidth + 'px'}">
                        <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount ? attrDataConf.fixedHeaderCount + 1 : 1)">
                            <tr :key="rindex" v-if="rindex == 0 && showColNumber">
                                <th class="cell fixed_right_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0-attrDataConf.fixedRightCount)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':calcColIndex(cindex) == 0,'cell-col-title':calcColIndex(cindex) > 0}"
                                    :ref="`col_h_fixed_right${calcColIndex(cindex)}`" 
                                    :style="val.cell_style">
                                    {{tableHeaderData[calcColIndex(cindex)-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0-attrDataConf.fixedRightCount)" 
                                :key="cindex" 
                                class="cell fixed_right_cell"
                                :ref="calcColIndex(cindex) == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${calcColIndex(cindex)}`"
                                :class="{'cell-row-list':calcColIndex(cindex) == 0}" 
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="calcColIndex(cindex)"
                                :row-index="rindex">
                                    {{tdItem.cell_type == 'cell' ? parseCellValue(tdItem.cell_value) : rindex}}
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getBaseColTitle} from '../utils/excel'
import {bind, unbind, mouseMoveUp} from '../utils/event'

export default {
    name:"ShowTable",
    props:{
        title:{type:String,default:()=>'默认标题'},
        showRowNumber:{type:Boolean,default(){return true}},
        showColNumber:{type:Boolean,default(){return true}},
        tableConfig:{
            // type:JSON,
            default(){
                return {
                    rowCount:3,//行数
                    colCount:2,//列数
                    height:300,
                    width:'100%',
                    fixedHeaderCount:0,
                    fixedLeftCount:0,//左边列固定列数 需要设置width
                    fixedRightCount:0,//右边列固定列数 需要设置width
                    tableData:[]
                }
            }
        }
    },
    data(){
        return {
            parseCellValue(value){
                if(!value)value = '';
                if(typeof value != 'object'){
                    return value || '';
                }else{
                    if(Object.prototype.toString.call(value) == "[object Array]"){
                        return value.join(',');
                    }else {
                        return JSON.stringify(value);
                    }
                }
            },
            tableBoxScrollV:0,//表格滚动条纵向滚动距离
            tableBoxScrollH:0,//表格滚动条横向滚动距离
            scrollTableHeaderPositionTop:0,
            fixedColPositionscroll:0,
            reportBoxstyle:null,
            fixedLeftColWidth:null,
            fixedRightColWidth:null,
            scrollHMaxValue:null,
            scrollTableBoxScrollWidth:'',
            calcColIndex(cindex){
                return this.tableData[0].length - this.attrDataConf.fixedRightCount + cindex;
            },
            tableHeaderData:[],
            tableData:[],
        }
    },
    computed:{
        baseColTitle(){
            return this.tableData[0];
        }
    },
    created(){
        this.attrDataConf = this.tableConfig;
        this.tableData = this.tableConfig.tableData;
        this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
        
    },
    watch:{
        tableConfig:{
            handler(newVal,oldVal){
                this.attrDataConf = newVal;
                this.tableData = newVal.tableData;
                this.tableHeaderData = getBaseColTitle(newVal.colCount);
            },deep:true
        },
        tableData:{
            handler(newVal,oldVal){
                if(newVal.length < 1) return false;
                setTimeout(()=>{
                    this.initShowConf();
                });
            },deep:true
        },
        showRowNumber:{
            handler(){
                this.initShowConf();
            },deep:true
        },
        showColNumber:{
            handler(){
                this.initShowConf();
            },deep:true
        },
    },
    mounted(){
        
        
    },
    methods:{
        initShowConf(){
            setTimeout(()=>{
                this.resizeReportBox();
                //固定行固定列的相关设置
                this.$set(this,'scrollHMaxValue',null);
                this.$set(this,'scrollTableBoxScrollWidth','');
                this.$refs.scrollTableBox.scrollTo(this.$refs.scrollTableBox.scrollLeft,this.$refs.scrollTableBox.scrollTop);
                setTimeout(()=>{
                    this.initRenderFixedColRow();
                });
            });
        },
        initRenderFixedColRow(){
            // if(this.attrDataConf.fixedLeftCount){
                let fixedLeftColWidth = null;
                fixedLeftColWidth = this.$refs[`cell_1_${this.attrDataConf.fixedLeftCount + 1}`][0].offsetLeft;
                let width = 0
                for(let c = 0; c <= this.attrDataConf.fixedLeftCount; c++){
                    width += parseInt(this.tableData[0][c].cell_style.width)
                }
                this.$set(this,'fixedLeftColWidth',width);
            // }
            if(this.attrDataConf.fixedRightCount){
                let fixedRightColWidth = 0;
                for(let c = 1; c <= this.attrDataConf.fixedRightCount; c++){
                    fixedRightColWidth += parseInt(this.tableData[0][this.tableData[0].length - c].cell_style.width);
                }
                this.$set(this,'fixedRightColWidth',fixedRightColWidth);
            }
            let scrollFun = (event)=>{
               if(this.tableBoxScrollV == this.$refs.scrollTableBox.scrollTop && this.tableBoxScrollH != this.$refs.scrollTableBox.scrollLeft){
                    //横向滚动
                    this.$set(this,'fixedColPositionscroll',this.$refs.scrollTableBox.scrollLeft + 'px');
                    let scrollTableBoxScrollWidth = this.$refs.scrollTableBox.scrollWidth;
                    if(typeof this.scrollTableBoxScrollWidth == 'number' && scrollTableBoxScrollWidth > this.scrollTableBoxScrollWidth){
                        if(!this.scrollHMaxValue){
                            this.$set(this,'scrollHMaxValue',this.$refs.scrollTableBox.scrollLeft-2);
                        }
                        this.$refs.scrollTableBox.scrollTo(this.scrollHMaxValue,this.$refs.scrollTableBox.scrollTop);
                        return false;
                    }
                    this.$set(this,'scrollTableBoxScrollWidth',scrollTableBoxScrollWidth)
                    
                }else if (this.tableBoxScrollV != this.$refs.scrollTableBox.scrollTop && this.tableBoxScrollH == this.$refs.scrollTableBox.scrollLeft){
                    //纵向滚动
                    this.$set(this,'scrollTableHeaderPositionTop',this.$refs.scrollTableBox.scrollTop + 'px');
                }
                this.tableBoxScrollV = this.$refs.scrollTableBox.scrollTop;
                this.tableBoxScrollH = this.$refs.scrollTableBox.scrollLeft;
            }
            // if(this.attrDataConf.fixedLeftCount || this.attrDataConf.fixedRightCount){
            //     this.$refs.scrollTableBox.addEventListener('scroll',(event)=>{
            //         scrollFun(event)
            //     });
            // }else{
            //     this.$refs.scrollTableBox.removeEventListener('scroll',scrollFun);
            //     this.$set(this,'scrollTableBoxScrollWidth','');
            //     this.$set(this,'scrollHMaxValue',null);
            // }
            this.$refs.scrollTableBox.addEventListener('scroll',(event)=>{
                scrollFun(event)
            });
        },
        resizeReportBox(){
            let {tableData} = this;
            let reportWidth = 0;
            tableData[0].forEach(cell => {
                if(cell.cell_style.width){
                    reportWidth += parseInt(cell.cell_style.width);
                }else{
                    reportWidth += 200;
                }
            });
            this.$set(this,'reportBoxstyle',{
                width:reportWidth + 'px'
            });
        },
        
    }
}
</script>
<style lang="less" scoped>
    .v-excel{
        position: relative;
        //禁止滑动文字被选中
        // -moz-user-select: none; 
        // -khtml-user-select: none; 
        // user-select: none;
        // onselectstart:none
    }
    .excelReport{
        position: relative;
    }
    .v-header{
        background: #fff;
        position: relative;
        // z-index: 100;
    }
    .table{
        table-layout: fixed;
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
            box-sizing: border-box;
            // word-break:keep-all;/* 不换行 */
            // white-space:nowrap;/* 不换行 */
            // overflow: hidden;
            // text-overflow: ellipsis;
            // padding: 5px;
            height: 32px;
            // line-height: 27px;
        }
    }
    .fixedRight{
        .table{
            td{
                height:32px;
            }
        }
    }
    .cell-info{
        &:after{
            content: '';
            display: block;
            clear: both;
        }
        .cell-position{
            width: 60px;
            min-height: 30px;
            // line-height: 30px;
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
    .v-table{
        overflow:auto;
        position:relative;
        .fixedLeft{
            position: absolute;
            top:0;
            left: 0;
            z-index: 300
        }
        .fixedLeft.fixedLeftHeader{
            z-index: 350;
        }
        .fixedRight{
            position: absolute;
            top:0;
            right: 0;
            z-index: 300
        }
        .fixedRight.fixedRightHeader{
            z-index: 350;
        }
    }
    .table-Header-box{
        position:relative;
        z-index: 300;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .fixedColHeader{
            position: absolute;
            z-index: 200
        }
        
    }
    .table-Body-box{
        position:relative;
        
    }
    .hideRowNumber{
        display: none;
    }
</style>
