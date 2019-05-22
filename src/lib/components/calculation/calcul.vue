<template>
    <div class="calculation">
        <el-row :gutter="10">
            <el-col :span="6">
                <div>
                    <el-row :gutter="20">
                        <el-col :span="18">
                            <el-input placeholder="请输入内容" size="mini" v-model="filterIndrVal" @input="filterIndr" suffix-icon="el-icon-search" clearable></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" size="mini" @click="selIndr">选择指标</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="indr-list">
                    <ul class="indr-list-box">
                        <li class="indr-list-item" v-for="(item,index) in selectedIndr" :key="index" @click="setIndrs(item)">
                            <span class="list-num">{{index + 1}}</span>
                            <span class="list-item-name">{{item.value}}</span>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <el-tabs v-model="calcActive" type="card">
                    <el-tab-pane label="计算公式" name="calculation" :lazy="true">
                        <Calculations 
                        :calcType="currentCalcType"
                        @changeCalcItem="changeCalcItem"
                        @deleteCurntCalcItem="deleteCurntCalcItem"
                        @clearCalculation="clearCalculation"
                        :calculationRes="calculationRes" />
                    </el-tab-pane>
                    <el-tab-pane label="校验公式" name="validiteCalc" :lazy="true">
                        <ValiditorCalc />
                    </el-tab-pane>
                    <el-tab-pane label="核查公式" name="checkCalc" :lazy="true">
                        <CheckCalc />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="6">
                <div class="funs-title" style="marginTop:40px"></div>
                <el-divider>插入函数</el-divider>
                <div class="functions">
                    <ul class="funs">
                        <li class="fun-item" v-for="(item,i) in existFuns" :key="i" @click="setCalcType(item)">
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <el-divider><strong>插入符号</strong></el-divider>
                    <div class="symbol">
                        <div class="symbol-item" v-for="(sym,i) in symbolData" :key="i" :class="{'set-position-top': i < 5,'set-position-left': i % 5 == 0}" @click="setSymbols(sym)">{{ sym.value }}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog
        title="选择指标"
        :visible.sync="selIndrDialog"
        width="60%">
        <Indicator @selctedIndictorDataChange="selctedIndictorDataChange" />
        <span slot="footer" class="dialog-footer">
            <el-button @click="selIndrDialog = false">取 消</el-button>
            <el-button type="primary" @click="subSelIndrs">确 定</el-button>
        </span>
        </el-dialog>
        <p style="textAlign:center;marginTop:35px">
            <el-button type="primary" size="mini" @click="completeCalc">完 成</el-button>
        </p>
    </div>
