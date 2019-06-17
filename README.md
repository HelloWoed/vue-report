# vue-element-excel

> 此插件 使用vue 基于element-ui，样式使用less语法，使用前应确保相关依赖已安装

## 共包含四个插件：

> [报表设计插件](#design)

> [报表填报插件](#fill)

> [报表展示插件](#show)

> [公式设计插件](#calculation)

## 安装 vue-element-excel

``` bash
npm i vue-element-excel
```

## 全量引入

```javascript
// main.js
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueExcel from 'vue-element-excel'
Vue.use(ElementUI);
Vue.use(VueExcel);
```

## 按需引入

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui';
import {DesignTable, EditTable, ShowTable,Calculation} from './lib'//按需引入
Vue.use(ElementUI);
Vue.use(DesignTable);//design(设计)
Vue.use(EditTable);//edit（填报）
Vue.use(ShowTable);//show（展示）
Vue.use(Calculation);//公式
```

## 调用 

> 报表设计 

![报表设计效果图](https://raw.githubusercontent.com/HelloWoed/vue-report/master/static/images/design.png)

```html
<template>
    <div class="atoname" :class="datas.cmpt_class || []" :style="datas.cmpt_style || {}">
        <vue-excel 
        :ref="attrDataConf.reportRef"
        :tableConfig="attrDataConf.table_config"
        :tableToolbarConf="attrDataConf.table_toolbar_data"
        :toolbarEvent="attrDataConf.toolbar_event"
        :inputTypeConfChange="inputTypeConfChange"
        :cellInputContentSet="cellInputContentSet"
        :treeProps="attrDataConf.inutTreeProps"
        :indrPprops="attrDataConf.indrPprops"
        :dimensionProp="attrDataConf.dimensionProp"
        :indicatorListProp="attrDataConf.indicatorListProp"
        :loadIndrNode="loadIndrNode"
        :indrSelectChange="indrSelectChange"
        :cellBindIndr="cellBindIndr"
        :dimensionData="dimensionData"
        :getIndrDatas="getIndrDatas"
        :treeLoadNode="treeLoadNode"
        :treeSelectedResChange="indrTreeSelectedResChange"
        :cellProps="attrDataConf.cellProps"
        :selectionRadioProp="attrDataConf.selectionRadioProp"
        :selectionCheckBoxProp="attrDataConf.selectionCheckBoxProp"
        :clearTreeSelected="clearTreeSelected"
        :confSelectionData="confSelectionData"
        :cellCalculationConfig="cellCalculationConfig"
        :confSelectionItemData="confSelectionItemData"
        @currentCellChange="currentCellChange" />
    </div>
</template>
``` 

```javascript
<script>
export default {
    name:'designReport',
    props:{
        datas:{
            type:Object,
            default(){
                return {
                    attr_data_conf:{
                        reportRef:'myReport',
                        table_config:{
                            rowCount:5,//行数
                            colCount:5,//列数
                            // height:300,//设置高度，垂直方向滚动
                            // width:'1500px',//设置宽度水平方向滚动
                            fixedHeaderCount:0,//头部固定行数
                            fixedLeftCount:0,//左边列固定列数 需要设置width
                            fixedRightCount:0,//右边列固定列数 需要设置width
                            tableData:null,//初始化数据
                        },
                        table_toolbar_data:["tableSet","readOnly","tableHeader","inputArea","calcArea","quote","split","bold","italic","underLine","fontSize","split","color","backgroundColor","textLeft","textCenter","textRight","setHeight","setWidth","textTop","vercicalMiddle","textBottom","split","locked","unlock","tablesetting","upload","splitMiddle","preview","tableValidate","save","share"],
                        toolbar_event:{
                            locked(tableData){
                                console.log('锁定');
                                console.log(tableData)
                            },
                            unlock(tableData){
                                console.log('解锁');
                                console.log(tableData)
                            },
                            upload(tableData){
                                console.log('上传');
                                console.log(tableData)
                            },
                            save(tableData){
                                debugger
                                console.log(JSON.stringify(tableData));
                                console.log('保存');
                                console.log(tableData);
                            },
                            preview(tableData){
                                console.log('预览');
                                console.log(JSON.stringify(tableData));
                            },
                            share(tableData){
                                console.log('分享');
                                console.log(tableData)
                            },
                            tablesetting(tableData){
                                console.log('表格设置');
                                console.log(tableData)
                            },
                            tableValidate(tableData){
                                console.log('表格校验');
                                console.log(tableData)
                            }
                        },
                        inutTreeProps: {//输入方式为树形结构的单元格树的数据prop
                            label: (data,node)=>{
                                return data.name
                            },
                            children: 'zones',
                            isLeaf: (data,node)=>{
                                return node.level > 3
                            }
                        },
                        //维度数据显示label prop
                        dimensionProp:{label:'value'},
                        //指标列表 label prop
                        indicatorListProp:{label:'value'},
                        indrPprops:{//指标树prop
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
                        selectionRadioProp:function(data){
                            return data.name
                        },
                        selectionCheckBoxProp:function(data){
                            return data.name
                        },
                        cellProps:{
                            radio:{
                                label:'name',
                                value:'id'
                            },
                            checkbox:{
                                label:'name',
                                value:'name'
                            },
                            tree:{
                                label:'name',
                                value:'name'
                            }
                        }
                    },
                    event_ele_conf:`{
                        created:function(){

                        },
                        mounted:function(){

                        },
                        inputTypeConfChange:function(cell,data){//输入方式改变时触发
                            if(!cell)return false;
                            let tableData = this.$refs.designReport.getTableData();
                            tableData[cell.row_index][cell.col_index].cell_render_type = data.type.label;
                            if(data.options)tableData[cell.row_index][cell.col_index].cell_options = data.options;
                            this.$refs.designReport.setTableData(tableData);
                            console.log(tableData[cell.row_index][cell.col_index],data);
                        },
                        cellInputContentSet:function(cell,data){//单元格输入内容类型改变时触发
                            if(!cell)return false;
                            let tableData = this.$refs.designReport.getTableData();
                            tableData[cell.row_index][cell.col_index].cell_content_type = data.type.label
                            this.$refs.designReport.setTableData(tableData);
                            console.log(tableData[cell.row_index][cell.col_index],data);
                        },
                        cellBindIndr:function(cell,data){//单元格绑定指标
                            if(!cell)return false;
                            let tableData = this.$refs.designReport.getTableData();
                            tableData[cell.row_index][cell.col_index].cell_indr = data;
                            console.log(tableData[cell.row_index][cell.col_index],data);
                        },
                        loadIndrNode:function(node,resolve){//指标树load方法
                            if (node.level === 0) {
                                return resolve([{id:Math.ceil(Math.random()*100000) + new Date().getTime(), name: 'region' }]);
                            }
                            if (node.level >= 1) setTimeout(() => {
                                const data = [{
                                    id:Math.ceil(Math.random()*100000) + new Date().getTime(),
                                    name: 'leaf123',
                                    leaf: true
                                }, {
                                    id:Math.ceil(Math.random()*100000) + new Date().getTime(),
                                    name: 'zone123'
                                }];
                                return resolve(data);
                            }, 500);
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
                        indrSelectChange:function(data,node,refTree,self){//指标树选择改变时触发
                            //用promise是为了如果此处需要拉接口处理数据，在子组件内需要等接口数据处理完成后才能处理
                            return new Promise((resolve,reject)=>{
                                //实现单选
                                refTree.setCheckedNodes([]);
                                refTree.setCheckedNodes([data]);
                                resolve(data);
                            });
                        },
                        treeLoadNode:function(node,resolve){//输入方式为树形结构时，树的load方法
                            let cruuentCell = this.$refs.designReport.getCurrentActiveCell()
                            if(node.level == 0){
                                resolve([cruuentCell.cell_options])
                            }else{
                                window.setTimeout(()=>{
                                resolve([{id:node.data.id + '01',name:'aaaab'},{id:node.data.id + '02',name:'bbbc'}])
                                },500);
                            }
                        },
                        indrTreeSelectedResChange:function(treeVm,cellId){//树形数据结构输入方式的单元格树选中结果改变时触发
                            let selKeys = treeVm.getCheckedKeys();
                            let selDatas = treeVm.getCheckedNodes();
                            let cellValue = [];
                            selDatas.forEach(item => {
                                cellValue.push(item[this.attrDataConf.cellProps.tree.value])
                            });
                            let currentCell = this.$refs.designReport.getCurrentActiveCell();
                            let tableData = this.$refs.designReport.getTableData();
                            tableData[currentCell.row_index][currentCell.col_index].cell_value = cellValue
                            this.$set(this.$refs.designReport,'tableData',tableData);
                        },
                        clearTreeSelected:function(treeVm,cellId){//清空树形结构所选的数据
                            let tableData = this.$refs.designReport.getTableData();
                            let currentCell = this.$refs.designReport.getCurrentActiveCell();
                            tableData[currentCell.row_index][currentCell.col_index].cell_value = '';
                            this.$refs.designReport.setTableData(tableData);
                        },
                        currentCellChange:function(cell){//当前单元格变更时触发
                            console.log(cell);
                        },
                        confSelectionData:function(resolve){//输入方式选项配置
                            let data = [
                                {
                                    id:'01',
                                    name:'性别1',
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
                        },
                        confSelectionItemData:function(resolve,val){//输入方式为单选或多选时 根据选项类别获取选项数据
                            resolve(val.data);
                        },
                        cellCalculationConfig:function(){
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
                        },
                        destroyed:function(){

                        }
                    }`,
                    cmpt_class:[],
                    cmpt_style:{},
                    intf_eName_conf:[
                    ],
                    intf:{
                        
                    },
                    cross_parameter_name: '',
                }
            }
        }
    },
    data(){
        return {
            attrDataConf:{}
        }
    },
    created(){
        if(typeof(this.datas.attr_data_conf) == 'string'){
            this.attrDataConf = new Function(`return ${this.datas.attr_data_conf}`)()
        }else{
            this.attrDataConf = this.datas.attr_data_conf
        }
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        let defaultEvts = ["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed",];
        Object.keys(extraMethods).forEach(key => {
            if(!defaultEvts.includes(key)){
                this[key] = extraMethods[key].bind(this);
            }
        });
        if(extraMethods.created){
            extraMethods.created.bind(this)();
        }
    },
    mounted(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.mounted){
            extraMethods.mounted.bind(this)();
        }
    },
    destroyed(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.destroyed){
            extraMethods.destroyed.bind(this)();
        }
    }
}
</script>
```

> 报表填报

![报表填报效果图](https://raw.githubusercontent.com/HelloWoed/vue-report/master/static/images/fill.png)

```html
<template>
    <div class="atoname" :class="datas.cmpt_class || []" :style="datas.cmpt_style || {}">
        <edit-table 
        ref="fillReport"
        :tableConfig="attrDataConf.table_config"
        :treeLoadNode="fillTreeLoadNode"
        :cellValidate="cellValidate"
        :treeProps="attrDataConf.inutTreeProps"
        :treeSelectedResChange="fillTreeSelectedResChange"
        :clearTreeSelected="clearFillTeeSelected"
        :cellProps="attrDataConf.cellProps"
        @save="saveTable"
        @reset="resetTable">
            <div class="reportTitle" slot="title" v-html="attrDataConf.table_title"></div>
        </edit-table>
    </div>
</template>
```

```javascript
<script>
export default {
    name:'FillReport',
    props:{
        datas:{
            type:Object,
            default(){
                return {
                    attr_data_conf:{
                        table_config:{
                            rowCount:5,//行数
                            colCount:5,//列数
                            // height:300,//设置高度，垂直方向滚动
                            // width:'1500px',//设置宽度水平方向滚动
                            fixedHeaderCount:0,//头部固定行数
                            fixedLeftCount:0,//左边列固定列数 需要设置width
                            fixedRightCount:0,//右边列固定列数 需要设置width
                            tableData:[[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-row-header","cell_id":"78afc06cc2b244b58a1f4e008ae5cd0e","cell_style":{"width":"60px","background":"#fff"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"bb02cbbc901c4242b6b71aa62a81e3c6","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"08e9cbb3240345ec9765fab138d0d878","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"fc851e751bfe444f98197aa96949ea58","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"7404782ce4eb476eaf59bca92c12f318","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"69f9871054654c238e1a321918fad5db","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"d8ccf6771aa149a49cee3cc808f78b34","cell_style":{"width":"60px"}},{"cell_value":"姓名","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"685edbf7963149519bc6bb19b82c7149","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"row_index":1,"col_index":1,"area_type":"readOnly"},{"cell_value":"性别","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d06ec70129f9494f88a0cc2cd36df9ed","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":2},{"cell_value":"年龄","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"07773687e40e4e418d91f1f29ec43185","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":3},{"cell_value":"籍贯","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"048e5fcdf8e64ef48004b798d918845b","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":4},{"cell_value":"学历","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d8789a6a321a4c76aaf44f4caec8999d","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"8a1f766540a84a8f8075f7a3d251a705","cell_style":{"width":"60px"}},{"cell_value":"固定值","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"fixed","cell_type":"cell","cell_id":"419a305e7b7f4e49b6e687483209f1f5","cell_style":{"width":"200px"},"row_index":2,"col_index":1},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"radio","cell_type":"cell","cell_id":"2c56456d8c404d98a6ce0f91090c9631","cell_style":{"width":"200px"},"row_index":2,"col_index":2,"cell_options":[{"id":"011","name":"男性"},{"id":"012","name":"女性"}]},{"cell_value":"18","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d500740a069e462ba60e5d9279debd06","cell_style":{"width":"200px"},"row_index":2,"col_index":3},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"tree","cell_type":"cell","cell_id":"a3c09872b6994763a2829b8f352285ad","cell_style":{"width":"200px"},"row_index":2,"col_index":4,"cell_options":{"id":"001","name":"全国"}},{"cell_value":[],"cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"checkbox","cell_type":"cell","cell_id":"fcc3d8ababa3454a903e998dc200dd50","cell_style":{"width":"200px"},"row_index":2,"col_index":5,"cell_options":[{"id":"021","name":"一班"},{"id":"022","name":"二班"},{"id":"023","name":"三班"}]}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"6312a5c6620246b7a0b5eb252f47130a","cell_style":{"width":"60px","height":"44px"}},{"cell_value":"粗体","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"36edd7de109944eeb3a6d8f2235469ff","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontWeight":"bold","height":"44px"},"row_index":3,"col_index":1},{"cell_value":"斜体","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7ffb518d586748738a5174b5f0e69798","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontStyle":"italic"},"row_index":3,"col_index":2},{"cell_value":"下划线","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"9a8c54a2b06a47b4836ddf5d236958e4","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","textDecoration":"underline"},"row_index":3,"col_index":3},{"cell_value":"字体大小","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d87f99473ab54e05acf7fb429046a9f1","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontSize":"22px"},"row_index":3,"col_index":4},{"cell_value":"字体颜色","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"ebefc4d268d940858798adae20d14249","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","color":"rgba(195, 0, 255, 1)","height":"44px"},"row_index":3,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"a38a0a356ae344c79b96cb513529f3c0","cell_style":{"width":"60px","height":"50px"}},{"cell_value":"左上对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c82a83b06c734d37a568bd8b514493db","cell_style":{"width":"200px","height":"50px"},"row_index":4,"col_index":1},{"cell_value":"左中对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"06f8697866484ec4af69fa9ed7336f77","cell_style":{"width":"200px"},"row_index":4,"col_index":2},{"cell_value":"左下对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7080821b1d21498a81c8368477e0b50b","cell_style":{"width":"200px","verticalAlign":"bottom"},"row_index":4,"col_index":3},{"cell_value":"居中","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c1027c8bd272496296ba2c1566f577ed","cell_style":{"width":"200px","textAlign":"center"},"row_index":4,"col_index":4},{"cell_value":"右对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"e8f58cc8fd694724b25bcb3603678dee","cell_style":{"width":"200px","height":"50px","textAlign":"right"},"row_index":4,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"d7efa541bbba4d0b886a91008c21ca7f","cell_style":{"width":"60px","height":"52px"}},{"cell_value":"呼啦啦","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"9bed587d6f794bdf9664860ea3b97ff6","cell_style":{"width":"200px","backgroundColor":"#DBE5F1","height":"52px"},"row_index":5,"col_index":1,"area_type":"quote"},{"cell_value":"哇哈哈","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"1dd2dae5891f4e72bd286e0f70617d44","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"row_index":5,"col_index":2,"area_type":"quote"},{"cell_value":"哎呀呀","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"5061937a862341f7b10c1be92b0143bc","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"area_type":"quote","row_index":5,"col_index":3},{"cell_value":"咔嚓嚓","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"8849ebc198b349d8aa75d7f975cdea8e","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"row_index":5,"col_index":4,"area_type":"quote"},{"cell_value":"过家家","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"47e1a6cfe8fe4dd7b2e441313c9475ab","cell_style":{"width":"200px","backgroundColor":"#DBE5F1","height":"52px"},"area_type":"quote","row_index":5,"col_index":5}]]
                        },
                        table_title:'<div style="padding:15px 0;font-weight:bold;">填报测试表格1</div>',
                        inutTreeProps: {//输入方式为树形结构的单元格树的数据prop
                            label: (data,node)=>{
                                return data.name
                            },
                            children: 'zones',
                            isLeaf: (data,node)=>{
                                return node.level > 3
                            }
                        },
                        cellProps:{//单元格prop
                            radio:{
                                label:'name',
                                value:'id'
                            },
                            checkbox:{
                                label:'name',
                                value:'name'
                            },
                            tree:{
                                label:'name',
                                value:'name'
                            }
                        }
                    },
                    event_ele_conf:`{
                        created:function(){

                        },
                        mounted:function(){

                        },
                        fillTreeLoadNode:function(node,resolve){//树形结构load方法
                            if(node.level == 0){
                                resolve([{id:'001',name:'全国'}])
                            }else{
                                window.setTimeout(()=>{
                                    resolve([{id:node.data.id + '01',name:'aaaa'},{id:node.data.id + '02',name:'bbb'}])
                                },500);
                            }
                        },
                        fillTreeSelectedResChange:function(treeVm,cellId){//树形结构选中结果回调
                            let selKeys = treeVm.getCheckedKeys();
                            let selDatas = treeVm.getCheckedNodes();
                            let cellValue = [];
                            selDatas.forEach(item => {
                                cellValue.push(item[this.attrDataConf.cellProps.tree.value])
                            });
                            let currentCell = this.$refs.fillReport.getCurrentActiveCell();
                            let tableData = this.$refs.fillReport.getTableData();
                            tableData[currentCell.row_index][currentCell.col_index].cell_value = cellValue.join(',');
                            this.$set(this.editTableDataConf,'tableData',tableData);
                        },
                        clearFillTeeSelected:function(treeVm,cellId){//树形结构清除选中结果回调
                            let tableData = this.$refs.fillReport.getTableData();
                            let currentCell = this.$refs.fillReport.getCurrentActiveCell();
                            tableData[currentCell.row_index][currentCell.col_index].cell_value = '';
                            this.$set(this.editTableDataConf,'tableData',tableData);
                        },
                        saveTable:function(data){//保存
                            console.log(JSON.stringify(data));
                            console.log('保存');
                        },
                        resetTable:function(data){//重置已填写单元格内容
                            console.log(data)
                        },
                        cellValidate:function(resolve,cellData){
                            //单元格数据校验处理
                        },
                        destroyed:function(){

                        }
                    }`,
                    cmpt_class:[],
                    cmpt_style:{},
                    intf_eName_conf:[
                    ],
                    intf:{
                        
                    },
                    cross_parameter_name: '',
                }
            }
        }
    },
    data(){
        return {attrDataConf:{}}
    },
    created(){
        if(typeof(this.datas.attr_data_conf) == 'string'){
            this.attrDataConf = new Function(`return ${this.datas.attr_data_conf}`)()
        }else{
            this.attrDataConf = this.datas.attr_data_conf
        }
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        let defaultEvts = ["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed",];
        Object.keys(extraMethods).forEach(key => {
            if(!defaultEvts.includes(key)){
                this[key] = extraMethods[key].bind(this);
            }
        });
        if(extraMethods.created){
            extraMethods.created.bind(this)();
        }
    },
    mounted(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.mounted){
            extraMethods.mounted.bind(this)();
        }
        
    },
    destroyed(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.destroyed){
            extraMethods.destroyed.bind(this)();
        }
    }
}
</script>
```

> 报表展示 

![报表展示效果图](https://raw.githubusercontent.com/HelloWoed/vue-report/master/static/images/show.png)

```html
<template>
    <div class="atoname" :class="datas.cmpt_class || []" :style="datas.cmpt_style || {}">
        <div class="testBtn">
            <el-button @click="testEvent">默认按钮</el-button>
        </div>
         <show-table 
            :showRowNumber="attrDataConf.showRowNumber"
            :showColNumber="attrDataConf.showColNumber"
            :tableConfig="attrDataConf.tableDataConf">
            <div slot="title" v-html="attrDataConf.table_title"></div>
        </show-table>
    </div>
</template>
```

```javascript
<script>
export default {
    props:{
        datas:{
            type:Object,
            default(){
                return {
                    attr_data_conf:{
                        table_title:'<div style="padding:15px 0;font-weight:bold;">展示测试表格11</div>',
                        showRowNumber:false,//是否显示行号 false 时 行高不生效
                        showColNumber:false,//是否显示列头
                        tableDataConf:{
                            rowCount:5,//行数
                            colCount:5,//列数
                            // height:300,//设置高度，垂直方向滚动
                            // width:'1500px',//设置宽度水平方向滚动
                            fixedHeaderCount:0,//头部固定行数
                            fixedLeftCount:0,//左边列固定列数 需要设置width
                            fixedRightCount:0,//右边列固定列数 需要设置width
                            tableData:[[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-row-header","cell_id":"78afc06cc2b244b58a1f4e008ae5cd0e","cell_style":{"width":"60px","background":"#fff"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"bb02cbbc901c4242b6b71aa62a81e3c6","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"08e9cbb3240345ec9765fab138d0d878","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"fc851e751bfe444f98197aa96949ea58","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"7404782ce4eb476eaf59bca92c12f318","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"69f9871054654c238e1a321918fad5db","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"d8ccf6771aa149a49cee3cc808f78b34","cell_style":{"width":"60px"}},{"cell_value":"姓名","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"685edbf7963149519bc6bb19b82c7149","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"row_index":1,"col_index":1,"area_type":"readOnly"},{"cell_value":"性别","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d06ec70129f9494f88a0cc2cd36df9ed","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":2},{"cell_value":"年龄","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"07773687e40e4e418d91f1f29ec43185","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":3},{"cell_value":"籍贯","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"048e5fcdf8e64ef48004b798d918845b","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":4},{"cell_value":"学历","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d8789a6a321a4c76aaf44f4caec8999d","cell_style":{"width":"200px","backgroundColor":"#5A5A5A","textAlign":"center","fontWeight":"bold","color":"rgba(0, 255, 238, 1)"},"area_type":"readOnly","row_index":1,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"8a1f766540a84a8f8075f7a3d251a705","cell_style":{"width":"60px"}},{"cell_value":"固定值","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"fixed","cell_type":"cell","cell_id":"419a305e7b7f4e49b6e687483209f1f5","cell_style":{"width":"200px"},"row_index":2,"col_index":1},{"cell_value":"011","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"radio","cell_type":"cell","cell_id":"2c56456d8c404d98a6ce0f91090c9631","cell_style":{"width":"200px"},"row_index":2,"col_index":2,"cell_options":[{"id":"011","name":"男性"},{"id":"012","name":"女性"}]},{"cell_value":"19","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d500740a069e462ba60e5d9279debd06","cell_style":{"width":"200px"},"row_index":2,"col_index":3},{"cell_value":"全国,aaaa,bbb","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"tree","cell_type":"cell","cell_id":"a3c09872b6994763a2829b8f352285ad","cell_style":{"width":"200px"},"row_index":2,"col_index":4,"cell_options":{"id":"001","name":"全国"}},{"cell_value":["一班","二班"],"cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"checkbox","cell_type":"cell","cell_id":"fcc3d8ababa3454a903e998dc200dd50","cell_style":{"width":"200px"},"row_index":2,"col_index":5,"cell_options":[{"id":"021","name":"一班"},{"id":"022","name":"二班"},{"id":"023","name":"三班"}]}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"6312a5c6620246b7a0b5eb252f47130a","cell_style":{"width":"60px","height":"44px"}},{"cell_value":"粗体","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"36edd7de109944eeb3a6d8f2235469ff","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontWeight":"bold","height":"44px"},"row_index":3,"col_index":1},{"cell_value":"斜体","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7ffb518d586748738a5174b5f0e69798","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontStyle":"italic"},"row_index":3,"col_index":2},{"cell_value":"下划线","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"9a8c54a2b06a47b4836ddf5d236958e4","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","textDecoration":"underline"},"row_index":3,"col_index":3},{"cell_value":"字体大小","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d87f99473ab54e05acf7fb429046a9f1","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","fontSize":"22px"},"row_index":3,"col_index":4},{"cell_value":"字体颜色","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"ebefc4d268d940858798adae20d14249","cell_style":{"width":"200px","backgroundColor":"rgba(32, 154, 241, 1)","color":"rgba(195, 0, 255, 1)","height":"44px"},"row_index":3,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"a38a0a356ae344c79b96cb513529f3c0","cell_style":{"width":"60px","height":"50px"}},{"cell_value":"左上对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c82a83b06c734d37a568bd8b514493db","cell_style":{"width":"200px","height":"50px"},"row_index":4,"col_index":1},{"cell_value":"左中对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"06f8697866484ec4af69fa9ed7336f77","cell_style":{"width":"200px"},"row_index":4,"col_index":2},{"cell_value":"左下对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7080821b1d21498a81c8368477e0b50b","cell_style":{"width":"200px","verticalAlign":"bottom"},"row_index":4,"col_index":3},{"cell_value":"居中","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c1027c8bd272496296ba2c1566f577ed","cell_style":{"width":"200px","textAlign":"center"},"row_index":4,"col_index":4},{"cell_value":"右对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"e8f58cc8fd694724b25bcb3603678dee","cell_style":{"width":"200px","height":"50px","textAlign":"right"},"row_index":4,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"d7efa541bbba4d0b886a91008c21ca7f","cell_style":{"width":"60px","height":"52px"}},{"cell_value":"呼啦啦","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"9bed587d6f794bdf9664860ea3b97ff6","cell_style":{"width":"200px","backgroundColor":"#DBE5F1","height":"52px"},"row_index":5,"col_index":1,"area_type":"quote"},{"cell_value":"哇哈哈","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"1dd2dae5891f4e72bd286e0f70617d44","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"row_index":5,"col_index":2,"area_type":"quote"},{"cell_value":"哎呀呀","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"5061937a862341f7b10c1be92b0143bc","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"area_type":"quote","row_index":5,"col_index":3},{"cell_value":"咔嚓嚓","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"8849ebc198b349d8aa75d7f975cdea8e","cell_style":{"width":"200px","backgroundColor":"#DBE5F1"},"row_index":5,"col_index":4,"area_type":"quote"},{"cell_value":"过家家","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"47e1a6cfe8fe4dd7b2e441313c9475ab","cell_style":{"width":"200px","backgroundColor":"#DBE5F1","height":"52px"},"area_type":"quote","row_index":5,"col_index":5}]]
                        }
                    },
                    event_ele_conf:`{
                        created:function(){

                        },
                        mounted:function(){

                        },
                        destroyed:function(){

                        }
                    }`,
                    cmpt_class:[],
                    cmpt_style:{},
                    intf_eName_conf:[
                    ],
                    intf:{
                        
                    },
                    cross_parameter_name: '',
                }
            }
        }
    },
    data(){
        return {
            attrDataConf:{}
        }
    },
    created(){
        if(typeof(this.datas.attr_data_conf) == 'string'){
            this.attrDataConf = new Function(`return ${this.datas.attr_data_conf}`)()
        }else{
            this.attrDataConf = this.datas.attr_data_conf
        }
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        let defaultEvts = ["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed",];
        Object.keys(extraMethods).forEach(key => {
            if(!defaultEvts.includes(key)){
                this[key] = extraMethods[key].bind(this);
            }
        });
        if(extraMethods.created){
            extraMethods.created.bind(this)();
        }
    },
    mounted(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.mounted){
            extraMethods.mounted.bind(this)();
        }
        
    },
    methods:{
        testEvent(){
            this.attrDataConf.tableDataConf.tableData = [];
            console.log(this.attrDataConf)
        }
    },
    destroyed(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.destroyed){
            extraMethods.destroyed.bind(this)();
        }
    }
}
</script>
```

> 公式编辑器

![公式编辑效果图](https://raw.githubusercontent.com/HelloWoed/vue-report/master/static/images/calc.png)

```html
<template>
    <div class="atoname" :class="datas.cmpt_class || []" :style="datas.cmpt_style || {}">
        <indr-calculation 
        @complete="completeCalculation"
        :getIndrDatas="getIndrDatas"
        :indrSelectChange="indrSelectChange"
        :dimensionData="dimensionData"
        :loadIndrNode="loadIndrNode"
        :symbolData="getSymbolData"
        :existFuns="getExistFuns"
        :calcIndrSelectChange="calcIndrSelectChange"
        :parseCalcBoardLabel="parseCalcBoardLabel"
        :dimensionProp="attrDataConf.dimensionProp"
        :dividerOption="attrDataConf.dividerOption"
        :indicatorListProp="attrDataConf.indicatorListProp"
        :calcSymbolProp="attrDataConf.calcSymbolProp"
        :existFunProp="attrDataConf.existFunProp"
        :prop="attrDataConf.indrProp" />
    </div>
</template>
```

```javascript
<script>
export default {
    props:{
        datas:{
            type:Object,
            default(){
                return {
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
                    event_ele_conf:`{
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
                    }`,
                    cmpt_class:[],
                    cmpt_style:{},
                    intf_eName_conf:[

                    ],
                    intf:{
                        
                    },
                    cross_parameter_name: '',
                }
            }
        }
    },
    data(){
        return {
            attrDataConf:{}
        }
    },
    created(){
        if(typeof(this.datas.attr_data_conf) == 'string'){
            this.attrDataConf = new Function(`return ${this.datas.attr_data_conf}`)()
        }else{
            this.attrDataConf = this.datas.attr_data_conf
        }
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        let defaultEvts = ["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed",];
        Object.keys(extraMethods).forEach(key => {
            if(!defaultEvts.includes(key)){
                this[key] = extraMethods[key].bind(this);
            }
        });
        if(extraMethods.created){
            extraMethods.created.bind(this)();
        }
    },
    mounted(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.mounted){
            extraMethods.mounted.bind(this)();
        }      
    },
    destroyed(){
        let extraMethods = new Function(`return ${this.datas.event_ele_conf}`)();
        if(extraMethods.destroyed){
            extraMethods.destroyed.bind(this)();
        }
    }
}
</script>
```
