<template>
    <div class="joinIndr">
        <div v-if="indrsDatas.length == 0">
            <p class="noData">
                <span>暂无数据,请设置计算公式</span>
            </p>
        </div>
        <div v-else>
            <template v-for="(indr,i) in indrsDatas">
                <el-row :key="i" class="indrList">
                    <span>{{i + 1 + '  '}}</span>
                    <span class="indrName">{{parseIndrListLabel(indr)}}</span>
                </el-row>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }},
        joinedIndrs:{
            type:Array,
            default(){
                return []
            }
        }
    },
    inject:["cellCalculationConfig"],
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
            indicatorListProp:null,
            cellCalcConfig:null,
            indrsDatas:[]
        }
    },
    created(){
        this.cellCalcConfig = this.cellCalculationConfig();
        this.indicatorListProp = this.cellCalcConfig.attr_data_conf.indicatorListProp
    },
    watch:{
        joinedIndrs:{
            handler(newData,oldData){
                this.setIndrDatas(newData)
            },deep:true
        }
    },
    methods:{
        setIndrDatas(data){
            let datas = [];
            data.forEach(indr => {
                if(typeof indr != 'string')datas.push(indr);
            });
            this.$set(this,'indrsDatas',datas);
        }
    }
}
</script>
<style lang="less" scoped>
    .indrName{
        color:#606266;
    }
    .indrList{
        color:#606266;
    }
    .noData{
        text-align: center;
        color:#909399;
    }
</style>
