<template>
    <div class="toll-bar">
        <el-row :gutter="10">
            <el-col v-for="(item,index) in barConfData" :key="index" :span="item.spanVal">
                <span :class="item.className" v-if="item.renderType == 'split'"></span>
                <el-tooltip v-else effect="light" :content="item.tips" placement="bottom">
                    <span v-if="item.target == 'tableInit'">
                        <el-popover
                            placement="bottom"
                            width="400"
                            trigger="click">
                                <el-form :rules="tableRules" :label-position="labelPosition" ref="initTableRowCol" label-width="80px" :model="tableInitRowCol">
                                    <el-form-item prop="row" label="行数：">
                                        <el-input type="number" placeholder="请输入" v-model="tableInitRowCol.row"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="col" label="列数：">
                                        <el-input type="number" placeholder="请输入" v-model="tableInitRowCol.col"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="initTable('initTableRowCol')">提交</el-button>
                                    </el-form-item>
                                </el-form>
                            <span slot="reference" :class="item.className"></span>
                        </el-popover>
                    </span>
                    <span v-else>
                        <span :class="item.className" v-if="item.renderType == 'icon'" @click="setAttr(item)"></span>
                        <span v-if="item.renderType == 'color'">
                            <span :class="item.className"></span>
                            <el-color-picker v-model="item.value[item.name]" @change='colorChange(item)' size="mini" show-alpha></el-color-picker>
                        </span>
                        <span v-if="item.renderType == 'select'">
                            <el-select v-model="item.value[item.name]" filterable placeholder="请选择" size="mini" @change="selItemChange(item)">
                                <el-option
                                v-for="item in item.options"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </span>
                    </span>
                </el-tooltip>
            </el-col>
        </el-row>
    </div>
</template>
<script>

