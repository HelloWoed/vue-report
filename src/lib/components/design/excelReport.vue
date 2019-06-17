<template>
    <div class="excelReport">
        <div class="v-excel" ref="excelRef">
            <div class="tool-bar" ref="toolBarRef">
                <ExcelToolBar 
                @setAttribute="setAttribute" 
                @tableEventHandler="tableEventHandler" 
                @lockedTableDo="lockedTableDo"
                @initTableRowCol="initTableRowCol" />
            </div>
            <div class="cell-info">
                <div class="cell-position">{{activeTdData ? tableHeaderData[activeTdData.col_index - 1].value + activeTdData.row_index : ''}}</div>
                <textarea class="cell-cellValue" @input="activeCellInput" :value="activeTdData ? activeTdData.cell_value : ''" rows="1"></textarea>
            </div>
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
                <div class="v-body" ref="body" @contextmenu.prevent="visibleRightMouseMenu($event)">
                    <table class="table table-body" :style="reportBoxstyle">
                        <tr v-for="(trItem,rindex) in tableData" :key="rindex">
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
            <div class="mouseRightMenu" :style="rightMouseMenuStyle" v-if="visableRightMouseMenu">
                <RightMouseMenu @insertRow="insertRow" 
                    @insertCol="insertCol" 
                    @deleteCol="deleteCol"
                    @deleteRow="deleteRow" /> 
            </div>
        </div>
        <div class="attrSet" :class="{showAttrModel:attrModelShow}">
            <AttrSet :currentActiveCell="currentActiveCell" />
            <span class="attrShowBtn" @click="attrModel($event)">
                <i class="icon iconfont" :class="{'iconHdonghua-xiangzuozhankai':!attrModelShow,'iconHdonghua-xiangyouzhankai':attrModelShow}"></i>
            </span>
        </div>
    </div>
</template>
<script>
import {getBaseColTitle, 
    initTableData, 
    getAttrs, 
    getInsertTableData,
    deleteRow,
    deleteCol,
    insertRow,
    insertCol,
    defaultLoadIndr,
    mergeCell,
    splitCell,
    getColTpl} from '../utils/excel'
