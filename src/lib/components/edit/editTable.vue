<template>
    <div class="excelReport">
        <div class="table-title">
            <slot name="title"><strong>{{title}}</strong></slot>
        </div>
        <div class="v-excel" ref="excelRef">
            <div class="v-table" ref="scrollTableBox" :style="{width:tableConfig.width,height:tableConfig.height+'px'}">
                <div ref="scrollTableHeader" :style="{top:scrollTableHeaderPositionTop,height:'32px'}" class="table-Header-box">
                    <div v-if="attrDataConf.fixedHeaderCount" class="fixedColHeader">
                        <table class="table table-header" :style="reportBoxstyle">
                            <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount+1)">
                                <tr :key="rindex" v-if="rindex == 0">
                                    <th class="cell fixed_cell" 
                                        v-for="(val,cindex) in baseColTitle" 
                                        :key="cindex" 
                                        :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0}"
                                        :ref="`col_h${cindex}`" 
                                        :style="val.cell_style"
                                        @click="cindex == 0 ? ()=>{} : tableHeaderClick(cindex,$event)"
                                        @mouseover="cindex == 0 ? ()=>{} : rowColMouseOverHandler('col', cindex, $event)">
                                        {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                    </th>
                                </tr>
                                <tr :key="rindex" v-if="rindex > 0">
                                    <td v-for="(tdItem,cindex) in trItem" 
                                    :key="cindex" 
                                    class="cell fixed_cell"
                                    :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                    :class="{'cell-row-list':cindex == 0}" 
                                    @mousedown.stop="cindex == 0 ? rowNumMouseDown(rindex,cindex,tdItem,$event) : cellmousedown(rindex,cindex,tdItem,$event)"
                                    @mouseover="cindex == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                                    @dblclick.left.stop="cellDblclickHandler(rindex, cindex, tdItem, $event)"
                                    :style="tdItem.cell_style" 
                                    :type="tdItem.cell_type" 
                                    :areatype="tdItem.cell_area_type"
                                    :cell-id="tdItem.cell_id"
                                    :rowspan="tdItem.cell_rowspan"
                                    :colspan="tdItem.cell_colspan"
                                    :col-index="cindex"
                                    :row-index="rindex">
                                        <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
                                    </td>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <div v-else class="v-header">
                        <table class="table table-header" :style="reportBoxstyle">
                            <tr>
                                <th class="cell" 
                                    v-for="(val,cindex) in baseColTitle" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0}"
                                    :ref="`col_h${cindex}`" 
                                    :style="val.cell_style"
                                    @click="cindex == 0 ? ()=>{} : tableHeaderClick(cindex,$event)"
                                    @mouseover="cindex == 0 ? ()=>{} : rowColMouseOverHandler('col', cindex, $event)">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                        </table>
                    </div>
                </div>
                <div ref="leftFixedTable" class="fixedLeft" :style="{left:fixedColPositionscroll,width:fixedLeftColWidth+'px'}">
                    <table class="table table-header" :style="{width:fixedLeftColWidth+'px'}">
                        <template v-for="(trItem,rindex) in tableData">
                            <tr :key="rindex" v-if="rindex == 0">
                                <th class="cell fixed_left_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0,attrDataConf.fixedLeftCount+1)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0}"
                                    :ref="`col_h_fixed${cindex}`" 
                                    :style="val.cell_style"
                                    @click="cindex == 0 ? ()=>{} : tableHeaderClick(cindex,$event)"
                                    @mouseover="cindex == 0 ? ()=>{} : rowColMouseOverHandler('col', cindex, $event)">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0,attrDataConf.fixedLeftCount+1)" 
                                :key="cindex" 
                                class="cell fixed_left_cell"
                                :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                :class="{'cell-row-list':cindex == 0}" 
                                @mousedown.stop="cindex == 0 ? rowNumMouseDown(rindex,cindex,tdItem,$event) : cellmousedown(rindex,cindex,tdItem,$event)"
                                @mouseover="cindex == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                                @dblclick.left.stop="cellDblclickHandler(rindex, cindex, tdItem, $event)"
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="cindex"
                                :row-index="rindex">
                                    <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div class="fixedLeft fixedLeftHeader" :style="{left:fixedColPositionscroll,width:fixedLeftColWidth+'px',top:scrollTableHeaderPositionTop}">
                    <table class="table table-header" :style="{width:fixedLeftColWidth+'px'}">
                        <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount ? attrDataConf.fixedHeaderCount + 1 : 1)">
                            <tr :key="rindex" v-if="rindex == 0">
                                <th class="cell fixed_left_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0,attrDataConf.fixedLeftCount+1)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':cindex == 0,'cell-col-title':cindex > 0}"
                                    :ref="`col_h_fixed${cindex}`" 
                                    :style="val.cell_style"
                                    @click="cindex == 0 ? ()=>{} : tableHeaderClick(cindex,$event)"
                                    @mouseover="cindex == 0 ? ()=>{} : rowColMouseOverHandler('col', cindex, $event)">
                                    {{cindex == 0 ? ' ' : tableHeaderData[cindex-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0,attrDataConf.fixedLeftCount+1)" 
                                :key="cindex" 
                                class="cell fixed_left_cell"
                                :ref="cindex == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${cindex}`"
                                :class="{'cell-row-list':cindex == 0}" 
                                @mousedown.stop="cindex == 0 ? rowNumMouseDown(rindex,cindex,tdItem,$event) : cellmousedown(rindex,cindex,tdItem,$event)"
                                @mouseover="cindex == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                                @dblclick.left.stop="cellDblclickHandler(rindex, cindex, tdItem, $event)"
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="cindex"
                                :row-index="rindex">
                                    <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
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
                            :class="{'cell-row-list':cindex == 0}" 
                            @mousedown.stop="cindex == 0 ? rowNumMouseDown(rindex,cindex,tdItem,$event) : cellmousedown(rindex,cindex,tdItem,$event)"
                            @mouseover="cindex == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                            @dblclick.left.stop="cellDblclickHandler(rindex, cindex, tdItem, $event)"
                            :style="tdItem.cell_style" 
                            :type="tdItem.cell_type" 
                            :areatype="tdItem.cell_area_type"
                            :cell-id="tdItem.cell_id"
                            :rowspan="tdItem.cell_rowspan"
                            :colspan="tdItem.cell_colspan"
                            :col-index="cindex"
                            :row-index="rindex">
                                <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
                            </td>
                        </tr>
                    </table>
                    <excel-border ref="eborder" :paintDash="paintDash" @copyCell="copyCell" />
                    <excel-cell-editr 
                        ref="eEdit"
                        :target="editData" 
                        @cellEditUpdate="cellEditUpdate">
                    </excel-cell-editr>
                </div>
                <div v-if="attrDataConf.fixedRightCount" ref="rightFixedTable" class="fixedRight" :style="{right:'-' + fixedColPositionscroll}">
                    <table class="table table-header" :style="{width:fixedRightColWidth + 'px'}">
                        <template v-for="(trItem,rindex) in tableData">
                            <tr :key="rindex" v-if="rindex == 0">
                                <th class="cell fixed_right_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0-attrDataConf.fixedRightCount)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':calcColIndex(cindex) == 0,'cell-col-title':calcColIndex(cindex) > 0}"
                                    :ref="`col_h_fixed_right${calcColIndex(cindex)}`" 
                                    :style="val.cell_style"
                                    @click="cindex == 0 ? ()=>{} : tableHeaderClick(calcColIndex(cindex),$event)"
                                    @mouseover="cindex == 0 ? ()=>{} : rowColMouseOverHandler('col', calcColIndex(cindex), $event)">
                                    {{tableHeaderData[calcColIndex(cindex)-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0-attrDataConf.fixedRightCount)" 
                                :key="cindex" 
                                class="cell fixed_right_cell"
                                :ref="calcColIndex(cindex) == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${calcColIndex(cindex)}`"
                                :class="{'cell-row-list':calcColIndex(cindex) == 0}" 
                                @mousedown.stop="calcColIndex(cindex) == 0 ? rowNumMouseDown(rindex,calcColIndex(cindex),tdItem,$event) : cellmousedown(rindex,calcColIndex(cindex),tdItem,$event)"
                                @mouseover="calcColIndex(cindex) == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                                @dblclick.left.stop="cellDblclickHandler(rindex, calcColIndex(cindex), tdItem, $event)"
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="calcColIndex(cindex)"
                                :row-index="rindex">
                                    <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="calcColIndex(cindex)" />
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <div v-if="attrDataConf.fixedRightCount" class="fixedRight fixedRightHeader" :style="{right:'-' + fixedColPositionscroll,top:scrollTableHeaderPositionTop}">
                    <table class="table table-header" :style="{width:fixedRightColWidth + 'px'}">
                        <template v-for="(trItem,rindex) in tableData.slice(0,attrDataConf.fixedHeaderCount ? attrDataConf.fixedHeaderCount + 1 : 1)">
                            <tr :key="rindex" v-if="rindex == 0">
                                <th class="cell fixed_right_cell" 
                                    v-for="(val,cindex) in baseColTitle.slice(0-attrDataConf.fixedRightCount)" 
                                    :key="cindex" 
                                    :class="{'cell-col-first':calcColIndex(cindex) == 0,'cell-col-title':calcColIndex(cindex) > 0}"
                                    :ref="`col_h_fixed_right${calcColIndex(cindex)}`" 
                                    :style="val.cell_style"
                                    @click="tableHeaderClick(calcColIndex(cindex),$event)"
                                    @mouseover="rowColMouseOverHandler('col', calcColIndex(cindex), $event)">
                                    {{tableHeaderData[calcColIndex(cindex)-1].value}}
                                </th>
                            </tr>
                            <tr :key="rindex" v-if="rindex > 0">
                                <td v-for="(tdItem,cindex) in trItem.slice(0-attrDataConf.fixedRightCount)" 
                                :key="cindex" 
                                class="cell fixed_right_cell"
                                :ref="calcColIndex(cindex) == 0 ? `row_fixed_${rindex}` : `cell_fixed_${rindex}_${calcColIndex(cindex)}`"
                                :class="{'cell-row-list':calcColIndex(cindex) == 0}" 
                                @mousedown.stop="calcColIndex(cindex) == 0 ? rowNumMouseDown(rindex,calcColIndex(cindex),tdItem,$event) : cellmousedown(rindex,calcColIndex(cindex),tdItem,$event)"
                                @mouseover="calcColIndex(cindex) == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                                @dblclick.left.stop="cellDblclickHandler(rindex, calcColIndex(cindex), tdItem, $event)"
                                :style="tdItem.cell_style" 
                                :type="tdItem.cell_type" 
                                :areatype="tdItem.cell_area_type"
                                :cell-id="tdItem.cell_id"
                                :rowspan="tdItem.cell_rowspan"
                                :colspan="tdItem.cell_colspan"
                                :col-index="calcColIndex(cindex)"
                                :row-index="rindex">
                                    <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="calcColIndex(cindex)" />
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
                <excel-resizer
                    :target="rowResizer.target"
                    :index="rowResizer.index"
                    @change="rowChangeResizerHandler"
                    v-if="rowResizer && rowResizer.target">
                </excel-resizer>
                <excel-resizer
                    :target="colResizer.target"
                    :index="colResizer.index"
                    :vertical="true"
                    @change="colChangeResizerHandler"
                    v-if="colResizer && colResizer.target">
                </excel-resizer>
            </div>
        </div>
        <div class="foot">
            <el-button size="small" type="primary" @click="save">保 存</el-button>
            <el-button size="small" @click="reset">重 置</el-button>
        </div>
    </div>
</template>
<script>
import {getBaseColTitle, 
    initTableData, 
    getAttrs, 
    getInsertTableData,
    mergeCell,
    splitCell,
    getColTpl} from '../utils/excel'
import {bind, unbind, mouseMoveUp} from '../utils/event'
import ExcelBorder from '../design/excelBorders'
import ExcelCellEditr from '../design/excelCellEditr'
import RenderCell from '../design/renderCell'
import ExcelResizer from '../design/excelResizer'

export default {
    name:"EditTable",
    props:{
        title:{type:String,default:()=>'默认标题'},
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
        },
        treeProps:{type:Object,default(){
            return {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            }
        }},
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
        cellProps:{type:Object,default(){return {
            radio:{
                label:'name',
                value:'name'
            },
            checkbox:{
                label:'name',
                value:'name'
            },
            tree:{
                label:'name',
                value:'name'
            }
        }}}
    },
    components:{ExcelBorder,ExcelCellEditr,RenderCell,ExcelResizer},
    data(){
        return {
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
            visableRightMouseMenu:false,
            editData:{},
            tableHeaderData:[],
            rightMouseMenuStyle:{},
            attrDataConf:{},
            tableData:[],
            activeTdData:null,
            borderConf:{},
            paintDash:{},//拖动框区域
            rowResizer:{},
            colResizer:{},
            attrShowBtnClass:['iconHdonghua-xiangzuozhankai'],
            currentActiveCell:null,//当前激活的单元格,
            currentRowHeight:0
        }
    },
    provide(){//使用依赖注入，在子组件中调用祖先组件的数据
        return {
            getTableData:this.getTableData,
            setTableData:this.setTableData,
            getBorderConf:this.provideBorderConf,
            setBorderConf:this.provideSetBorderConf,
            getCurrentActiveCell:this.getCurrentActiveCell,
            setPaintDash:this.setPaintDash,
            treeProps:this.treeProps,
            treeLoadNode:this.treeLoadNode,
            treeSelectedResChange:this.treeSelectedResChange,
            clearTreeSelected:this.clearTreeSelected,
            getCellProps:this.getCellProps,
        }
    },
    computed:{
        baseColTitle(){
            return this.tableData[0];
        },
    },
    created(){
        this.attrDataConf = this.tableConfig;
        this.tableData = this.tableConfig.tableData;
        this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
        
    },
    watch:{
        tableData:{
            handler(newVal,oldVal){
                if(newVal.length < 1) return false;
                setTimeout(()=>{
                    // setTimeout(()=>{ this.updateTableCellHeight();});
                    this.updateTableCellHeight();
                    this.resizeReportBox();
                    if(this.borderConf.startTarget){
                        this.borderReload();
                    }
                    //固定行固定列的相关设置
                    this.$set(this,'scrollHMaxValue',null);
                    this.$set(this,'scrollTableBoxScrollWidth','');
                    this.$refs.scrollTableBox.scrollTo(this.$refs.scrollTableBox.scrollLeft,this.$refs.scrollTableBox.scrollTop);
                    setTimeout(()=>{
                        this.initRenderFixedColRow();
                    });
                })
            },deep:true
        },
        currentActiveCell:{
            handler(newVal,oldVal){
                if(!oldVal || (newVal.cell_id != oldVal.cell_id)){
                    this.$set(this,'currentRowHeight',this.$refs[`cell_${newVal.row_index}_${newVal.col_index}`][0].offsetHeight)
                }
                
            }
        }
    },
    mounted(){
        //默认第一行第一列选中激活
        this.defaultActiveCell();

        this.$on('hideMenuBox',()=>{
            this.visableRightMouseMenu = false;
        })
        this.$on('cellMerge',()=>{
            mergeCell.bind(this)();
        })
        this.$on('cellSplit',()=>{
            splitCell.bind(this)();
        });
    },
    methods:{
        save(){
            this.$emit('save',this.getTableData());
        },
        reset(){
            this.tableData.forEach((row,rindex) => {
                if(rindex > 0){
                    row.forEach((cell,cindex)=>{
                        if(cindex > 0){
                            cell.cell_value = null;
                        }
                    });
                }
            });
            this.$emit('reset',this.getTableData());
        },
        updateTableCellHeight(){
            let {tableData} = this;
            let r = this.getCurrentActiveCell().row_index;
            let height = this.$refs[`cell_${r}_1`][0].offsetHeight;
            if(!this.currentRowHeight || (height - this.currentRowHeight > 3)){
                this.currentRowHeight = height;
            }
            tableData[r].forEach((cell,c)=>{
                cell.cell_style.height = this.currentRowHeight + 'px';
                if(c == 0){
                    cell.cell_style.height = this.currentRowHeight + 3 + 'px';
                }
            });
            
        },
        defaultActiveCell(tdData){
            let tdItem = null;
            let targetCellDom = null;
            if(!tdData){
                tdItem = this.tableData[1][1];
                tdItem.row_index = 1;
                tdItem.col_index = 1;
                targetCellDom = this.$refs.cell_1_1[0];
            }else{
                tdItem = tdData;
                targetCellDom = this.$refs[`cell_${tdItem.row_index}_${tdItem.col_index}`][0];
            }
            this.activeTdData = tdItem;
            this.$set(this,'currentActiveCell',tdItem);
            this.$emit('currentCellChange',tdItem);
            let attr = getAttrs(targetCellDom);
            this.$set(this,'paintDash',{
                attrs:attr,
                paintInfo:{
                    maxCol:attr.col,
                    minCol:attr.col,
                    maxRow:attr.row,
                    minRow:attr.row
                }
            })
            Object.assign(this.borderConf, {startTarget: targetCellDom, endTarget: targetCellDom});
            this.$refs.eborder.$emit('updateBorder');
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
                this.borderReload();
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
        getCellProps(){
            return this.cellProps;
        },
        setPaintDash(data){
            this.$set(this,'paintDash',data);
        },
        getCurrentActiveCell(){
            return this.currentActiveCell
        },
        getTableData(){
            return this.tableData;
        },
        setTableData(data){
            this.$set(this,'tableData',data);
            this.$refs.eborder.$emit('updateBorder');
        },
        provideBorderConf(){
            return this.borderConf;
        },
        provideSetBorderConf(data){
            this.$set(this,'borderConf',data);
        },
        copyCell(data){
            this.$set(this,'tableData',data);
        },
        cellEditUpdate(val){
            this.tableData[val.row][val.col].cell_value = val.value;
            setTimeout(()=>{
                this.$set(this,'editData',{
                    row:this.paintDash.attrs.row,
                    col:this.paintDash.attrs.col,
                    target:this.$refs[`cell_${this.paintDash.attrs.row}_${this.paintDash.attrs.col}`][0]
                });
            });
        },
        cellDblclickHandler(rindex,cindex,tdItem,e){
            if(tdItem.cell_render_type == 'fixed'){
                this.$message({
                    message:'固定值类型的单元格不允许编辑！ @_@',
                    type:'warning',
                    duration:5000
                });
                return false
            };
            // let target = e.target;
            let target = this.$refs[`cell_${rindex}_${cindex}`][0];
            while(target && target.nodeName != "TD"){
                target = target.parentNode;
            }
            if (!target || target.getAttribute('type') != 'cell')return false;
            this.$set(this,'currentActiveCell',tdItem);
            this.$emit('currentCellChange',tdItem);
            this.$set(this,'editData',{
                row:rindex,
                col:cindex,
                target:target
            })
        },
        tableHeaderClick(cIndex,event){
            event.stopPropagation();
            let startTarAttr = null;
            let endTarAttr = null;
            if(event.target.getAttribute('class').includes('cell fixed_right_cell')){
                Object.assign(this.borderConf, {startTarget: this.$refs[`cell_fixed_${1}_${cIndex}`][0], endTarget: this.$refs[`cell_fixed_${this.tableConfig.rowCount}_${cIndex}`][0]});
                startTarAttr = getAttrs(this.borderConf.startTarget);
                startTarAttr.left += this.$refs.rightFixedTable.offsetLeft;
                endTarAttr = getAttrs(this.borderConf.endTarget);
                endTarAttr.left += this.$refs.rightFixedTable.offsetLeft;
            }else{
                Object.assign(this.borderConf, {startTarget: this.$refs[`cell_${1}_${cIndex}`][0], endTarget: this.$refs[`cell_${this.tableConfig.rowCount}_${cIndex}`][0]});
                startTarAttr = getAttrs(this.borderConf.startTarget);
                endTarAttr = getAttrs(this.borderConf.endTarget);
            }
            
            this.$refs.eborder.$emit('updateBorder');
            
            let maxCol = cIndex;
            let minCol = cIndex;
            let maxRow = this.tableConfig.rowCount;
            let minRow = 1;
            let tdItem = this.tableData[minRow][minCol];
            tdItem.row_index = minRow;
            tdItem.col_index = maxCol;
            this.$set(this,'activeTdData',tdItem);
            this.$set(this,'currentActiveCell',tdItem);
            let paintInfo = {
                minRow,
                maxRow,
                minCol,
                maxCol
            }
            let attrs = {
                height:endTarAttr.top - startTarAttr.top + endTarAttr.height,
                width:endTarAttr.left - startTarAttr.left + endTarAttr.width,
                left:startTarAttr.left,
                top:startTarAttr.top
            }
            window.setTimeout(()=>{
                this.$set(this,'paintDash',{paintInfo,attrs:Object.assign(endTarAttr,attrs)});
            },0);
        },
        rowNumMouseDown(rindex,cindex,tdItem,evt){
            Object.assign(this.borderConf, {startTarget: this.$refs[`cell_${rindex}_1`][0], endTarget: this.$refs[`cell_${rindex}_${this.tableConfig.colCount}`][0]});
            this.$refs.eborder.$emit('updateBorder');
            let startTarAttr = getAttrs(this.borderConf.startTarget);
            let endTarAttr = getAttrs(this.borderConf.endTarget);
            let maxCol = this.tableConfig.colCount;
            let minCol = 1;
            let maxRow = rindex;
            let minRow = rindex;
            let tdItemData = this.tableData[minRow][minCol];
            tdItemData.row_index = maxRow;
            tdItemData.col_index = minCol;
            this.$set(this,'activeTdData',tdItemData);
            this.$set(this,'currentActiveCell',tdItemData);
            let paintInfo = {
                minRow,
                maxRow,
                minCol,
                maxCol
            }
            let attrs = {
                height:endTarAttr.top - startTarAttr.top + endTarAttr.height,
                width:endTarAttr.left - startTarAttr.left + endTarAttr.width,
                left:startTarAttr.left,
                top:startTarAttr.top
            }
            window.setTimeout(()=>{
                this.$set(this,'paintDash',{paintInfo,attrs:Object.assign(endTarAttr,attrs)});
            },0);
        },
        cellmousedown(rindex,cindex,tdItem,evt){
            evt.stopPropagation();
            this.$set(this,'currentActiveCell',tdItem);
            this.$emit('currentCellChange',tdItem);
            if(evt.button != 0)return false;
            this.visableRightMouseMenu = false;
            this.$set(this,'editData',{
                row:null,
                col:null,
                target:null
            })
            this.activeTdData = tdItem;
            this.activeTdData.row_index = rindex;
            this.activeTdData.col_index = cindex;
            // let downtarget = evt.target;
            let downtarget = this.$refs[`cell_${rindex}_${cindex}`][0];
            while(downtarget && downtarget.nodeName != "TD"){
                downtarget = downtarget.parentNode;
            }
            if (!downtarget || downtarget.getAttribute('type') != 'cell')return false;
            let attr = getAttrs(downtarget);
            let eventTarget = evt.target;
            while(eventTarget && eventTarget.nodeName != "TD"){
                eventTarget = eventTarget.parentNode;
            }
            let eventTargetAttr = getAttrs(eventTarget);
            if(eventTarget.getAttribute('class').includes('cell fixed_right_cell')){
                eventTargetAttr.left += this.$refs.rightFixedTable.offsetLeft;
            }
            attr.left = eventTargetAttr.left;
            this.$set(this,'paintDash',{
                attrs:attr,
                paintInfo:{
                    maxCol:attr.col,
                    minCol:attr.col,
                    maxRow:attr.row,
                    minRow:attr.row
                }
            })
            Object.assign(this.borderConf, {startTarget: downtarget, endTarget: downtarget,attrs:attr});
            this.$refs.eborder.$emit('updateBorder');
            mouseMoveUp((moveEvt)=>{
                moveEvt.stopPropagation();
                let target = moveEvt.target;
                while(target && target.nodeName != "TD"){
                    target = target.parentNode;
                }
                if (!target || target.getAttribute('type') != 'cell')return false;
                let rowIndex = target.getAttribute('row-index');
                let cowIndex = target.getAttribute('col-index');
                let {$refs} = this;
                this.borderConf.endTarget = target;
                let startCellAttr = getAttrs(this.borderConf.startTarget);
                let endCellAttr = getAttrs(this.borderConf.endTarget);
                if(this.borderConf.startTarget.getAttribute('class').includes('cell fixed_right_cell')){
                    startCellAttr.left += this.$refs.rightFixedTable.offsetLeft;
                }
                if(this.borderConf.endTarget.getAttribute('class').includes('cell fixed_right_cell')){
                    endCellAttr.left += this.$refs.rightFixedTable.offsetLeft;
                }
                // let minRow = endCellAttr.row + endCellAttr.rowspan - 1 < startCellAttr.row + startCellAttr.rowspan - 1 ? endCellAttr.row + endCellAttr.rowspan - 1 : startCellAttr.row + startCellAttr.rowspan - 1;
                // let maxRow = endCellAttr.row + endCellAttr.rowspan - 1 > startCellAttr.row + startCellAttr.rowspan - 1 ? endCellAttr.row + endCellAttr.rowspan - 1 : startCellAttr.row + startCellAttr.rowspan - 1;
                // let minCol = endCellAttr.col + endCellAttr.colspan - 1 < startCellAttr.col + startCellAttr.colspan - 1 ? endCellAttr.col + endCellAttr.colspan - 1 : startCellAttr.col + startCellAttr.colspan - 1;
                // let maxCol = endCellAttr.col + endCellAttr.colspan - 1 > startCellAttr.col + startCellAttr.colspan - 1 ? endCellAttr.col + endCellAttr.colspan - 1 : startCellAttr.col + startCellAttr.colspan - 1;
                let minRow = endCellAttr.row < startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let maxRow = endCellAttr.row > startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let minCol = endCellAttr.col < startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let maxCol = endCellAttr.col > startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let paintInfo = {
                    minRow,
                    maxRow,
                    minCol,
                    maxCol
                }
                let attrs = {
                    height:endCellAttr.top - startCellAttr.top + endCellAttr.height,
                    width:endCellAttr.left - startCellAttr.left + endCellAttr.width,
                    left:startCellAttr.left,
                    top:startCellAttr.top
                }
                this.$set(this,'paintDash',{paintInfo,attrs:Object.assign(endCellAttr,attrs)});
            },(upEvt)=>{
                
            })
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
        rowColMouseOverHandler (type, index, evt) {
            if (evt.buttons !== 1) {
                this.$set(this,`${type}Resizer`,{target: evt.target, index});
            }
        },
        borderReload () {
            this.$refs.eborder.$emit('updateBorder');
        },
        rowChangeResizerHandler(index, distance){
            let tableData = this.tableData;
            this.$set(this,'tableData',[]);
            let rowHeight = this.$refs[`row_${index}`][0].offsetHeight + distance;
            if(rowHeight > 21){
                this.currentRowHeight = rowHeight;
                this.$set(this,'currentActiveCell',tableData[index][1]);
                if(!tableData[index][1].row_index)tableData[index][1].row_index = index;
                if(!tableData[index][1].col_index)tableData[index][1].col_index = 1;
                this.defaultActiveCell(tableData[index][1])
                this.borderReload();
                tableData[index].forEach(cell => {
                    cell.cell_style.height = rowHeight + 'px';
                });
            }
            this.$set(this,'tableData',tableData);
        },
        colChangeResizerHandler(index, distance){
            let tableData = this.tableData;
            this.$set(this,'tableData',[]);
            let colWidth = this.$refs[`col_h${index}`][0].offsetWidth + distance;
            if(colWidth > 30) {
                tableData[0][index].cell_style.width = colWidth + 'px';
                tableData[1][index].cell_style.width = colWidth + 'px';
                tableData[2][index].cell_style.width = colWidth + 'px';
            }
            this.setTableData(JSON.parse(JSON.stringify(tableData)));
        },
    }
}
</script>
<style lang="less" scoped>
    .v-excel{
        position: relative;
        //禁止滑动文字被选中
        -moz-user-select: none; 
        -khtml-user-select: none; 
        user-select: none;
        onselectstart:none
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
    .mouseRightMenu{
        position: absolute;
        z-index: 500;
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
    .foot{
        margin:15px 0;
        text-align: center;
    }
</style>
