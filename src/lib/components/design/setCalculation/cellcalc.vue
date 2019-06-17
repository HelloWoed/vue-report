<template>
    <div class="cellCalc">
        <Calculation 
        @complete="complateSetCalc"
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
<script>
import Calculation from '../../calculation/calcul'
export default {
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }}
    },
    inject:["cellCalculationConfig","setJoinedIndrs","showCalc"],
    components:{Calculation},
    data(){
        return {
            cellCalcConfig:{},
            attrDataConf:{}
        }
    },
    created(){
        this.cellCalcConfig = this.cellCalculationConfig();
        this.attrDataConf = this.cellCalcConfig.attr_data_conf;
        Object.keys(this.cellCalcConfig.event_ele_conf).forEach(eName=>{
            if(eName !='created' && eName != 'mounted' && eName != 'destroyed'){
                this[eName] = this.cellCalcConfig.event_ele_conf[eName].bind(this)
            }
        });
        if(this.cellCalcConfig.event_ele_conf.created){
            this.cellCalcConfig.event_ele_conf.created.bind(this)();
        }
    },
    mounted(){
        if(this.cellCalcConfig.event_ele_conf.mounted){
            this.cellCalcConfig.event_ele_conf.mounted.bind(this)();
        }
    },
    methods:{
        complateSetCalc(data){
            this.setJoinedIndrs(data);
            this.showCalc(data);
            this.completeCalculation(data);
        }
    },
    destroyed(){
        if(this.cellCalcConfig.event_ele_conf.destroyed){
            this.cellCalcConfig.event_ele_conf.destroyed.bind(this)();
        }
    }
}
</script>