import {bind, unbind, mouseMoveUp} from '../utils/event'
import ExcelBorder from './excelBorders'
import RightMouseMenu from './rightMenu'
import ExcelResizer from './excelResizer'
import ExcelCellEditr from './excelCellEditr'
import ExcelToolBar from './excelToolBar'
import AttrSet from './attrSet'
import RenderCell from './renderCell'
export default {
    name:"VueExcel",
    props:{
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
                    tableData:null,//初始化数据
                    // state:'design',//设计状态：design；编辑（填报）状态：edit;展示状态：view; 默认为设计状态 design
                }
            }
        },
        tableToolbarConf:{type:Array,default(){//工具栏配置
            return ["tableSet","readOnly","tableHeader","inputArea","calcArea","quote","split","bold","italic","underLine","fontSize","split","color","backgroundColor","textLeft","textCenter","textRight","setHeight","setWidth","textTop","vercicalMiddle","textBottom","split","locked","unlock","tablesetting","upload","splitMiddle","preview","tableValidate","save","share"]
        }},
        toolbarEvent:{type:Object,default(){return {}}},
        loadIndrNode:{type:Function,default: (node, resolve)=>{//指标树形结构load方法
            defaultLoadIndr(node, resolve);
        }},
        dimensionData:{type:Function,default:(resolve,reject,data,node,vm)=>{
            let datas =  [
                {id:'001',value:'维度指标1'},
                {id:'002',value:'维度指标2'},
                {id:'003',value:'维度指标3'},
                {id:'004',value:'维度指标4'},
                {id:'005',value:'维度指标5'},
                {id:'006',value:'维度指标6'},
            ]
            resolve(datas);
        }},//维度数据
        indrSelectChange:{type:Function,default:(data,node,refTree,self)=>{//指标树选择改变时触发
            //用promise是为了如果此处需要拉接口处理数据，在子组件内需要等接口数据处理完成后才能处理
            return new Promise((resolve,reject)=>{
                 //实现单选
                refTree.setCheckedNodes([]);
                refTree.setCheckedNodes([data]);
                resolve(data);
            });
        }},
        indrPprops:{type:Object,default(){
            return {
                // label:'name',//label 支持 string 和 function
                label:(data, node)=>{
                    return data.name
                },
                // children: 'zones',
                disabled:(data,node)=>{
                    if(node.level > 3)return false;
                    else return true;
                },
                isLeaf: (data,node)=>{
                    if(node.level > 3)return true;
                    else return data.leaf;
                }
            }
        }},
        dimensionProp:{type:Object,default(){return {label:'value'}}},
        indicatorListProp:{type:Object,default(){return {label:'value'}}},
        getIndrDatas:{type:Function,default:(resolve,reject,data,vm)=>{//获取指标数据
            return [
                {id:'001',value:'普通本科生因其他休退学数1'},
                {id:'002',value:'普通本科生因其他休退学数2'},
                {id:'003',value:'普通本科生因其他休退学数3'},
                {id:'004',value:'普通本科生因其他休退学数4'},
                {id:'005',value:'普通本科生因其他休退学数5'},
                {id:'006',value:'普通本科生因其他休退学数6'},
                {id:'007',value:'普通本科生因其他休退学数7'},
                {id:'008',value:'普通本科生因其他休退学数8'},
                {id:'009',value:'普通本科生因其他休退学数9'},
                {id:'010',value:'普通本科生因其他休退学数10'},
            ]
        }},
        cellBindIndr:{type:Function,default:(cell,indr)=>{//单元格绑定指标
            console.log(cell,indr)
        }},
        cellInputContentSet:{type:Function,default:(cell,data)=>{//单元格绑定输入内容相关设置
            console.log(cell,data)
        }},
        confSelectionData:{type:Function,default:(resolve)=>{
            let data = [
                {
                    id:'01',
                    name:'性别',
                    data:[
                        {
                            id:'011',
                            name:'男性'
                        },
                        {
                            id:'012',
                            name:'女性'
                        }
                    ]
                },
                {
                    id:'02',
                    name:'班级',
                    data:[
                        {
                            id:'021',
                            name:'一班'
                        },
                        {
                            id:'022',
                            name:'二班'
                        },
                        {
                            id:'023',
                            name:'三班'
                        }
                    ]
                }
            ]
            resolve(data);
        }},
        confSelectionItemData:{type:Function,default:(resolve,val)=>{
            resolve(val.data);
        }},
        inputTypeConfChange:{type:Function,default:(cell,data)=>{
            console.log(cell,data)
        }},
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
        selectionRadioProp:{type:Function,default:(item)=>{return item.name}},
        selectionCheckBoxProp:{type:Function,default:(item)=>{
            return item.name
        }},
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
        }}},
        cellCalculationConfig:{
            type:Function,
            default:()=>{
                return {
                    //与公式设计插件的attr_data_conf event_ele_conf配置一致
                    attr_data_conf:{
                        indrProp:{
                            // label:'name',//label 支持 string 和 function
                            label:(data, node)=>{
                                return data.name
                            },
                            // children: 'zones',
                            disabled:(data,node)=>{
                                if(node.level > 3)return false;
                                else return true;
                            },
                            isLeaf: (data,node)=>{
                                if(node.level > 3)return true;
                                else return data.leaf;
                            }
                        },
                        dividerOption:['筛选指标','维度选择','可选指标','已选中指标'],
                        //维度数据显示label prop
                        // dimensionProp:{label:'value'},
                        dimensionProp:(data)=>{
                            return data.value;
                        },
                        //指标列表 label propv  可以是function
                        indicatorListProp:{label:'value'},
                        //计算符号 prop  可以是function
                        calcSymbolProp:{label:'value'},
                        //函数 prop  可以是function
                        existFunProp:{label:'name'}
                    },
                    event_ele_conf:{
                        created:function(){

                        },
                        mounted:function(){

                        },
                        getSymbolData:function(resolve){//获取计算符号数据
                            let data = [
                                {
                                    id:'001',
                                    type:'symbol',
                                    value:"+"
                                },
                                {
                                    id:'002',
                                    type:'symbol',
                                    value:"-"
                                },
                                {
                                    id:'003',
                                    type:'symbol',
                                    value:"*"
                                },
                                {
                                    id:'004',
                                    type:'symbol',
                                    value:"/"
                                },
                                {
                                    id:'005',
                                    type:'symbol',
                                    value:"="
                                },
                                {
                                    id:'006',
                                    type:'symbol',
                                    value:">"
                                },
                                {
                                    id:'007',
                                    type:'symbol',
                                    value:">="
                                },
                                {
                                    id:'008',
                                    type:'symbol',
                                    value:"<"
                                },
                                {
                                    id:'009',
                                    type:'symbol',
                                    value:"<="
                                },
                                {
                                    id:'010',
                                    type:'symbol',
                                    value:"=="
                                },
                                {
                                    id:'011',
                                    type:'symbol',
                                    value:"!="
                                },
                                {
                                    id:'012',
                                    type:'symbol',
                                    value:"("
                                },
                                {
                                    id:'013',
                                    type:'symbol',
                                    value:")"
                                },
                                {
                                    id:'014',
                                    type:'symbol',
                                    value:"["
                                },
                                {
                                    id:'015',
                                    type:'symbol',
                                    value:"]"
                                },
                                {
                                    id:'016',
                                    type:'symbol',
                                    value:"in"
                                },
                                {
                                    id:'017',
                                    type:'symbol',
                                    value:"not in"
                                },
                                {
                                    id:'018',
                                    type:'symbol',
                                    value:"if"
                                },
                                {
                                    id:'019',
                                    type:'symbol',
                                    value:"else"
                                },
                                {
                                    id:'020',
                                    type:'symbol',
                                    value:"and"
                                },
                                {
                                    id:'021',
                                    type:'symbol',
                                    value:"or"
                                },
                                {
                                    id:'022',
                                    type:'symbol',
                                    value:","
                                },
                                {
                                    id:'023',
                                    type:'symbol',
                                    value:"delete"
                                }
                            ];
                            resolve(data);
                        },
                        getExistFuns:function(resolve){//获取函数数据
                            let data = [
                                {
                                    id:'001',
                                    name:'求和',
                                    value:'COUNT'
                                },
                                {
                                    id:'002',
                                    name:'平均值',
                                    value:'AVERAGE'
                                },
                                {
                                    id:'003',
                                    name:'最大值',
                                    value:'MAX'
                                },
                                {
                                    id:'004',
                                    name:'最小值',
                                    value:'MIN'
                                }
                            ];
                            resolve(data);
                        },
                        calcIndrSelectChange:function(resolve,newData,oldData){
                            resolve(newData);
                        },
                        parseCalcBoardLabel:function(item){//解析当前项要在计算面板中显示的值
                            return item.value;
                        },
                        completeCalculation:function(data){
                            console.log(data);
                            let res = '';
                            data.forEach(item=>{
                                item.type == 'indr' ? res += item.id : res += item.value;
                            });
                            console.log('your calculations is : ' + res);
                        },
                        loadIndrNode:function(node, resolve){
                            if (node.level === 0) {
                                return resolve([{id:Math.ceil(Math.random()*100000) + new Date().getTime(), name: 'region' }]);
                            }
                            if (node.level >= 1) setTimeout(() => {
                                const data = [{
                                    id:Math.ceil(Math.random()*100000) + new Date().getTime(),
                                    name: 'leaf',
                                    leaf: true
                                }, {
                                    id:Math.ceil(Math.random()*100000) + new Date().getTime(),
                                    name: 'zone'
                                }];
                                return resolve(data);
                            }, 500);
                        },
                        indrSelectChange:function(data,node,refTree,self){//指标树选择改变时触发
                            //用promise是为了如果此处需要拉接口处理数据，在子组件内需要等接口数据处理完成后才能处理
                            return new Promise((resolve,reject)=>{
                                //实现单选
                                refTree.setCheckedNodes([]);
                                refTree.setCheckedNodes([data]);
                                resolve(data);
                            });
                        },
                        dimensionData(resolve,reject,data,node,vm){//维度数据
                            let datas =  [
                                {id:'001',value:'维度指标1'},
                                {id:'002',value:'维度指标2'},
                                {id:'003',value:'维度指标3'},
                                {id:'004',value:'维度指标4'},
                                {id:'005',value:'维度指标5'},
                                {id:'006',value:'维度指标6'},
                            ]
                            resolve(datas);
                        },
                        getIndrDatas(resolve,reject,data,vm){//获取指标数据
                            let datas =  [
                                {id:'001',value:'普通本科生因其他休退学数1'},
                                {id:'002',value:'普通本科生因其他休退学数2'},
                                {id:'003',value:'普通本科生因其他休退学数3'},
                                {id:'004',value:'普通本科生因其他休退学数4'},
                                {id:'005',value:'普通本科生因其他休退学数5'},
                                {id:'006',value:'普通本科生因其他休退学数6'},
                                {id:'007',value:'普通本科生因其他休退学数7'},
                                {id:'008',value:'普通本科生因其他休退学数8'},
                                {id:'009',value:'普通本科生因其他休退学数9'},
                                {id:'010',value:'普通本科生因其他休退学数10'},
                                {id:'011',value:'普通本科生因其他休退学数11'}
                            ]
                            resolve(datas);
                        },
                        destroyed:function(){

                        }
                    }
                }
            }
        }
    },
    components:{ExcelBorder,RightMouseMenu,ExcelResizer,ExcelCellEditr,ExcelToolBar,AttrSet,RenderCell},
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
            attrModelShow:false,
            currentActiveCell:null,//当前激活的单元格
            currentRowHeight:0,
            tableBodyHeight:null,
        }
    },
    provide(){//使用依赖注入，在子组件中调用祖先组件的数据
        return {
            tableToolbarConf:this.tableToolbarConf,
            getTableData:this.getTableData,
            setTableData:this.setTableData,
            getBorderConf:this.provideBorderConf,
            setBorderConf:this.provideSetBorderConf,
            loadIndrNode:this.loadIndrNode,
            indrSelectChange:this.indrSelectChange,
            dimensionData:this.dimensionData,
            getIndrDatas:this.getIndrDatas,
            cellBindIndr:this.cellBindIndr,
            cellInputContentSet:this.cellInputContentSet,
            confSelectionData:this.confSelectionData,
            confSelectionItemData:this.confSelectionItemData,
            inputTypeConfChange:this.inputTypeConfChange,
            getCurrentActiveCell:this.getCurrentActiveCell,
            updateCurrentActiveCell:this.updateCurrentActiveCell,
            setPaintDash:this.setPaintDash,
            treeProps:this.treeProps,
            indrPprops:this.indrPprops,
            selectionRadioProp:this.selectionRadioProp,
            selectionCheckBoxProp:this.selectionCheckBoxProp,
            indicatorListProp:this.indicatorListProp,
            dimensionProp:this.dimensionProp,
            treeLoadNode:this.treeLoadNode,
            treeSelectedResChange:this.treeSelectedResChange,
            clearTreeSelected:this.clearTreeSelected,
            getCellProps:this.getCellProps,
            cellCalculationConfig:this.cellCalculationConfig,
            cellValidate:this.cellValidate,
        }
    },
    computed:{
        baseColTitle(){
            return this.tableData[0];
        }
    },
    created(){
        //初始化
        this.$set(this,'attrDataConf',this.tableConfig);
        this.initReportOrginData();
    },
    watch:{
        tableConfig:{
            handler(newVal,oldVal){
                this.$set(this,'attrDataConf',newVal);
                this.initReportOrginData();
                this.defaultActiveCell();
            },deep:true
        },
        tableData:{
            handler(newVal,oldVal){
                if(newVal.length < 1) return false;
                setTimeout(()=>{
                    this.updateTableCellHeight();
                    this.resizeReportBox();
                    this.defaultActiveCell();
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
                    let r,c;
                    if(newVal.row_index){
                        r = newVal.row_index;
                        c = newVal.col_index;
                    }else if(this.borderConf.row){
                        r = this.borderConf.row;
                        c = this.borderConf.col;
                    }
                    if(r && c){
                        this.$set(this,'currentRowHeight',this.$refs[`cell_${r}_${c}`][0].offsetHeight);
                    }
                }
                this.$emit('currentCellChange',newVal);
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
        initReportOrginData(){
            if(this.attrDataConf.tableData){
                this.$set(this,'tableData',this.attrDataConf.tableData);
            }else{
                let tbData = initTableData(this.attrDataConf.rowCount,this.attrDataConf.colCount);
                this.$set(this,'tableData',tbData);
                //触发保存事件
                this.toolbarEvent.save.bind(this)(this.tableData)
            }
            this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
        },
        updateCurrentActiveCell(cellData){
            this.$set(this,'currentActiveCell',JSON.parse(JSON.stringify(cellData)));
        },
        updateTableCellHeight(){
            let {tableData} = this;
            let r = null;
            if(this.getCurrentActiveCell().row_index){
                r = this.getCurrentActiveCell().row_index;
            }else{
                r = this.borderConf.row;
            }
            let currenCell = this.getCurrentActiveCell();
            let calHeight = 0;
            for(let row = r; row < r + currenCell.cell_rowspan; row++){
                calHeight += this.$refs[`row_${r}`][0].offsetHeight;
                tableData[r][0].cell_style.height = this.$refs[`row_${r}`][0].offsetHeight + 'px';
            };
            this.$set(this,'currentRowHeight',calHeight);
            let height = parseInt(currenCell.cell_style.height);
            if(!this.currentRowHeight || (height - this.currentRowHeight > 3)){
                this.currentRowHeight = height;
                tableData[r].forEach((cell,c)=>{
                    cell.cell_style.height = this.currentRowHeight + 'px';
                    if(c == 0){
                        cell.cell_style.height = this.currentRowHeight + 3 + 'px';
                    }
                });
            }
        },
        defaultActiveCell(tdData){
            let tdItem = null;
            let targetCellDom = null;
            let tableData = this.getTableData();
            if(tableData.length == 0)return false;
            if(this.currentActiveCell){
                if(tableData[this.currentActiveCell.row_index][this.currentActiveCell.col_index] && this.currentActiveCell.cell_id){
                    return false;
                }
            };
            if(!tdData){
                tdItem = tableData[1][1];
                tdItem.row_index = 1;
                tdItem.col_index = 1;
                targetCellDom = this.$refs.cell_1_1[0];
            }else{
                tdItem = tdData;
                targetCellDom = this.$refs[`cell_${tdItem.row_index}_${tdItem.col_index}`][0];
            }
            this.activeTdData = tdItem;
            this.$set(this,'currentActiveCell',tdItem);
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
        lockedTableDo(item){
            let value = {
                fixedHeaderCount:Number(item.value.firstRow),
                fixedLeftCount:Number(item.value.leftCol),
                fixedRightCount:Number(item.value.rightCol)
            };
            if(Number(item.value.tableWidth)){
                value.width = Number(item.value.tableWidth) + 'px';
            }else{
                delete this.attrDataConf.width;
            }
            if(Number(item.value.tableHeight)){
                value.height = Number(item.value.tableHeight);
            }else{
                delete delete this.attrDataConf.height;
            }
            Object.assign(this.attrDataConf,value);
            let attrDataConf = JSON.parse(JSON.stringify(this.attrDataConf));
            this.$set(this,'attrDataConf',attrDataConf);
            this.defaultActiveCell();
            //固定行固定列的相关设置
            setTimeout(()=>{
                this.initRenderFixedColRow();
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
        initTableRowCol(data){
            this.attrDataConf.rowCount = data.row;
            this.attrDataConf.colCount = data.col;
            let tbData = initTableData(this.attrDataConf.rowCount,this.attrDataConf.colCount);
            this.setTableData(tbData);
            this.attrDataConf.tableData = tbData;
            this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
            //初始化当前单元格
            this.$set(this,'currentActiveCell',null);
            //触发保存事件
            this.toolbarEvent.save.bind(this)(this.tableData)
        },
        attrModel(e){
            this.attrModelShow = !this.attrModelShow;
        },
        tableEventHandler(item){
            this.toolbarEvent[item.eName].bind(this)(this.getTableData());
        },
        deleteRow(){
            deleteRow.bind(this)();
        },
        deleteCol(){
            deleteCol.bind(this)();
        },
        insertRow(num){
            insertRow.bind(this)(num);
        },
        insertCol(num){
            insertCol.bind(this)(num);
        },
        setAttribute(data){
            if(data.target == 'cell' || data.target == 'tableRowCol'){
                if(!this.paintDash.paintInfo)return false;
                let {maxCol,maxRow,minCol,minRow} = this.paintDash.paintInfo;
                let {tableData} = this;
                if(data.target == 'cell'){
                    for(let r = minRow; r <= maxRow; r++){
                        for(let c = minCol; c <= maxCol; c++){
                            Object.keys(data.value).forEach(key=>{
                                let toggleAttr = ['fontWeight','fontStyle','textDecoration']
                                if(toggleAttr.includes(key)){
                                    if(tableData[r][c].cell_style[key]){
                                        delete tableData[r][c].cell_style[key];
                                    }else{
                                        Object.assign(tableData[r][c].cell_style,data.value);
                                    }
                                }else{
                                    if(data.name == "backgroundColor"){
                                        if( tableData[r][c].cell_area_type == 'inputArea'){
                                            Object.assign(tableData[r][c].cell_style,data.value);
                                        }else{
                                            this.$message({
                                                message:'非输入区单元格不可设置背景色 @_@',
                                                type:'warning'
                                            });
                                        }
                                    }else{
                                        Object.assign(tableData[r][c].cell_style,data.value);
                                    }
                                    if(data.area == 'area'){
                                        tableData[r][c].cell_area_type = data.name;
                                        if(data.name != "inputArea"){
                                            tableData[r][c].cell_render_type = 'text';
                                            tableData[r][c].cell_value = "";
                                        }
                                    }
                                }
                            })
                            if(data.areaSet){
                                tableData[r][c].cell_area_type = data.name;
                            }
                        }
                    }
                }else if(data.target == 'tableRowCol'){
                    let cell = this.getCurrentActiveCell();
                    if(data.name == 'setHeight'){
                        for(let r = minRow; r <= maxRow; r++){
                            this.currentRowHeight = parseInt(data.value);
                            tableData[r].forEach(cell=>{
                                if(cell.cell_rowspan == 1){
                                    cell.cell_style['height'] = data.value;
                                }
                                
                            });
                            // tableData[r][0].cell_style['height'] = data.value;
                            // tableData[r][1].cell_style['height'] = data.value;
                            // tableData[r][tableData[r].length - 1].cell_style['height'] = data.value;
                        }
                        
                    }else if(data.name == 'setWidth'){
                        let startWidth = parseInt(tableData[0][minCol].cell_style.width);
                        let betweenVal = parseInt(data.value) - startWidth;
                        for(let row = 0; row < tableData.length; row++){
                            for(let c = minCol; c <= maxCol; c++){
                                if(tableData[row][c].cell_colspan == 1){
                                    tableData[row][c].cell_style['width'] = data.value;
                                }else{
                                    tableData[row][c].cell_style['width'] = parseInt(tableData[row][c].cell_style.width) + betweenVal + 'px'
                                }
                                // tableData[0][c].cell_style['width']=data.value;
                                // tableData[0][tableData[0].length - 1].cell_style['width']=data.value;
                                // tableData[1][c].cell_style['width']=data.value;
                                // tableData[1][tableData[1].length - 1].cell_style['width']=data.value;
                                // tableData[2][c].cell_style['width']=data.value;
                                // tableData[2][tableData[2].length - 1].cell_style['width']=data.value;
                            }
                        }
                    }
                    
                }
                // this.setTableData(JSON.parse(JSON.stringify(tableData)));
                this.$set(this,'editData',{
                    row:this.paintDash.attrs.row,
                    col:this.paintDash.attrs.col,
                    target:this.$refs[`cell_${this.paintDash.attrs.row}_${this.paintDash.attrs.col}`][0]
                });
                this.$refs.eborder.$emit('updateBorder');
                // this.$set(this,'tableData',[]);
                // window.setTimeout(()=>{
                //     this.$set(this,'tableData',tableData);
                //     this.$set(this,'editData',{
                //         row:this.paintDash.attrs.row,
                //         col:this.paintDash.attrs.col,
                //         target:this.$refs[`cell_${this.paintDash.attrs.row}_${this.paintDash.attrs.col}`][0]
                //     })
                // },0);
                
            }
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
            // let target = e.target;
            let notAllowArea = ["calcArea","quote"];
            let notAllowAreaName = {
                calcArea:"计算区",
                quote:"引用区"
            };
            if(notAllowArea.includes(tdItem.cell_area_type)){
                this.$message({
                    message:`${notAllowAreaName[tdItem.cell_area_type]} 不可以输入 ^_@`,
                    type:'warning'
                });
                return false;
            }
            if(tdItem.cell_area_type == 'calcArea' ||  tdItem.cell_area_type == 'quote'){
                return false;
            }
            let target = this.$refs[`cell_${rindex}_${cindex}`][0];
            while(target && target.nodeName != "TD"){
                target = target.parentNode;
            }
            if (!target || target.getAttribute('type') != 'cell')return false;
            this.$set(this,'currentActiveCell',tdItem);
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
            if(evt.button != 0)return false;
            this.$set(this,'currentActiveCell',tdItem);
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
        rowChangeResizerHandler(index, distance){
            let tableData = this.getTableData();
            this.$set(this,'tableData',[]);
            let rowHeight = this.$refs[`row_${index}`][0].offsetHeight + distance;
            if(rowHeight > 21){
                this.$set(this,'currentActiveCell',tableData[index][1]);
                this.currentRowHeight = rowHeight;
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
        resizeReportBox(){
            let {tableData} = this;
            let reportWidth = 0;
            tableData[0].forEach(cell => {
                if(cell.cell_style.width){
                    reportWidth += parseInt(cell.cell_style.width);
                }else{
                    reportWidth += 100;
                }
            });
            this.$set(this,'reportBoxstyle',{
                width:reportWidth + 'px'
            });
        },
        colChangeResizerHandler(index, distance){
            let tableData = this.tableData;
            this.$set(this,'tableData',[]);
            let colWidth = parseInt(tableData[0][index].cell_style.width) + distance;
            for(let row = 0; row < tableData.length; row++){
                if(colWidth > 30) {
                    if(tableData[row][index].cell_colspan == 1){
                        tableData[row][index].cell_style['width'] = colWidth + 'px';
                    }else{
                        tableData[row][index].cell_style['width'] = parseInt(tableData[row][index].cell_style.width) + distance + 'px'
                    }
                }
            }
            this.setTableData(JSON.parse(JSON.stringify(tableData)));
        },
        rowColMouseOverHandler (type, index, evt) {
            if (evt.buttons !== 1) {
                this.$set(this,`${type}Resizer`,{target: evt.target, index});
            }
        },
        visibleRightMouseMenu(e){
            this.rightMouseMenuStyle = {
                // top:`${e.clientY - this.$refs['scrollTableBox'].offsetTop - this.$refs['scrollTableBox'].scrollTop}px`,
                // left:`${e.clientX - this.$refs['scrollTableBox'].offsetLeft - this.$refs['scrollTableBox'].scrollLeft}px`
                // top:`${e.clientY - this.$refs['excelRef'].offsetTop - this.$refs['toolBarRef'].clientHeight - 20}px`,
                // left:`${e.clientX - this.$refs['excelRef'].offsetLeft}px`
                top:`${e.clientY - this.$refs['excelRef'].offsetTop}px`,
                left:`${e.clientX - this.$refs['excelRef'].offsetLeft}px`
            }
            this.visableRightMouseMenu = true;
        },
        borderReload () {
            this.$refs.eborder.$emit('updateBorder');
        },
        activeCellInput(val){
            let currentCell = this.getCurrentActiveCell();
            let notAllowArea = ["calcArea","quote"];
            if(!notAllowArea.includes(currentCell.cell_area_type)){
                this.$refs.eborder.$emit('updateBorder');
                this.activeTdData.cell_value = val.target.value;
            }
        },
        
    }
}
</script>
<style lang="less" scoped>
    @import url('../icon/iconfont.css');
    @cellListNumWidth: 60px;
    @keyframes attrSetShowWidth {
       from{
           width:0;
           padding:0;
       }
       to{
           width: 28%;
           padding:10px 20px;
       }
    }
    @keyframes attrSetHideWidth {
       from{
           width:28%;
           padding:10px 20px;
       }
       to{
           width:0;
           padding:0;
       }
    }
    .v-excel{
        position: relative;
        //禁止滑动文字被选中
        -moz-user-select: none; 
        -khtml-user-select: none; 
        user-select: none;
        onselectstart:none
    }
    .excelReport{
        // position: relative;
        .attrSet.showAttrModel{
            width:28%;
            animation: attrSetShowWidth .3s;
        }
        .attrSet{
            position: fixed;
            top:0;
            right: 0;
            background: #fff;
            // height: 100%;
            z-index: 600;
            width:0;
            animation: attrSetHideWidth .3s;
            box-shadow: -2px -1px 5px #aaa;
            .attrShowBtn{
                position: absolute;
                top:200px;
                left:-25px;
                color:#409EFF;
                &:hover{
                    cursor: pointer;
                    .iconfont{
                        font-size: 2.2rem;
                        transition: font-size .3s
                    }
                }
                .iconfont{
                    font-size: 2rem;
                }
            }
        }
    }
    .v-header{
        background: #fff;
        position: relative;
        // z-index: 100;
    }
    .table{
        table-layout: fixed;
        .cell{
           width: 100px;
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
            width: 61px;
            box-sizing: border-box;
            min-height: 30px;
            // line-height: 30px;
            text-align: center;
            font-size: 1.05rem;
            float: left;
            border-left: 1px solid #e0e2e4;
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
            // overflow-y: hidden;
            border: none;
            outline-width: 0;
        }
    }
    .v-body{
        position:relative;
        top: -32px;
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
</style>