</template>
<script>
import {defaultLoadIndr} from '../utils/excel'
import Calculations from './valculations'
import ValiditorCalc from './validitor'
import Indicator from './indicator'
import CheckCalc from './checkCalc'
export default {
    name:'IndrCalculation',
    props:{
        prop:{type:Object,default(){
            return {
                value:'id',
                label:'value'
            }
        }},
        existFuns:{type:Array | Function,default(){
            return [
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
                },
                {
                    id:'005',
                    name:'混合运算',
                    value:"hybirdOpration"
                }
            ]
        }},
        symbolData:{type:Array | Function,default(){
            return [
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
                    id:'023',
                    type:'symbol',
                    value:"delete"
                }
            ]
        }},
        loadIndrNode:{type:Function,default: (node, resolve)=>{//指标树形结构load方法
            defaultLoadIndr(node, resolve);
        }},
        dimensionData:{type:Function,default:(data,node,vm)=>{
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
    },
    components:{Calculations,ValiditorCalc,Indicator,CheckCalc},
    data(){
        return {
            selectedIndr:[],
            selectedIndrCorpy:[],
            subSelectedIndr:[],
            filterIndrVal:null,
            selIndrDialog:false,
            calcActive:'calculation',
            currentCalcType:{id:'005',name:'混合运算',value:"hybirdOpration"},
            calculationRes:[],
            changeTarCalcItem:null,
            changeTarCalcItemIndex:null,
        }
    },
    provide(){
        return{
            loadIndrNode:this.loadIndrNode,
            indrSelectChange:this.indrSelectChange,
            dimensionData:this.dimensionData,
            getIndrDatas:this.getIndrDatas,
        }
    },
    methods:{
        completeCalc(){
            let leftBreaks = this.calculationRes.filter(item=>{return item.value == '('});
            let rightBreaks = this.calculationRes.filter(item=>{return item.value == ')'});
            if(leftBreaks.length == rightBreaks.length){
                if(this.calculationRes[this.calculationRes.length -1] && this.calculationRes[this.calculationRes.length -1].type == 'symbol' && this.calculationRes[this.calculationRes.length -1].value != ')'){
                    this.$message({
                        message:'公式运算逻辑有误！',
                        type:'error'
                    })
                }else this.$emit('complete',this.calculationRes);
            }else{
                this.$message({
                    message:'公式逻辑有误，缺少 "(" 或 ")"！',
                    type:'error'
                })
            }
            
        },
        deleteCurntCalcItem(item,index){
            let {calculationRes} = this;
            if(calculationRes[index - 1] && calculationRes[index - 1].type == 'function'){
                calculationRes.splice(index - 1,2);
            }else{
                calculationRes.splice(index,1);
            }
            this.changeTarCalcItem = null;
            this.changeTarCalcItemIndex = null;
            this.$set(this,'calculationRes',calculationRes);
        },
        changeCalcItem(item,index){
            this.changeTarCalcItem = item;
            this.changeTarCalcItemIndex = index;
        },
        clearCalculation(){
            this.$set(this,'calculationRes',[]);
            this.changeTarCalcItem = null;
            this.changeTarCalcItemIndex = null;
        },
        setCalcType(fun){
            
            let {calculationRes} = this;
            if(!fun.type)fun.type = 'function';
            if(this.changeTarCalcItem){
                calculationRes[this.changeTarCalcItemIndex] = fun;
            }else{
                let leftBresk = this.symbolData.filter(item=>{
                    return item.value == '(';
                });
                leftBresk.unshift(fun)
                calculationRes = calculationRes.concat(leftBresk);
            }
            this.$set(this,'calculationRes',JSON.parse(JSON.stringify(calculationRes)));
            this.$set(this,'currentCalcType',fun);
        },
        setSymbols(symbol){
            let {calculationRes} = this;
            if(calculationRes.length == 0){
                this.$message({
                    message:'请先选择指标！',
                    type:'error'
                });
                return false;
            }
            if(symbol.value == 'delete'){
                if(calculationRes[calculationRes.length-2].type == 'function'){
                    calculationRes.pop();
                    calculationRes.pop();
                }else{
                    calculationRes.pop();
                }
            }else{
                if(this.changeTarCalcItem){
                    calculationRes[this.changeTarCalcItemIndex] = symbol;
                }else{
                    calculationRes.push(symbol);
                }
            }
            this.currentCalcType = {id:'005',name:'混合运算',value:"hybirdOpration"};
            this.$set(this,'calculationRes',JSON.parse(JSON.stringify(calculationRes)));
        },
        setIndrs(indr){
            let {calculationRes} = this;
            if(!indr.type)indr.type = 'indr';
            if(this.changeTarCalcItem){
                calculationRes[this.changeTarCalcItemIndex] = indr;
            }else{
                if(calculationRes[calculationRes.length - 1] && calculationRes[calculationRes.length - 1].type == indr.type){
                    calculationRes.pop();
                }
                calculationRes.push(indr);
            }
            this.$set(this,'calculationRes',JSON.parse(JSON.stringify(calculationRes)));
        },
        subSelIndrs(){
            this.selectedIndr = this.subSelectedIndr;
            this.selectedIndrCorpy = this.subSelectedIndr;
            this.selIndrDialog = false;
        },
        selctedIndictorDataChange(data){
            this.subSelectedIndr = data;
        },
        filterIndr(val){
            this.selectedIndr = this.selectedIndrCorpy.filter(item => {
                return item[this.prop.label].indexOf(val) != -1;
            });
        },
        selIndr(){
            this.selIndrDialog = true;
        }
    }
}
</script>
<style lang="less" scoped>
    .functions{
        .funs{
            padding:0;
            margin:0;
            .fun-item{
                list-style: none;
                padding:10px 0;
                border-bottom: 1px solid #DCDFE6;
                &:hover{
                    cursor: pointer;
                    background: #DCDFE6;
                }
            }
        }
    }
    .indr-list{
        margin-top:15px;
        .indr-list-box{
            padding:0;
            margin: 0;
            .indr-list-item{
                &:hover{
                    cursor: pointer;
                    background: #DCDFE6;
                }
                list-style: none;
                padding:5px 0;
                .list-num{
                    display: inline-block;
                    text-align: center;
                    width: 25px;
                    font-weight: bold;
                }
            }
        }
    }
.symbol {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    font-size: 20px;
    .symbol-item {
        padding:5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        background-color: white;
        flex: 0 0 20%;
        border-right: 1px solid #DCDFE6;
        border-bottom: 1px solid #DCDFE6;
        &:hover{
            cursor: pointer;
            background: #DCDFE6;
        }
    }
    .set-position-top{
        border-top: 1px solid #DCDFE6;
    }
    .set-position-left{
        border-left: 1px solid #DCDFE6;
    }
}


</style>
