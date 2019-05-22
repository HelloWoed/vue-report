# vue-element-excel

> 此插件 使用vue 基于element-ui，样式使用less语法，使用前应确保相关依赖已安装

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
```html
<vue-excel />
```
## 也可以 传入参数  
```html
<vue-excel :attr_data_conf="{rowCount:20,colCount:8,state:'design'}" />
```
```javascript
attr_data_conf={
    rowCount:20,//初始化excel行数
    colCount:8,//初始化excel列数
    state:'design',//设计状态：design；编辑（填报）状态：edit;展示状态：view
}
```
## 实例
> template 部分
```html
<template>
  <div class="hello">
    <p>
      <el-button type="primary" round @click="tabeStateChange('design')">设计</el-button>
      <el-button type="warning" round @click="tabeStateChange('edit')">填报</el-button>
      <el-button type="success" round @click="tabeStateChange('show')">展示</el-button>
      <el-button round @click="tabeStateChange('calc')">计算公式</el-button>
    </p>
    <!-- design table -->
    <p v-if="showTableState == 'design'">
      <vue-excel 
      ref="designExcel"
      :toolbarEvent="toolbarEvent"
      :tableConfig="tableConfig"
      :inputTypeConfChange="inputTypeConfChange"
      :cellInputContentSet="cellInputContentSet"
      :cellBindIndr="cellBindIndr"
      :treeLoadNode="treeLoadNode"
      :treeProps="treeProps"
      :treeSelectedResChange="treeSelectedResChange"
      :cellProps="cellProps"
      :clearTreeSelected="clearTreeSelected"
      @currentCellChange="currentCellChange" />
    </p>
    
    <!-- edit table -->
    <p v-if="showTableState == 'edit'">
      <edit-table 
      ref="editExcel"
      :tableConfig="editTableDataConf" 
      :treeLoadNode="editTreeLoadNode"
      :treeProps="treeProps"
      :treeSelectedResChange="editTreeSelectedResChange"
      :clearTreeSelected="clearEditTeeSelected"
      :cellProps="cellProps"
      @save="saveTable"
      @reset="resetTable"
      :title="'填报测试表格1'" />
    </p>
    
    <!-- show table -->
    <p v-if="showTableState == 'show'">
      <show-table 
      :showRowNumber="false"
      :showColNumber="false"
      :tableDataConf="showTableDataConf">
        <p slot="title">展示测试表格1</p>
      </show-table>
    </p>
    <!-- 公式 -->
    <p v-if="showTableState == 'calc'">
      <indr-calculation 
      @complete="completeCalculation"
      :getIndrDatas="calculationConf.getIndrDatas"
      :indrSelectChange="calculationConf.indrSelectChange"
      :dimensionData="calculationConf.dimensionData"
      :loadIndrNode="calculationConf.loadIndrNode"
      :symbolData="calculationConf.symbolData"
      :existFuns="calculationConf.existFuns"
      :prop="calculationConf.indrProp" />
    </p>
    <!-- <vue-excel /> -->
    <!-- <vue-excel :attr_data_conf="{rowCount:20,colCount:8,state:'design'}" /> -->
    <!-- <Excel /> -->
    <!-- <vue-element-less-excel /> -->
  </div>
</template>
```
> javascript 部分
```javascript
import Excel from '@/lib/components/design/excelReport'
const defaultLoadIndr = function(node, resolve){
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
}
export default {
  name: 'HelloWorld',
  data () {
    return {
      showTableState:'design',
      tableConfig:{
        rowCount:4,//行数
        colCount:3,//列数
        state:'design',//设计状态：design；编辑（填报）状态：edit;展示状态：view; 默认为设计状态 design
      },
      editTableDataConf:{
        rowCount:3,
        colCount:2,
        // tableData: [[{"value":"","rowspan":1,"colspan":1,"type":"cell-col-row-header","cell_id":"d479560872db4ff6b58364071ab76ff6","style":{}},{"value":"A","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"50d72b00983a423db83a407f1bd4d9dd","style":{}},{"value":"B","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"098a24b73fb24e2fb2704abbaffc9f59","style":{}},{"value":"C","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"5792273dd0924825b5c607cc453e4afe","style":{}},{"value":"D","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"77c875c4b51044b18cfebf3a38bb121c","style":{}},{"value":"E","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"f964a5baaea44765968686a212ffd0a9","style":{}}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"301048708bac48969ac550fbeca3cac8","style":{}},{"value":"1","rowspan":1,"colspan":1,"type":"cell","cell_id":"38ff774367544f579e3a12a792d4be73","style":{"fontWeight":"bold"},"row_index":1,"col_index":1},{"value":2,"rowspan":1,"colspan":1,"type":"cell","cell_id":"3270e4ed788048eb8e17d6503d8b25f0","style":{"fontStyle":"italic","textDecoration":"underline"},"row_index":1,"col_index":2},{"value":3,"rowspan":1,"colspan":1,"type":"cell","cell_id":"7cd34541b7974b58af968b0d4758f4cb","style":{"color":"rgba(203, 64, 14, 1)","backgroundColor":"rgba(80, 156, 13, 1)"},"row_index":1,"col_index":3},{"value":4,"rowspan":1,"colspan":1,"type":"cell","cell_id":"399a921508634e20ab0fb9a26677b528","style":{"fontStyle":"italic"},"row_index":1,"col_index":4},{"value":5,"rowspan":1,"colspan":1,"type":"cell","cell_id":"003e559e413745aab8901a409b5454a3","style":{"textAlign":"center"},"row_index":1,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"922cb7b5d3a8422faba63eef18ee5c97","style":{}},{"value":"a","rowspan":1,"colspan":1,"type":"cell","cell_id":"9682bd6e157c41cfa0d0d59537088ec5","style":{},"row_index":2,"col_index":1},{"value":"b","rowspan":1,"colspan":1,"type":"cell","cell_id":"4e2fa15d85ff4a37b3fa60228b570e72","style":{},"row_index":2,"col_index":2},{"value":"c","rowspan":1,"colspan":1,"type":"cell","cell_id":"7865274e48cd4d89967c80ca1acc87e4","style":{},"row_index":2,"col_index":3},{"value":"d","rowspan":1,"colspan":1,"type":"cell","cell_id":"50a074050a1c4916b660871efa75e395","style":{},"row_index":2,"col_index":4},{"value":"e","rowspan":1,"colspan":1,"type":"cell","cell_id":"9ee5f7f30c9648dc950be2eacd890ba0","style":{"textAlign":"right"},"row_index":2,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"42cc6e361d744a6098460fba644e36d0","style":{}},{"value":"asdf ","rowspan":1,"colspan":1,"type":"cell","cell_id":"eb685aa75fb4409e8e056ab76585d9c4","style":{"fontStyle":"italic"},"row_index":3,"col_index":1},{"value":"asdfasd adsf","rowspan":1,"colspan":1,"type":"cell","cell_id":"4dc74af27b4b4fcaa647d7ef14741fee","style":{},"row_index":3,"col_index":2},{"value":"股市大幅改善","rowspan":1,"colspan":1,"type":"cell","cell_id":"8f26b28082a94833a98ffb471ffd2b44","style":{},"row_index":3,"col_index":3},{"value":"啊手动阀","rowspan":1,"colspan":1,"type":"cell","cell_id":"bb837db493534414ac32c9cf43181c08","style":{},"row_index":3,"col_index":4},{"value":"啊手动阀手动","rowspan":1,"colspan":1,"type":"cell","cell_id":"b09720dd88be4b9483722ee057a3e4ae","style":{},"row_index":3,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"58d1e4eb8c764024a8f17eaee5929bca","style":{}},{"value":"额达","rowspan":1,"colspan":1,"type":"cell","cell_id":"1eae7d5cbe5a4bf5be68dfd0a7b88aab","style":{},"row_index":4,"col_index":1},{"value":"国的皇帝","rowspan":1,"colspan":1,"type":"cell","cell_id":"f48ead50a78647d4859e87a258ba2e8b","style":{"color":"rgba(14, 30, 203, 1)"},"row_index":4,"col_index":2},{"value":"地方很多","rowspan":1,"colspan":1,"type":"cell","cell_id":"b1bdfad5cb9c4de996ebab603d992ccd","style":{"backgroundColor":"rgba(156, 32, 13, 1)"},"row_index":4,"col_index":3},{"value":"的风格和的","rowspan":1,"colspan":1,"type":"cell","cell_id":"77ae60479db34e1fa81bd43e88a55338","style":{"backgroundColor":"rgba(217, 206, 204, 1)"},"row_index":4,"col_index":4},{"value":"了很久","rowspan":1,"colspan":1,"type":"cell","cell_id":"586ef462525d4ce9a784f3faa7e801f6","style":{"color":"rgba(219, 15, 238, 1)"},"row_index":4,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"400ee23d4d334c8eb28786d8a4ddd4b6","style":{}},{"value":"法国和","rowspan":1,"colspan":1,"type":"cell","cell_id":"9c8c6fb2a5cd4db78b641ce306b6e685","style":{"fontStyle":"italic"},"row_index":5,"col_index":1},{"value":"的风格和","rowspan":1,"colspan":1,"type":"cell","cell_id":"6b0f884131ef48ca90f1b1188f4166b5","style":{"fontWeight":"bold"},"row_index":5,"col_index":2},{"value":"的风格和的风","rowspan":1,"colspan":1,"type":"cell","cell_id":"d61509017c6643f2a3b1f4c6b7fdffdd","style":{"textDecoration":"underline"},"row_index":5,"col_index":3},{"value":"v宝宝v你","rowspan":1,"colspan":1,"type":"cell","cell_id":"60316a093720418fb65b05bcfaba0200","style":{},"row_index":5,"col_index":4},{"value":"与i","rowspan":1,"colspan":1,"type":"cell","cell_id":"f57a2855daab43c9a401c615edcbb26b","style":{},"row_index":5,"col_index":5}]]
        tableData: [[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-row-header","cell_id":"b3ccbd64ee4d4fe5b6677a9393dde7f4","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"c5e1a2a470174f7f9fa67161cd282084","cell_style":{},"value":"A"},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"be075c5e420048ca977fab898f3c6e71","cell_style":{},"value":"B"}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"fd53c82ffd4342b7a4134814824ac188","cell_style":{}},{"cell_value":"text","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"1bd6d6a814fc416c85e6e1a632d0fa62","cell_style":{},"row_index":1,"col_index":1},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"radio","cell_type":"cell","cell_id":"a71a52eb0db94ff7af7ac9c5bb96e45e","cell_style":{},"row_index":1,"col_index":2,"cell_options":[{"id":"011","name":"男性"},{"id":"012","name":"女性"}]}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"4b84e70258574a8da11ee20ae8e496de","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"checkbox","cell_type":"cell","cell_id":"17c757201b1a4f658212f8c676c6ed39","cell_style":{},"row_index":2,"col_index":1,"cell_options":[{"id":"021","name":"一班"},{"id":"022","name":"二班"},{"id":"023","name":"三班"}],"value":[]},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"tree","cell_type":"cell","cell_id":"a9a3382a95794d73a63df1ad751dca04","cell_style":{},"row_index":2,"col_index":2,"cell_options":{"id":"001","name":"全国"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"385cd3fa39c64fe5a8a0c157d073ea1d","cell_style":{}},{"cell_value":"固定值","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"fixed","cell_type":"cell","cell_id":"f2d518cde8434d369e3abfb4d5b5c780","cell_style":{},"row_index":3,"col_index":1},{"cell_value":"text","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"59891a86594f4bcd8e20356b5901d8bc","cell_style":{},"row_index":3,"col_index":2}]]
      },
      showTableDataConf:{
        rowCount:5,
        colCount:5,
        tableData: [[{"value":"","rowspan":1,"colspan":1,"type":"cell-col-row-header","cell_id":"d479560872db4ff6b58364071ab76ff6","style":{}},{"value":"A","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"50d72b00983a423db83a407f1bd4d9dd","style":{}},{"value":"B","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"098a24b73fb24e2fb2704abbaffc9f59","style":{}},{"value":"C","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"5792273dd0924825b5c607cc453e4afe","style":{}},{"value":"D","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"77c875c4b51044b18cfebf3a38bb121c","style":{}},{"value":"E","rowspan":1,"colspan":1,"type":"cell-col-header","cell_id":"f964a5baaea44765968686a212ffd0a9","style":{}}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"301048708bac48969ac550fbeca3cac8","style":{}},{"value":"1","rowspan":1,"colspan":1,"type":"cell","cell_id":"38ff774367544f579e3a12a792d4be73","style":{"fontWeight":"bold"},"row_index":1,"col_index":1},{"value":2,"rowspan":1,"colspan":1,"type":"cell","cell_id":"3270e4ed788048eb8e17d6503d8b25f0","style":{"fontStyle":"italic","textDecoration":"underline"},"row_index":1,"col_index":2},{"value":3,"rowspan":1,"colspan":1,"type":"cell","cell_id":"7cd34541b7974b58af968b0d4758f4cb","style":{"color":"rgba(203, 64, 14, 1)","backgroundColor":"rgba(80, 156, 13, 1)"},"row_index":1,"col_index":3},{"value":4,"rowspan":1,"colspan":1,"type":"cell","cell_id":"399a921508634e20ab0fb9a26677b528","style":{"fontStyle":"italic"},"row_index":1,"col_index":4},{"value":5,"rowspan":1,"colspan":1,"type":"cell","cell_id":"003e559e413745aab8901a409b5454a3","style":{"textAlign":"center"},"row_index":1,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"922cb7b5d3a8422faba63eef18ee5c97","style":{}},{"value":"a","rowspan":1,"colspan":1,"type":"cell","cell_id":"9682bd6e157c41cfa0d0d59537088ec5","style":{},"row_index":2,"col_index":1},{"value":"b","rowspan":1,"colspan":1,"type":"cell","cell_id":"4e2fa15d85ff4a37b3fa60228b570e72","style":{},"row_index":2,"col_index":2},{"value":"c","rowspan":1,"colspan":1,"type":"cell","cell_id":"7865274e48cd4d89967c80ca1acc87e4","style":{},"row_index":2,"col_index":3},{"value":"d","rowspan":1,"colspan":1,"type":"cell","cell_id":"50a074050a1c4916b660871efa75e395","style":{},"row_index":2,"col_index":4},{"value":"e","rowspan":1,"colspan":1,"type":"cell","cell_id":"9ee5f7f30c9648dc950be2eacd890ba0","style":{"textAlign":"right"},"row_index":2,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"42cc6e361d744a6098460fba644e36d0","style":{}},{"value":"asdf ","rowspan":1,"colspan":1,"type":"cell","cell_id":"eb685aa75fb4409e8e056ab76585d9c4","style":{"fontStyle":"italic"},"row_index":3,"col_index":1},{"value":"asdfasd adsf","rowspan":1,"colspan":1,"type":"cell","cell_id":"4dc74af27b4b4fcaa647d7ef14741fee","style":{},"row_index":3,"col_index":2},{"value":"股市大幅改善","rowspan":1,"colspan":1,"type":"cell","cell_id":"8f26b28082a94833a98ffb471ffd2b44","style":{},"row_index":3,"col_index":3},{"value":"啊手动阀","rowspan":1,"colspan":1,"type":"cell","cell_id":"bb837db493534414ac32c9cf43181c08","style":{},"row_index":3,"col_index":4},{"value":"啊手动阀手动","rowspan":1,"colspan":1,"type":"cell","cell_id":"b09720dd88be4b9483722ee057a3e4ae","style":{},"row_index":3,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"58d1e4eb8c764024a8f17eaee5929bca","style":{}},{"value":"额达","rowspan":1,"colspan":1,"type":"cell","cell_id":"1eae7d5cbe5a4bf5be68dfd0a7b88aab","style":{},"row_index":4,"col_index":1},{"value":"国的皇帝","rowspan":1,"colspan":1,"type":"cell","cell_id":"f48ead50a78647d4859e87a258ba2e8b","style":{"color":"rgba(14, 30, 203, 1)"},"row_index":4,"col_index":2},{"value":"地方很多","rowspan":1,"colspan":1,"type":"cell","cell_id":"b1bdfad5cb9c4de996ebab603d992ccd","style":{"backgroundColor":"rgba(156, 32, 13, 1)"},"row_index":4,"col_index":3},{"value":"的风格和的","rowspan":1,"colspan":1,"type":"cell","cell_id":"77ae60479db34e1fa81bd43e88a55338","style":{"backgroundColor":"rgba(217, 206, 204, 1)"},"row_index":4,"col_index":4},{"value":"了很久","rowspan":1,"colspan":1,"type":"cell","cell_id":"586ef462525d4ce9a784f3faa7e801f6","style":{"color":"rgba(219, 15, 238, 1)"},"row_index":4,"col_index":5}],[{"value":"","rowspan":1,"colspan":1,"type":"cell-row-header","cell_id":"400ee23d4d334c8eb28786d8a4ddd4b6","style":{}},{"value":"法国和","rowspan":1,"colspan":1,"type":"cell","cell_id":"9c8c6fb2a5cd4db78b641ce306b6e685","style":{"fontStyle":"italic"},"row_index":5,"col_index":1},{"value":"的风格和","rowspan":1,"colspan":1,"type":"cell","cell_id":"6b0f884131ef48ca90f1b1188f4166b5","style":{"fontWeight":"bold"},"row_index":5,"col_index":2},{"value":"的风格和的风","rowspan":1,"colspan":1,"type":"cell","cell_id":"d61509017c6643f2a3b1f4c6b7fdffdd","style":{"textDecoration":"underline"},"row_index":5,"col_index":3},{"value":"v宝宝v你","rowspan":1,"colspan":1,"type":"cell","cell_id":"60316a093720418fb65b05bcfaba0200","style":{},"row_index":5,"col_index":4},{"value":"与i","rowspan":1,"colspan":1,"type":"cell","cell_id":"f57a2855daab43c9a401c615edcbb26b","style":{},"row_index":5,"col_index":5}]]
      },
      treeProps:{},
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
      },
      calculationConf:{
        indrProp:{
          value:'id',
          label:'value'
        },
        existFuns:[
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
        ],
        symbolData:[
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
        ],
        loadIndrNode(node, resolve){
          defaultLoadIndr(node, resolve);
        },
        dimensionData(data,node,vm){//维度数据
          return [
            {id:'001',value:'维度指标1'},
            {id:'002',value:'维度指标2'},
            {id:'003',value:'维度指标3'},
            {id:'004',value:'维度指标4'},
            {id:'005',value:'维度指标5'},
            {id:'006',value:'维度指标6'},
          ]
        },
        indrSelectChange(data,node,refTree,self){//指标树选择改变时触发
            //用promise是为了如果此处需要拉接口处理数据，在子组件内需要等接口数据处理完成后才能处理
            return new Promise((resolve,reject)=>{
                 //实现单选
                refTree.setCheckedNodes([]);
                refTree.setCheckedNodes([data]);
                resolve(data);
            });
        },
        getIndrDatas(data){//获取指标数据
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
            {id:'011',value:'普通本科生因其他休退学数11'}
          ]
        }
      }
    }
  },
  components:{Excel},
  created(){
    let self = this;
    this.toolbarEvent = {
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
          console.log('保存');
          let editTableDataConf = {
            rowCount:this.attrDataConf.rowCount,
            colCount:this.attrDataConf.colCount,
            tableData:tableData
          }
          self.$set(self,'editTableDataConf',editTableDataConf);
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
    };
    this.treeProps = {
      label: (data,node)=>{
        return data.name
      },
      children: 'zones',
      isLeaf: (data,node)=>{
        return node.level > 3
      }
    };
  },
  mounted(){
    
  },
  methods:{
    completeCalculation(data){
      console.log(data);
      let res = '';
      data.forEach(item=>{
        item.type == 'indr' ? res += item.id : res += item.value;
      });
      console.log(`your calculations is : ${res}`);
    },
    clearTreeSelected(treeVm,cellId){
      let tableData = this.$refs.designExcel.getTableData();
      let currentCell = this.$refs.designExcel.getCurrentActiveCell();
      tableData[currentCell.row_index][currentCell.col_index].cell_value = '';
      this.$refs.designExcel.setTableData(tableData);
    },
    clearEditTeeSelected(treeVm,cellId){
      let tableData = this.$refs.editExcel.getTableData();
      let currentCell = this.$refs.editExcel.getCurrentActiveCell();
      tableData[currentCell.row_index][currentCell.col_index].cell_value = '';
      this.$set(this.editTableDataConf,'tableData',tableData);
    },
    treeSelectedResChange(treeVm,cellId){
      let selKeys = treeVm.getCheckedKeys();
      let selDatas = treeVm.getCheckedNodes();
      let cellValue = [];
      selDatas.forEach(item => {
        cellValue.push(item[this.cellProps.tree.value])
      });
      let currentCell = this.$refs.designExcel.getCurrentActiveCell();
      let tableData = this.$refs.designExcel.getTableData();
      tableData[currentCell.row_index][currentCell.col_index].cell_value = cellValue
      this.$set(this.$refs.designExcel,'tableData',tableData);
    },
    editTreeSelectedResChange(treeVm,cellId){
      let selKeys = treeVm.getCheckedKeys();
      let selDatas = treeVm.getCheckedNodes();
      let cellValue = [];
      selDatas.forEach(item => {
        cellValue.push(item[this.cellProps.tree.value])
      });
      let currentCell = this.$refs.editExcel.getCurrentActiveCell();
      let tableData = this.$refs.editExcel.getTableData();
      tableData[currentCell.row_index][currentCell.col_index].cell_value = cellValue.join(',');
      this.$set(this.editTableDataConf,'tableData',tableData);
    },
    treeLoadNode(node,resolve){
      let cruuentCell = this.$refs.designExcel.getCurrentActiveCell()
      if(node.level == 0){
        resolve([cruuentCell.cell_options])
      }else{
        window.setTimeout(()=>{
           resolve([{id:node.data.id + '01',name:'aaaa'},{id:node.data.id + '02',name:'bbb'}])
        },500);
      }
    },
    editTreeLoadNode(node,resolve){
      if(node.level == 0){
        resolve([{id:'001',name:'全国'}])
      }else{
        window.setTimeout(()=>{
          resolve([{id:node.data.id + '01',name:'aaaa'},{id:node.data.id + '02',name:'bbb'}])
        },500);
      }
      
    },
    cellInputContentSet(cell,data){
      if(!cell)return false;
      let tableData = this.$refs.designExcel.getTableData();
      tableData[cell.row_index][cell.col_index].cell_content_type = data.type.label
      this.$refs.designExcel.setTableData(tableData);
      console.log(tableData[cell.row_index][cell.col_index],data);
    },
    inputTypeConfChange(cell,data){
      if(!cell)return false;
      let tableData = this.$refs.designExcel.getTableData();
      tableData[cell.row_index][cell.col_index].cell_render_type = data.type.label;
      if(data.options)tableData[cell.row_index][cell.col_index].cell_options = data.options;
      this.$refs.designExcel.setTableData(tableData);
      console.log(tableData[cell.row_index][cell.col_index],data);
    },
    cellBindIndr(cell,data){
      if(!cell)return false;
      let tableData = this.$refs.designExcel.getTableData();
      tableData[cell.row_index][cell.col_index].cell_indr = data;
      console.log(tableData[cell.row_index][cell.col_index],data);
    },
    currentCellChange(cell){
      console.log(cell);
    },
    tabeStateChange(state){
      this.showTableState = state;
    },
    saveTable(data){
      let showTableDataConf = {
        colCount:this.editTableDataConf.colCount,
        rowCount:this.editTableDataConf.rowCount,
        tableData:data
      }
      this.$set(this,'showTableDataConf',showTableDataConf);
      console.log(data)
    },
    resetTable(data){
      console.log(data)
    }
  }
}
```
> style部分
```html
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>

```
