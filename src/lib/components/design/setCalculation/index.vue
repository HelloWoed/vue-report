<template>
    <div class="setCalculation">
        <el-button type="text" icon="el-icon-edit-outline" @click="setCalc">设置计算公式</el-button>
        <p class="resCalc" v-if="showCalcData">
             <template v-for="(item,i) in showCalcData">
                <span :key="i" >
                    <span
                    class="indr-symbol-item" 
                    :class="{symbolItem:item.type == 'symbol' || typeof item == 'string',funItem:item.type != 'indr' && typeof item != 'string' && item.type != 'symbol'}">
                        <span>&nbsp;{{parseIndrListLabel(item)}}&nbsp;</span>
                    </span>
                </span>
            </template>
        </p>
        <el-dialog
            title="单元格计算公式"
            :visible.sync="dialogVisible"
            :modal="false"
            :fullscreen="true"
            width="60%">
            <cellCalc :currentActiveCell="currentActiveCell" />
        </el-dialog>
    </div>
</template>
<script>
import cellCalc from './cellcalc'
export default {
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }}
    },
    data(){
        let _this = this;
        return {
            parseIndrListLabel:(item)=>{
                if(_this.indicatorListProp.toLocaleString() == "[object Object]"){
                   return item[_this.indicatorListProp.label]
                }else{
                    return _this.indicatorListProp.bind(_this)(item,_this)
                }
            },
            dialogVisible:false,
            cellCalcConfig:null,
            indicatorListProp:null,
            showCalcData:null
        }
    },
    inject:["cellCalculationConfig"],
    components:{cellCalc},
    created(){
        this.cellCalcConfig = this.cellCalculationConfig();
        this.indicatorListProp = this.cellCalcConfig.attr_data_conf.indicatorListProp
    },
    methods:{
        setCalc(){
            this.dialogVisible = true;
        },
        showCalc(data){
            this.$set(this,'showCalcData',data);
        }
    },
    provide(){
        return {
            showCalc:this.showCalc
        }
    }
}
</script>
<style lang="less" scoped>
    .symbolItem{
        color: #0679f1;
    }
    .funItem{
        color: #c200ff;  
    }
</style>