export default {
    name:'excel-tools-bar',
    data(){
        return {
            fontColorVal:null,
            bgColorVal:null,
            barConfData: [],
            labelPosition:'right',
            tableInitRowCol:{
                row:null,
                col:null
            },
            tableRules:{
                row:[
                    { required: true, message: '请输入行数', trigger: 'blur'},
                    {validator:(rule, value, callback)=>{
                        let numVal = value - 0;
                        if(numVal < 1 || numVal > 200){
                            callback('行数的取值范围在 1-200 之间')
                        }else{
                            callback()
                        }
                    }, trigger: 'change'}
                ],
                col:[
                    { required: true, message: '请输入列数', trigger: 'blur'},
                    {validator:(rule, value, callback)=>{
                        let numVal = value - 0;
                        if(numVal < 1 || numVal > 200){
                            callback('行数的取值范围在 1-200 之间')
                        }else{
                            callback()
                        }
                    }, trigger: 'change'}
                ]
            }
        }
    },
    inject:["tableToolbarConf"],
    mounted(){
        let barConfDatas = this.initBarConf();
        let targetDatas = [];
        // let names = []
        // barConfDatas.forEach(tool=>{
        //     names.push(tool.name)
        // });
        // console.log(this.tableToolbarConf.length);
        // console.log(JSON.stringify(names))
        this.tableToolbarConf.forEach(bar=>{
            barConfDatas.forEach(objBar=>{
                if(objBar.name == bar)targetDatas.push(objBar);
            });
        });
        this.barConfData = targetDatas;
    },
    methods:{
        selItemChange(val){
            let value = JSON.parse(JSON.stringify(val));
            value.value[val.name] += 'px';
            this.$emit('setAttribute',value);
        },
        initBarConf(){
            return [
                {target:'tableInit',tips:'表格',className:['icon','iconfont','iconbiaoge'],spanVal:0.5,renderType:'icon',name:'tableSet'},
                {target:'cell',tips:'只读区',areaSet:true,className:['icon','iconfont','iconshu'],spanVal:0.5,renderType:'icon',name:'readOnly',value:{backgroundColor:'#5A5A5A'}},
                {target:'cell',tips:'表头区',areaSet:true,className:['icon','iconfont','iconbiaotoushezhi_huabanfuben'],spanVal:0.5,renderType:'icon',name:'tableHeader',value:{backgroundColor:'#D8D8D8'}},
                {target:'cell',tips:'输入区',areaSet:true,className:['icon','iconfont','iconicon_xie'],spanVal:0.5,renderType:'icon',name:'inputArea',value:{backgroundColor:'#FFFFFF'}},
                {target:'cell',tips:'计算区',areaSet:true,className:['icon','iconfont','iconjisuanqi'],spanVal:0.5,renderType:'icon',name:'calcArea',value:{backgroundColor:'#8DB4E3'}},
                {target:'cell',tips:'引用区',areaSet:true,className:['icon','iconfont','iconyinyongziyuan'],spanVal:0.5,renderType:'icon',name:'quote',value:{backgroundColor:'#DBE5F1'}},
                {className:['split-line'],spanVal:0.5,renderType:'split',name:'split'},
                {target:'cell',tips:'加粗',className:['icon','iconfont','iconzitijiacu'],spanVal:0.5,renderType:'icon',name:'bold',value:{fontWeight:'bold'}},
                {target:'cell',tips:'斜体',className:['icon','iconfont','iconxieti'],spanVal:0.5,renderType:'icon',name:'italic',value:{fontStyle:'italic'}},
                {target:'cell',tips:'下划线',className:['icon','iconfont','iconzitixiahuaxian'],spanVal:0.5,renderType:'icon',name:'underLine',value:{textDecoration: 'underline'}},
                {target:'cell',tips:'字号',className:[],spanVal:0.5,renderType:'select',name:'fontSize',value:{fontSize:""},options:[6,8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72]},
                // {className:['split-line'],spanVal:0.5,renderType:'split',name:'split'},
                {target:'cell',tips:'字体颜色',className:['icon','iconfont','iconT-yanse'],spanVal:0.5,renderType:'color',name:'color',value:{color:''}},
                {target:'cell',tips:'背景颜色',className:['icon','iconfont','iconzitibeijingse'],spanVal:0.5,renderType:'color',name:'backgroundColor',value:{backgroundColor:''}},
                {target:'cell',tips:'左对齐',className:['icon','iconfont','iconzuoduiqi'],spanVal:0.5,renderType:'icon',name:'textLeft',value:{textAlign:'left'}},
                {target:'cell',tips:'左右居中',className:['icon','iconfont','iconformat-horizontal-align-center'],spanVal:0.5,renderType:'icon',name:'textCenter',value:{textAlign:'center'}},
                {target:'cell',tips:'右对齐',className:['icon','iconfont','iconyouduiqi'],spanVal:0.5,renderType:'icon',name:'textRight',value:{textAlign:'right'}},
                {tips:'高度',className:['icon','iconfont','icongaodu'],spanVal:0.5,name:'setHeight',renderType:'icon'},
                {tips:'宽度',className:['icon','iconfont','iconkuandu'],spanVal:0.5,name:'setWidth',renderType:'icon'},
                {target:'cell',tips:'上对齐',className:['icon','iconfont','iconshangduiqi'],spanVal:0.5,renderType:'icon',name:'textTop',value:{verticalAlign:'top'}},
                {target:'cell',tips:'上下居中',className:['icon','iconfont','iconformat-vertical-align-center'],spanVal:0.5,renderType:'icon',name:'vercicalMiddle',value:{verticalAlign:'middle'}},
                {target:'cell',tips:'下对齐',className:['icon','iconfont','iconxiaduiqi'],spanVal:0.5,renderType:'icon',name:'textBottom',value:{verticalAlign:'bottom'}},
                // {className:['split-line'],spanVal:0.5,renderType:'split',name:'split'},
                {target:'table',eName:'locked',tips:'锁定',className:['icon','iconfont','iconlock-line'],name:'locked',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'unlock',tips:'解锁',className:['icon','iconfont','iconlock-unlock-line'],name:'unlock',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'tablesetting',tips:'表格设置',className:['icon','iconfont','iconsetting'],name:'tablesetting',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'upload',tips:'上传',className:['icon','iconfont','iconshangchuan'],name:'upload',spanVal:0.5,renderType:'icon'},
                {className:['split-line'],spanVal:2,renderType:'split',name:'splitMiddle'},
                {target:'table',eName:'preview',tips:'预览',className:['icon','iconfont','iconzitiyulan'],name:'preview',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'tableValidate',tips:'校验',className:['icon','iconfont','iconxitongguanli-jianchayiju'],name:'tableValidate',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'save',tips:'保存',className:['icon','iconfont','iconbaocun'],name:'save',spanVal:0.5,renderType:'icon'},
                {target:'table',eName:'share',tips:'分享',className:['icon','iconfont','iconicon_share'],name:'share',spanVal:0.5,renderType:'icon'}
            ]
        },
        colorChange(item){
            this.$emit('setAttribute',item);
        },
        setAttr(item){
            if(item.target == 'cell')this.$emit('setAttribute',item);
            else if(item.target == 'table') this.$emit('tableEventHandler',item);
        },
        initTable(tableRef){
            this.$refs[tableRef][0].validate(valid=>{
                if(valid){
                    this.$emit('initTableRowCol',this.tableInitRowCol)
                }
            })
        }
    },
    destroyed(){
        this.$off('setAttribute');
        this.$off('tableEventHandler');
        this.$off('initTableRowCol');
    }
}
</script>

<style lang="less" scoped>
    @import url('../icon/iconfont.css');
    .toll-bar {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        padding: 0 60px;
        border-bottom: 1px solid #e0e2e4;
        background: #f5f6f7;
        .iconfont{
            color:#606266;
            &:hover{
                cursor: pointer;
                color:#409EFF;
            }
        }
        .split-line{
            display: inline-block;
            width:2px;
            background: #e0e2e4;
            height: 1.5rem;
            position: relative;
            top:7px;
        }
    }
</style>
