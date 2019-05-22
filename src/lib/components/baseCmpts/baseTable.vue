<template>
    <div class="v-excel">
        <div class="cell-info">
            <div class="cell-position">{{activeTdData ? baseColTitle[activeTdData.col_index].value + activeTdData.row_index : ''}}</div>
            <textarea class="cell-cellValue" @input="activeCellInput" :value="activeTdData ? activeTdData.cell_value : ''" rows="1"></textarea>
        </div>
        <div class="v-header">
            <table class="table table-header">
                <tr>
                    <th class="cell" 
                        v-for="(val,index) in baseColTitle" 
                        :key="index" 
                        :class="{'cell-col-first':index == 0,'cell-col-title':index > 0}"
                        :ref="`col_h${index}`" 
                        :style="val.cell_style"
                        @mouseover="index == 0 ? ()=>{} : rowColMouseOverHandler('col', index, $event)">
                        {{index == 0 ? '1' : tableHeaderData[index-1].value}}
                    </th>
                </tr>
            </table>
            <excel-resizer
                vertical
                :target="colResizer.target"
                :index="colResizer.index"
                @change="colChangeResizerHandler"
                v-if="colResizer && colResizer.target">
            </excel-resizer>
        </div>
        <div class="v-body" ref="body" @contextmenu.prevent="visibleRightMouseMenu($event)">
            <table class="table table-body">
                <tr v-for="(trItem,rindex) in tableData" :key="rindex" v-show="rindex > 0">
                    <td v-for="(tdItem,cindex) in trItem" 
                    :key="cindex" 
                    class="cell"
                    :ref="cindex == 0 ? `row_${rindex}` : `cell_${rindex}_${cindex}`"
                    :class="{'cell-row-list':cindex == 0}" 
                    @mousedown="cindex == 0 ? ()=>{} :cellmousedown(rindex,cindex,tdItem,$event)"
                    @mouseover="cindex == 0 ? rowColMouseOverHandler('row', rindex, $event) : ()=>{}"
                    @dblclick.left.stop="cellDblclickHandler(rindex, cindex, tdItem, $event)"
                    :style="tdItem.cell_style" 
                    :type="tdItem.cell_type" 
                    :areatype="tdItem.cell_area_type"
                    :cell-id="tdItem.cell_cell_id"
                    :rowspan="tdItem.cell_rowspan"
                    :colspan="tdItem.cell_colspan"
                    :col-index="cindex"
                    :row-index="rindex">
                        <RenderCell :cellData="tdItem" :rindex="rindex" :cindex="cindex" />
                    </td>
                </tr>
            </table>
            
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
getColTpl} from '../utils/excel'
import toolbarEvent from '../utils/toobarEvent'
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
                    state:'design',//设计状态：design；编辑（填报）状态：edit;展示状态：view; 默认为设计状态 design
                }
            }
        },
        tableToolbarConf:{type:Array,default(){//工具栏配置
            return ["tableSet","readOnly","tableHeader","inputArea","calcArea","quote","split","bold","italic","underLine","fontSize","split","color","backgroundColor","textLeft","textCenter","textRight","setHeight","setWidth","textTop","vercicalMiddle","textBottom","split","locked","unlock","tablesetting","upload","splitMiddle","preview","tableValidate","save","share"]
        }},
        loadIndrNode:{type:Function,default: (node, resolve)=>{//指标树形结构load方法
            defaultLoadIndr(node, resolve);
        }},
        dimensionData:{type:Function,default:()=>{
            return [
                {id:'001',value:'维度指标1'},
                {id:'002',value:'维度指标2'},
                {id:'003',value:'维度指标3'},
                {id:'004',value:'维度指标4'},
                {id:'005',value:'维度指标5'},
                {id:'006',value:'维度指标6'},
            ]
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
        getIndrDatas:{type:Function,default:(data)=>{//获取指标数据
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
    },
    components:{ExcelBorder,RightMouseMenu,ExcelResizer,ExcelCellEditr,ExcelToolBar,AttrSet,RenderCell},
    data(){
        return {
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
            setPaintDash:this.setPaintDash,
            treeProps:this.treeProps,
            treeLoadNode:this.treeLoadNode,
            treeSelectedResChange:this.treeSelectedResChange,
            clearTreeSelected:this.clearTreeSelected,
        }
    },
    computed:{
        baseColTitle(){
            return this.tableData[0];
        }
    },
    created(){
        this.attrDataConf = this.tableConfig;
        this.tableData = initTableData(this.attrDataConf.rowCount,this.attrDataConf.colCount);
        this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
    },
    mounted(){
        this.$on('hideMenuBox',()=>{
            this.visableRightMouseMenu = false;
        })
    },
    methods:{
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
            this.tableData = initTableData(this.attrDataConf.rowCount,this.attrDataConf.colCount);
            this.tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
        },
        attrModel(e){
            this.attrModelShow = !this.attrModelShow;
        },
        tableEventHandler(item){
            toolbarEvent[item.eName].bind(this)(this.tableData);
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
            if(data.target == 'cell'){
                if(!this.paintDash.paintInfo)return false;
                let {maxCol,maxRow,minCol,minRow} = this.paintDash.paintInfo;
                let {tableData} = this;
                for(let r = minRow; r <= maxRow; r++){
                    for(let c = minCol; c <= maxCol; c++){
                       Object.assign(tableData[r][c].cell_style,data.value);
                       if(data.areaSet){
                           tableData[r][c].area_type = data.name;
                       }
                    }
                }
                this.$set(this,'tableData',tableData);
                this.$set(this,'editData',{
                    row:this.paintDash.attrs.row,
                    col:this.paintDash.attrs.col,
                    target:this.$refs[`cell_${this.paintDash.attrs.row}_${this.paintDash.attrs.col}`][0]
                })
            }
        },
        copyCell(data){
            this.$set(this,'tableData',data);
        },
        cellEditUpdate(val){
            this.tableData[val.row][val.col].cell_value = val.value;
        },
        cellDblclickHandler(rindex,cindex,tdItem,e){
            this.$set(this,'currentActiveCell',tdItem);
            this.$emit('currentCellChange',tdItem);
            this.$set(this,'editData',{
                row:rindex,
                col:cindex,
                target:this.$refs[`cell_${rindex}_${cindex}`][0]
            })
        },
        cellmousedown(rindex,cindex,tdItem,evt){
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
            let downtarget = evt.target;
            if(downtarget.nodeName == 'TD' || downtarget.getAttribute('class') == 'td-cell'){
                    while(downtarget.nodeName != "TD"){
                        downtarget = downtarget.parentNode;
                    }
                }
            if (!downtarget.getAttribute('type') || downtarget.getAttribute('type') != 'cell')return false;
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
            mouseMoveUp((moveEvt)=>{
                let target = moveEvt.target;
                if(target.nodeName == 'TD' || (target.getAttribute('class') && target.getAttribute('class') == 'td_cell')){
                    while(target.nodeName != "TD"){
                        target = target.parentNode;
                    }
                }
                if (!target.getAttribute('type') || target.getAttribute('type') != 'cell')return false;
                let rowIndex = target.getAttribute('row-index');
                let cowIndex = target.getAttribute('col-index');
                let {$refs} = this;
                this.borderConf.endTarget = $refs[`cell_${rowIndex}_${cowIndex}`][0];
                let startCellAttr = getAttrs(this.borderConf.startTarget);
                let endCellAttr = getAttrs(this.borderConf.endTarget);
                let minRow = endCellAttr.row < startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let maxRow = endCellAttr.row > startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let minCol = endCellAttr.col < startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let maxCol = endCellAttr.col > startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let startTarAttr = getAttrs($refs[`cell_${minRow}_${minCol}`][0]);
                let endTarAttr = getAttrs($refs[`cell_${maxRow}_${maxCol}`][0]);
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
                this.$set(this,'paintDash',{paintInfo,attrs:Object.assign(endTarAttr,attrs)});
            },(upEvt)=>{
                
            })
        },
        rowChangeResizerHandler(index, distance){
            let tableData = this.tableData;
            this.$set(this,'tableData',[]);
            let rowHeight = this.$refs[`row_${index}`][0].offsetHeight + distance;
            if(rowHeight > 21)tableData[index][0].cell_style.height = rowHeight + 'px';
            this.$set(this,'tableData',tableData);
            this.borderReload();
        },
        colChangeResizerHandler(index, distance){
            let tableData = this.tableData;
            this.$set(this,'tableData',[]);
            let colWidth = this.$refs[`col_h${index}`][0].offsetWidth + distance;
            if(colWidth > 30) {
                tableData[0][index].cell_style.width = colWidth + 'px';
                tableData[1][index].cell_style.width = colWidth + 'px';
            }
            this.$set(this,'tableData',tableData);
            this.borderReload();
        },
        rowColMouseOverHandler (type, index, evt) {
            if (evt.buttons !== 1) {
                this[`${type}Resizer`] = {target: evt.target, index}
            }
        },
        visibleRightMouseMenu(e){
            this.rightMouseMenuStyle = {
                top:`${e.clientY - this.$refs['body'].offsetTop}px`,
                left:`${e.clientX - this.$refs['body'].offsetLeft}px`
            }
            this.visableRightMouseMenu = true;
        },
        borderReload () {
            this.$refs.eborder.$emit('updateBorder');
        },
        activeCellInput(val){
            this.$refs.eborder.$emit('updateBorder');
            this.activeTdData.cell_value = val.target.value;
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
    .excelReport{
        position: relative;
        .attrSet.showAttrModel{
            width:28%;
            animation: attrSetShowWidth .3s;
        }
        .attrSet{
            position: absolute;
            top:0;
            right: 0;
            background: #fff;
            height: 100%;
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
    .mouseRightMenu{
        position: absolute;
        z-index: 300;
    }
</style>
