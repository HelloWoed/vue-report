<template>
    <div class="indicator">
        <el-row :gutter="10">
            <el-col :span="8">
                <div class="indicator-grid">
                    <el-divider><strong>{{dividerOption[0]}}</strong></el-divider>
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
                        <el-divider content-position="left"><strong>{{dividerOption[1]}}</strong></el-divider>
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
                    <el-divider><strong>{{dividerOption[2]}}</strong></el-divider>
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
                                    <el-checkbox @click.native="clearDefaultEvt($event)" :indeterminate="isIndeterminateIndr" class="radioCheckitem" v-model="checkAllIndr" @change="handleCheckAllIndrChange">全选</el-checkbox>
                                    <!-- <div style="margin: 15px 0;"></div> -->
                                    <el-checkbox-group v-model="checkedIndrs" @change="selIndicatorValChange">
                                        <el-row v-for="(item,i) in indicatorData" :key="i">
                                            <el-checkbox @click.native="clearDefaultEvt($event)" :label="item" class="radioCheckitem">{{parseIndrListLabel(item)}}</el-checkbox>
                                            <!-- <el-radio v-model="selIndicatorVal" class="radioCheckitem" @change="selIndicatorValChange(item)" :label="item.id">{{item.value}}</el-radio> -->
                                        </el-row>
                                    </el-checkbox-group>
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
                    <el-divider><strong>{{dividerOption[3]}}</strong></el-divider>
                    <el-input 
                        placeholder="请输入内容" 
                        v-model="indicatorSelectedListSearchVal" 
                        @input="indicatorSelectedListValChange" 
                        suffix-icon="el-icon-search"
                        clearable></el-input>  
                    <div class="selected-indr-content">
                        <div v-if="selctedIndictorData" class="res-indicator">
                            <div v-for="(indr,key) in selctedIndictorData" :key="key" class="selectedIntrItem">
                                <span class="selIndicatorName">{{parseIndrListLabel(indr)}}</span>
                                <span class="delSelIndicator">
                                    <el-button size="mini" icon="el-icon-delete" circle @click="delSelIndicator(indr)"></el-button>
                                </span>
                            </div>
                        </div>
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
            indicatorSelectedListSearchVal:null,
            bindedIndicator:null,
            selIndicatorVal:null,//选中的指标label
            indicatorData:[],//指标数据
            indicatorDataCopy:[],//指标数据
            selctedIndictorData:null,//选中的指标数据
            selctedIndictorDataCopy:null,//选中的指标数据
            dimensionlityDataCopy:[],//维度数据
            dimensionlityData:[],//维度数据
            dimensionlityChecked:[],//
            isIndeterminate:false,
            checkAll: false,
            isIndeterminateIndr:false,
            checkAllIndr: false,
            checkedIndrs:[],
            checkAllIndrVal:null,
            filterDimensionlity:null,
        }
    },
    inject:["loadIndrNode","dividerOption","indrSelectChange","calcIndrSelectChange","dimensionData","getIndrDatas","indrPprops","dimensionProp","indicatorListProp"],
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
        indicatorSelectedListValChange(val){
            this.selctedIndictorData = this.selctedIndictorDataCopy.filter(item=>{
                return this.parseIndrListLabel(item).indexOf(val) != -1;
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
            // this.selctedIndictorData = [];
            // this.dimensionlityDataCopy = [];
            this.dimensionlityData = [];
            this.dimensionlityChecked = [];
            this.selIndicatorVal = null;
            this.isIndeterminate = false;
            this.checkAll = false;
            this.isIndeterminateIndr = false,
            this.checkAllIndr = false,
            this.indrSelectChange(data,node,this.$refs.indicatorTree).then(()=>{
                this.getDimensionlityData(data,node,this.$refs.indicatorTree);
            });
        },
        loadNode(node, resolve) {
            this.loadIndrNode(node, resolve);
        },
        delSelIndicator(indr){
            this.selctedIndictorData.forEach((item,i) => {
                if(indr.id == item.id){
                    this.selctedIndictorData.splice(i,1);
                }
            });
            this.checkedIndrs.forEach((item,i) => {
                if(indr.id == item.id)this.checkedIndrs.splice(i,1);
            });
            this.selctedIndictorDataCopy.forEach((item,i) => {
                if(indr.id == item.id)this.selctedIndictorDataCopy.splice(i,1);
            });
            // this.selIndicatorVal = null;
            if(this.selctedIndictorData.length == 0){
                this.$set(this,'indicatorSelectedListSearchVal',null);
                this.$set(this,'selctedIndictorData',this.selctedIndictorDataCopy)
            }
            if(this.selctedIndictorDataCopy.length == 0){
                this.checkAllIndr = false;
                this.isIndeterminateIndr = false;
            }
            this.$emit('selctedIndictorDataChange',this.selctedIndictorDataCopy);
        },
        handleCheckAllIndrChange(val){
            if(val){
                this.$set(this,'checkedIndrs',this.indicatorData.slice(0));
                new Promise((resolve,reject)=>{
                    this.calcIndrSelectChange.bind(this)(resolve,this.checkedIndrs,this.selctedIndictorData);
                }).then(data=>{
                    this.$set(this,'selctedIndictorData',data);
                    this.$emit('selctedIndictorDataChange',data);
                    this.selctedIndictorDataCopy = JSON.parse(JSON.stringify(this.selctedIndictorData));
                });
            }else {
                // this.selctedIndictorData = [];
                this.checkedIndrs = [];
                new Promise((resolve,reject)=>{
                    this.calcIndrSelectChange.bind(this)(resolve,[],this.selctedIndictorData);
                }).then(data=>{
                    this.$set(this,'selctedIndictorData',data);
                    this.$emit('selctedIndictorDataChange',data);
                    this.selctedIndictorDataCopy = JSON.parse(JSON.stringify(this.selctedIndictorData));
                });
            }
            this.isIndeterminateIndr = false;
        },
        selIndicatorValChange(val){
            this.isIndeterminateIndr = val.length < this.indicatorData.length;
            if(val.length == 0)this.isIndeterminateIndr = false;
            this.checkAllIndr = val.length == this.indicatorData.length;
            new Promise((resolve,reject)=>{
                this.calcIndrSelectChange.bind(this)(resolve,val,this.selctedIndictorData);
            }).then(data=>{
                this.$set(this,'selctedIndictorData',data);
                this.$emit('selctedIndictorDataChange',data);
                this.selctedIndictorDataCopy = JSON.parse(JSON.stringify(this.selctedIndictorData));
            });
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
            let valDatas = this.dimensionlityData.filter(item=>{
                return val.includes(item.id);
            })
            let _this = this;
            new Promise((resolve,reject)=>{
                this.getIndrDatas.bind(this)(resolve,reject,val,this.$refs.indicatorTree,valDatas,this.checkedIndrs)
            }).then(data=>{
                this.$set(this,'indicatorData',data);
                this.$set(this,'indicatorDataCopy',data);
                let checkedIndrs = [];
                this.indicatorDataCopy.forEach(item=>{
                    this.checkedIndrs.forEach(ite=>{
                        if(item.id == ite.id)checkedIndrs.push(item);
                    });
                });
                this.checkedIndrs = checkedIndrs;
                this.selIndicatorValChange(this.checkedIndrs);
            });
        }
    },
    destroyed(){
        this.$off('selctedIndictorDataChange');
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
        .selectedIntrItem{
            position:relative;
            padding:8px 3px;
            .delSelIndicator{
                display: inline-block;
                position: absolute;
                top:3px;
                right:10px;
            }
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
