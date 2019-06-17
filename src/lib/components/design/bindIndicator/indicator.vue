<template>
    <div class="indicator">
        <el-row :gutter="10">
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>筛选指标</strong></el-divider>
                    <el-input placeholder="请输入内容" v-model="getIndicatorVal" @input="filterNodeHandle" suffix-icon="el-icon-search" clearable>
                    </el-input>   
                    <div class="content">
                        <div class="indrTree">
                            <el-tree
                                ref="indicatorTree"
                                :props="indrPprops"
                                :load="loadNode"
                                :filter-node-method="filterNode"
                                node-key="id"
                                lazy
                                @check="treeSelChange"
                                show-checkbox>
                            </el-tree>
                        </div>
                        <el-divider content-position="left"><strong>维度选择</strong></el-divider>
                        <div class="dimensionlity">
                            <el-input 
                                placeholder="请输入内容" 
                                v-model="filterDimensionlity" 
                                @input="filterDimensionlityChange" 
                                suffix-icon="el-icon-search"
                                clearable></el-input>   
                            <div class="dimessionList">
                                <p v-if="dimensionlityData.length > 0">
                                    <el-checkbox @click.native="clearDefaultEvt($event)" :indeterminate="isIndeterminate" v-model="checkAll" class="radioCheckitem" @change="handleCheckAllChange">全选</el-checkbox>
                                    <el-checkbox-group v-model="dimensionlityChecked" @change="seldimensionlityValChange">
                                        <el-row v-for="(item,i) in dimensionlityData" :key="i">
                                            <el-checkbox @click.native="clearDefaultEvt($event)" :label="item.id" class="radioCheckitem">{{parseDimensionLabel(item)}}</el-checkbox>
                                        </el-row>
                                    </el-checkbox-group>
                                </p>
                                <p class="noData" v-else>
                                    <span>暂无数据</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>可选指标</strong></el-divider>
                    <el-input 
                        placeholder="请输入内容" 
                        v-model="indicatorListVal" 
                        @input="indicatorListValChange" 
                        suffix-icon="el-icon-search"
                        clearable></el-input>  
                    <div class="indr-list-content">
                        <div v-if="indicatorData.length > 0">
                            <div class="content">
                                <p>
                                    <el-row v-for="(item,i) in indicatorData" :key="i">
                                        <el-radio v-model="selIndicatorVal" class="radioCheckitem" @change="selIndicatorValChange(item)" @click.native="clearDefaultEvt($event)" :label="item.id">{{parseIndrListLabel(item)}}</el-radio>
                                    </el-row>
                                </p>
                            </div>
                        </div>
                        <p class="noData" v-else>
                            <span>暂无数据</span>
                        </p>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>已选中指标</strong></el-divider>
                    <div class="selected-indr-content">
                        <p v-if="selctedIndictorData" class="res-indicator">
                            <span class="selIndicatorName">{{parseIndrListLabel(selctedIndictorData)}}</span>
                            <span class="delSelIndicator">
                                <el-button size="mini" icon="el-icon-delete" circle @click="delSelIndicator"></el-button>
                            </span>
                        </p>
                        <p class="noData" v-else>
                            <span>暂无数据</span>
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name:'excel-indr',
    data(){
        let _this = this;
        return {
            parseDimensionLabel:(item)=>{
                if(_this.dimensionProp.toLocaleString() == "[object Object]"){
                    return item[_this.dimensionProp.label]
                }else{
                    return _this.dimensionProp.bind(_this)(item,_this)
                }
            },
            parseIndrListLabel:(item)=>{
                if(_this.indicatorListProp.toLocaleString() == "[object Object]"){
                   return item[_this.indicatorListProp.label]
                }else{
                    return _this.indicatorListProp.bind(_this)(item,_this)
                }
            },
            treeResVal:null,//指标树的最终结果值
            getIndicatorVal:null,
            indicatorListVal:null,
            bindedIndicator:null,
            selIndicatorVal:null,//选中的指标label
            indicatorData:[],//指标数据
            selctedIndictorData:null,//选中的指标数据
            dimensionlityDataCopy:[],//维度数据
            dimensionlityData:[],//维度数据
            dimensionlityChecked:[],//
            isIndeterminate:false,
            checkAll: false,
            filterDimensionlity:null,
        }
    },
    inject:["loadIndrNode","indrPprops","indrSelectChange","dimensionData","getIndrDatas","dimensionProp","indicatorListProp"],
    mounted(){
        
    },
    methods:{
        clearDefaultEvt(e){
            e.stopPropagation();
        },
        filterNodeHandle(){
            this.$refs.indicatorTree.filter(this.getIndicatorVal);
        },
        filterNode(value,data){
            if (!value) return true;
            let label = this.parseIndrListLabel(data) || data.name;
            return label.indexOf(value) !== -1;
        },
        filterDimensionlityChange(val){
            this.dimensionlityData = this.dimensionlityDataCopy.filter(item => {
                return this.parseDimensionLabel(item).indexOf(val) != -1;
            });
        },
        seldimensionlityValChange(value){
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.dimensionlityData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.dimensionlityData.length;
            this.getIndocatorData(value);
        },
         handleCheckAllChange(val) {
            let allChecks = [];
            if(this.dimensionlityData)this.dimensionlityData.forEach(item=>{
                allChecks.push(item.id);
            });
            this.dimensionlityChecked = val ? allChecks : [];
            this.isIndeterminate = false;
            this.getIndocatorData(this.dimensionlityChecked);
        },
        treeSelChange(data,node){
            this.treeResVal = data;
            this.indicatorData = [];
            this.selctedIndictorData = [];
            this.dimensionlityDataCopy = [];
            this.dimensionlityData = [];
            this.dimensionlityChecked = [];
            this.selIndicatorVal = null;
            this.isIndeterminate = false;
            this.checkAll = false;
            this.indrSelectChange(data,node,this.$refs.indicatorTree).then(()=>{
                this.getDimensionlityData(data,node,this.$refs.indicatorTree);
            });
        },
        loadNode(node, resolve) {
            this.loadIndrNode(node, resolve);
        },
        delSelIndicator(){
            this.selctedIndictorData = null;
            this.selIndicatorVal = null;
            this.$emit('selctedIndictorDataChange',this.selctedIndictorData);
        },
        selIndicatorValChange(val){
            this.selctedIndictorData = val;
            this.$emit('selctedIndictorDataChange',this.selctedIndictorData);
        },
        indicatorListValChange(val){
            this.indicatorData = this.indicatorDataCopy.filter(item => {
                return this.parseIndrListLabel(item).indexOf(val) != -1;
            })
        },
        getDimensionlityData(data,node,vm){
            new Promise((resolve,reject)=>{
                this.dimensionData(resolve,reject,data,node,vm);
            }).then(data=>{
                this.dimensionlityData = data; 
                this.dimensionlityDataCopy = this.dimensionlityData;
            });
            
        },
        getIndocatorData(val){
            new Promise((resolve,reject)=>{
                this.getIndrDatas(resolve,reject,val,this.$refs.indicatorTree)
            }).then(data=>{
                this.indicatorData = data;
                this.indicatorDataCopy = this.indicatorData;
            });
        }
    }
}
</script>
<style lang="less" scoped>
    .indicator-grid{
        border:1px solid #e0e2e4;
        padding:10px;
    }
    .indrTree,.dimessionList{
        max-height: 200px;
        overflow: auto;
    }
    .indr-list-content,.selected-indr-content{
        max-height: 490px;
        overflow: auto;
    }
    .res-indicator{
        position: relative;
        .selIndicatorName{
            display: inline-block;
        }
        .delSelIndicator{
            position: absolute;
            top:-5px;
            right:10px;
        }
    }
    .radioCheckitem{
        margin: 5px 0;
    }
    .noData{
        text-align: center;
        color:#909399;
    }
</style>
