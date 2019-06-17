<template>
    <div class="calculations">
        <div class="toolbar">
            <el-row :gutter="20">
                <el-col :span="20">
                    <strong>当前运算：</strong><span>{{calcType.name}}</span>
                </el-col>
                <el-col :span="4">
                    <el-button type="warning" size="mini" @click="reset">清 空</el-button>
                </el-col>
            </el-row>
            <div class="calculation-box">
                <template v-for="(item,i) in calculationRes">
                    <span :key="i" >
                        <span
                        class="indr-symbol-item" 
                        :class="{symbolItem:item.type == 'symbol' || typeof item == 'string',activeCalc: curntCalcTar && curntCalcTar.id == item.id && curntCalcTar.value == item.value && curntCalcTarIndex == i,activeFun:item.type == 'function'}" 
                        @click="calcItemActivr(item,i)">
                            <span>{{parseCalcBoardLabel(item)}}</span>
                        </span>
                        <el-tooltip v-if="curntCalcTar && curntCalcTar.id == item.id  && curntCalcTar.value == item.value && curntCalcTarIndex == i && curntCalcTar.type != 'function'" content="删除" placement="bottom" effect="light">
                            <el-button icon="el-icon-close" size="mini" class="reduceCalcItem" circle @click="delCalcItem(item,i)"></el-button>
                        </el-tooltip>
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        calculationRes:{type:Array,default(){return []}},
        calcType:{type:Object,default(){return {id:'005',name:'混合运算'}}}
    },
    watch:{
        calculationRes:{
            handler(newCal,oldVal){
                this.$set(this,'curntCalcTar',newCal[this.curntCalcTarIndex]);
            },deep:true
        }
    },
    inject:["parseCalcBoardLabel"],
    data(){
        let _this = this;
        return {
            curntCalcTar:null,
            curntCalcTarIndex:null,
        }
    },
    methods:{
        calcItemActivr(currentTar,index){
            // if(currentTar.type == 'function')return false;
            if(this.curntCalcTar){
                if(this.curntCalcTarIndex != index){
                    this.$set(this,'curntCalcTar',currentTar);
                    this.$set(this,'curntCalcTarIndex',index);
                }else{
                    this.$set(this,'curntCalcTar',null);
                    this.$set(this,'curntCalcTarIndex',null);
                }
            }else{
                this.$set(this,'curntCalcTar',currentTar);
                this.$set(this,'curntCalcTarIndex',index);
            }
            this.$emit('changeCalcItem',this.curntCalcTar,this.curntCalcTarIndex);
        },
        delCalcItem(currentTar,index){
            this.$set(this,'curntCalcTar',null);
            this.$set(this,'curntCalcTarIndex',null);
            this.$emit('deleteCurntCalcItem',currentTar,index);
        },
        reset(){
            this.$set(this,'curntCalcTar',null);
            this.$set(this,'curntCalcTarIndex',null);
            this.$emit('clearCalculation');
        }
    },
    destroyed(){
        this.$off('clearCalculation');
        this.$off('changeCalcItem');
        this.$off('deleteCurntCalcItem');
    }
}
</script>
<style lang="less" scoped>
    .indr-symbol-item{
        display: inline-block;
        padding:5px 3px;
        cursor:pointer;
        &:hover{
            background: #DCDFE6;
        }
    }
    .symbolItem{
        color: #0679f1;
        &:hover{
            background: #DCDFE6;
        }
    }
    .calculation-box{
        margin-top:20px;
    }
    .activeCalc{
        color: #409EFF;
        background: #DCDFE6;
    }
    .reduceCalcItem{
        margin-left: 5px;
        color:#F56C6C;
    }
    .activeFun{
        color:#c200ff;
    }
</style>
