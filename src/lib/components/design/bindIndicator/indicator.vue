<template>
    <div class="indicator">
        <el-row :gutter="10">
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>筛选指标</strong></el-divider>
                    <el-input placeholder="请输入内容" v-model="getIndicatorVal" @input="filterNodeHandle" suffix-icon="el-icon-search" clearable>
                    </el-input>   
                    <div class="content">
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
                        <el-divider content-position="left"><strong>维度选择</strong></el-divider>
                        <div class="dimensionlity">
                            <p v-if="dimensionlityData.length > 0">
                                <el-input 
                                    placeholder="请输入内容" 
                                    v-model="filterDimensionlity" 
                                    @input="filterDimensionlityChange" 
                                    suffix-icon="el-icon-search"
                                    clearable></el-input>   
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" class="radioCheckitem" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="dimensionlityChecked" @change="seldimensionlityValChange">
                                    <el-row v-for="(item,i) in dimensionlityData" :key="i">
                                        <el-checkbox :label="item.id" class="radioCheckitem">{{item.value}}</el-checkbox>
                                    </el-row>
                                </el-checkbox-group>
                            </p>
                            <p class="noData" v-else>
                                <span>暂无数据</span>
                            </p>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>可选指标</strong></el-divider>
                    <div v-if="indicatorData.length > 0">
                        <el-input 
                            placeholder="请输入内容" 
                            v-model="indicatorListVal" 
                            @input="indicatorListValChange" 
                            suffix-icon="el-icon-search"
                            clearable></el-input>  
                            <div class="content">
                            <p>
                                <el-row v-for="(item,i) in indicatorData" :key="i">
                                    <el-radio v-model="selIndicatorVal" class="radioCheckitem" @change="selIndicatorValChange(item)" :label="item.id">{{item.value}}</el-radio>
                                </el-row>
                            </p>
                        </div>
                    </div>
                    <p class="noData" v-else>
                        <span>暂无数据</span>
                    </p>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>已选中指标</strong></el-divider>
                     <p v-if="selctedIndictorData" class="res-indicator">
                        <span class="selIndicatorName">{{selctedIndictorData.value}}</span>
                        <span class="delSelIndicator">
                            <el-button size="mini" icon="el-icon-delete" circle @click="delSelIndicator"></el-button>
                        </span>
                     </p>
                     <p class="noData" v-else>
                         <span>暂无数据</span>
                     </p>
                </div>
                
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name:'excel-indr',
    data(){
        return {
            indrPprops:{
                label: 'name',
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
    inject:["loadIndrNode","indrSelectChange","dimensionData","getIndrDatas"],
    mounted(){
        
    },
    methods:{
        filterNodeHandle(){
            this.$refs.indicatorTree.filter(this.getIndicatorVal);
        },
        filterNode(value,data){
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterDimensionlityChange(val){
            this.dimensionlityData = this.dimensionlityDataCopy.filter(item => {
                return item.value.indexOf(val) != -1;
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
            this.indrSelectChange(data,node,this.$refs.indicatorTree).then(()=>{
                this.getDimensionlityData();
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
                return item.value.indexOf(val) != -1;
            })
        },
        getDimensionlityData(){
            this.dimensionlityData = this.dimensionData();
            this.dimensionlityDataCopy = this.dimensionlityData;
        },
        getIndocatorData(val){
            this.indicatorData = this.getIndrDatas(val);
            this.indicatorDataCopy = this.indicatorData;
        }
    }
}
</script>
<style lang="less" scoped>
    .indicator-grid{
        border:1px solid #e0e2e4;
        padding:10px;
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
