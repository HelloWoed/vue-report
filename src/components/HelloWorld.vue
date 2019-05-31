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
      :tableConfig="showTableDataConf">
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

<script>
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
        rowCount:5,//行数
        colCount:5,//列数
        // height:300,//设置高度，垂直方向滚动
        // width:'1500px',//设置宽度水平方向滚动
        fixedHeaderCount:0,//头部固定行数
        fixedLeftCount:0,//左边列固定列数 需要设置width
        fixedRightCount:0,//右边列固定列数 需要设置width
        tableData:[[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-row-header","cell_id":"a167a11e0a704ca19e2a5bc08bcfe2fc","cell_style":{"width":"60px","background":"#fff"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"700c7bc6a50b41a8a4cd10ba946f4dd7","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"4b7985ca9cd34036ac56c306ce3e89ad","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"c15d9582114e40c1920ad84475e5a366","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"dac0ffc2a81f4f8eac74710a4c3330e0","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"642f3beb3430461cbcd51bc0cc49a3a1","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"e72f15c8ff834dd3abff911d88f1fa07","cell_style":{"width":"60px","height":"35px"}},{"cell_value":"asd","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"2fca08154bb14e15a8fda75635374488","cell_style":{"width":"200px","height":"32px"},"row_index":1,"col_index":1},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"a74ffa50d095440a8927c3c5ddc97ea1","cell_style":{"width":"200px","height":"32px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"50d82e4d3068445fa5d721862737a025","cell_style":{"width":"200px","height":"32px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"567cbe8c42df43258ad365e7cf619a3c","cell_style":{"width":"200px","height":"32px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"208de5a3340640ab8e7a1e5d138c783d","cell_style":{"width":"200px","height":"32px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"201405600d50472d88b3fe1717456a08","cell_style":{"width":"60px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"0546b9e701dc4775a9b3417a6d7e5463","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"9b27948bb5af46b39195dd54222766c1","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"58b1a6d293284672a61c25381818065c","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7b1a1a3db1be4638a74f9fa3618a5cda","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"01030f537b2f4f2b89083d57c63b8d29","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"285e974fff334d3980e3809a496746dc","cell_style":{"width":"60px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"f3b78f65f2d54a678245e69e733a445b","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"f33a3412d11d43dbb7fff22adfa37fd5","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"0504a28c7e3e4d73b6aefe1ef46a1a72","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"5ee51b12eba54a398e6602b6a59e545f","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"0fb03f1e33db4488afe703bafeb96ae8","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"d96eb987dc9c4f2f9811415fce9c08e6","cell_style":{"width":"60px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"bbab2c3064ee42bcb794969fd6be66cc","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c87370e9fd8f479ebb4b0f6eee6f971c","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"5a2b89b7faae463bbb930d977a5e240b","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"dacd744655e44f80ba02a757a4e9e981","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7d5a5e4efcae48778bb3e4f666d8457b","cell_style":{"width":"200px"}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"6ae68af6486947fbb65c9254e6f55bec","cell_style":{"width":"60px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"61f84354350d409dab1586b5bc091cc3","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"e93260615f1d4e818f59fe0fc2cf939f","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"fb58d6eff20344a9b9ed4dd8c3852441","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"cbcb675ba4fb45e79a9767fc6f6a9173","cell_style":{"width":"200px"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"930293af5fb948999ccc12c531a996f7","cell_style":{"width":"200px"}}]]
      },
      editTableDataConf:{
        rowCount:15,//行数
        colCount:15,//列数
        height:300,//设置高度，垂直方向滚动
        width:'1500px',//设置宽度水平方向滚动
        fixedHeaderCount:0,//头部固定行数
        fixedLeftCount:0,//左边列固定列数
        fixedRightCount:0,//右边列固定列数
        tableData:[[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-row-header","cell_id":"812ff35a47f541daa485131ea314f248","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"54466c58afcc4e298daa8050fb2b90f7","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"dc3ca37884f241bbb18fc4551a96ecde","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"1b11cdfb47524d6aa3a207685b7fdb66","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"2a2c9279ae254e1c951e2196dfdd1a70","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-col-header","cell_id":"5854c1786c7746de984b48964261473e","cell_style":{}}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"533de898b4df4756bac18b6b6e629a81","cell_style":{}},{"cell_value":"姓名","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"7bace44d667d46ac911c7984f9eacb99","cell_style":{"backgroundColor":"#D8D8D8","textAlign":"center","fontWeight":"bold"},"row_index":1,"col_index":1,"area_type":"tableHeader"},{"cell_value":"性别","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"e14ac54362864f75846c98a2574945c1","cell_style":{"backgroundColor":"#D8D8D8","textAlign":"center","fontWeight":"bold"},"area_type":"tableHeader","row_index":1,"col_index":2},{"cell_value":"年龄","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"cfb39e7a29c14e16a626b803cc3866a5","cell_style":{"backgroundColor":"#D8D8D8","textAlign":"center","fontWeight":"bold"},"area_type":"tableHeader","row_index":1,"col_index":3},{"cell_value":"籍贯","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"2d70e53787b54a9c924e5ddcb47970d3","cell_style":{"backgroundColor":"#D8D8D8","textAlign":"center","fontWeight":"bold"},"area_type":"tableHeader","row_index":1,"col_index":4},{"cell_value":"学历","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c6c69361cf1343859ca31e8ab6417ea5","cell_style":{"backgroundColor":"#D8D8D8","textAlign":"center","fontWeight":"bold"},"area_type":"tableHeader","row_index":1,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"1afcf9d279ba4d63bd07c88283c23b5a","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"4b0bdd8158ec4b4296f2bb36868452f7","cell_style":{}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"radio","cell_type":"cell","cell_id":"c5c1b88ab5964459afc498d56ce4ffba","cell_style":{},"row_index":2,"col_index":2,"cell_options":[{"id":"011","name":"男性"},{"id":"012","name":"女性"}]},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"2df1e6912b634d178edf6d6b6aa7d306","cell_style":{},"row_index":2,"col_index":3},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"tree","cell_type":"cell","cell_id":"48378b75979745af86b63628f800f70d","cell_style":{},"row_index":2,"col_index":4,"cell_options":{"id":"001","name":"全国"}},{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"radio","cell_type":"cell","cell_id":"da1835b252f54608a2a6af94f09c6a69","cell_style":{},"row_index":2,"col_index":5,"cell_options":[{"id":"011","name":"男性"},{"id":"012","name":"女性"}]}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"2127b1b01433489999dec1fcab5652fe","cell_style":{}},{"cell_value":"136","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"53709eea8ad9462fabcf89ec67e3aabe","cell_style":{"backgroundColor":"#8DB4E3","color":"rgba(248, 69, 4, 1)"},"row_index":3,"col_index":1,"area_type":"calcArea"},{"cell_value":"965","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"b35aeeee78fe4279a50f52fe126794bf","cell_style":{"backgroundColor":"#8DB4E3","color":"rgba(248, 69, 4, 1)","fontStyle":"italic"},"row_index":3,"col_index":2,"area_type":"calcArea"},{"cell_value":"218","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"ccf2a3b4baae4a708568d9ac5b3c5d4b","cell_style":{"backgroundColor":"#8DB4E3","color":"rgba(248, 69, 4, 1)"},"area_type":"calcArea","row_index":3,"col_index":3},{"cell_value":"360","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"8b08f63d03c0444f9433ff6248a90033","cell_style":{"backgroundColor":"#8DB4E3","color":"rgba(248, 69, 4, 1)","fontStyle":"italic"},"area_type":"calcArea","row_index":3,"col_index":4},{"cell_value":"496","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"b2ba063d2455406384e05261d90babd0","cell_style":{"backgroundColor":"#8DB4E3","color":"rgba(248, 69, 4, 1)"},"area_type":"calcArea","row_index":3,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"dec095ed21854b47baa48641bbff40e4","cell_style":{"height":"74px"}},{"cell_value":"左上对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"6a0adc47d073454a819c904989430d04","cell_style":{"verticalAlign":"top","backgroundColor":"rgba(6, 6, 6, 1)","color":"rgba(241, 248, 248, 1)"},"row_index":4,"col_index":1},{"cell_value":"左中对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"6036a7fd86684a238560585f966e4d8f","cell_style":{"backgroundColor":"rgba(245, 131, 9, 1)","color":"rgba(8, 247, 239, 1)"},"row_index":4,"col_index":2},{"cell_value":"左下对齐","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"48fdfb5e83824a2287c9b22dec1ea72e","cell_style":{"verticalAlign":"bottom","backgroundColor":"rgba(99, 232, 228, 1)","color":"rgba(5, 24, 230, 1)"},"row_index":4,"col_index":3},{"cell_value":"垂直居中","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"c1f458ff7084414c95538d9392761959","cell_style":{"verticalAlign":"middle","backgroundColor":"rgba(179, 99, 232, 1)","color":"rgba(58, 230, 5, 1)"},"row_index":4,"col_index":4},{"cell_value":"居中","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"fixed","cell_type":"cell","cell_id":"93898415199a4ff38abc39a2ac7b37ab","cell_style":{"verticalAlign":"middle","textAlign":"center","backgroundColor":"rgba(222, 220, 58, 1)","color":"rgba(230, 5, 20, 1)"},"row_index":4,"col_index":5}],[{"cell_value":"","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell-row-header","cell_id":"2fa3a790747149678f892c65a5e887f7","cell_style":{}},{"cell_value":"呼啦啦","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"4b9c5e07ecf54bac98c0e541538c03b2","cell_style":{"backgroundColor":"#DBE5F1","color":"rgba(110, 5, 248, 1)"},"row_index":5,"col_index":1,"area_type":"quote"},{"cell_value":"哇哈哈","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"ef7f388df3cf4499bfc8b5994c942bd6","cell_style":{"backgroundColor":"#DBE5F1","color":"rgba(110, 5, 248, 1)"},"row_index":5,"col_index":2,"area_type":"quote"},{"cell_value":"咔嚓嚓","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"835307635db446c29323275a0113c41a","cell_style":{"backgroundColor":"#DBE5F1","color":"rgba(110, 5, 248, 1)"},"row_index":5,"col_index":3,"area_type":"quote"},{"cell_value":"啊呀呀","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"5dd810eec52b4175b05354370eca6df6","cell_style":{"backgroundColor":"#DBE5F1","color":"rgba(110, 5, 248, 1)"},"row_index":5,"col_index":4,"area_type":"quote"},{"cell_value":"过家家","cell_rowspan":1,"cell_colspan":1,"cell_area_type":"inputArea","cell_render_type":"text","cell_type":"cell","cell_id":"d098af96a2ff42f6ba242f3a8b5ed313","cell_style":{"backgroundColor":"#DBE5F1","color":"rgba(110, 5, 248, 1)"},"area_type":"quote","row_index":5,"col_index":5}]]
      },
      showTableDataConf:{
        rowCount:15,//行数
        colCount:15,//列数
        height:300,//设置高度，垂直方向滚动
        width:'1500px',//设置宽度水平方向滚动
        fixedHeaderCount:0,//头部固定行数
        fixedLeftCount:0,//左边列固定列数
        fixedRightCount:0,//右边列固定列数
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
        console.log(tableData);
        console.log(JSON.stringify(tableData));
          console.log('保存');
          let editTableDataConf = Object.assign({},this.attrDataConf)
          editTableDataConf.tableData = tableData;
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
      // tableData[cell.row_index][cell.col_index].cell_render_type = data.type.label;
      // if(data.options)tableData[cell.row_index][cell.col_index].cell_options = data.options;
      // this.$refs.designExcel.setTableData(tableData);
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
      let showTableDataConf = Object.assign({},this.editTableDataConf);
      showTableDataConf.tableData = data;
      this.$set(this,'showTableDataConf',showTableDataConf);
      console.log(data)
    },
    resetTable(data){
      console.log(data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
