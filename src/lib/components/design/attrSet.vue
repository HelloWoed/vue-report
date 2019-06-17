<template>
    <div class="attr">
        <el-divider><strong class="settingTitle">设置</strong></el-divider>
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
                <template slot="title">
                    <strong>定义指标</strong>
                </template>
                <bindIndicator />
            </el-collapse-item>
            <el-collapse-item v-if="currentActiveCell && currentActiveCell.cell_area_type != 'calcArea' && currentActiveCell.cell_area_type != 'quote'" name="2">
                <template slot="title">
                    <strong>输入内容类型</strong>
                </template>
                <inputContentType :currentActiveCell="currentActiveCell" />
            </el-collapse-item>
            <el-collapse-item v-if="currentActiveCell && currentActiveCell.cell_area_type != 'calcArea' && currentActiveCell.cell_area_type != 'quote'"  name="3">
                <template slot="title">
                    <strong>输入方式</strong>
                </template>
                <inputType :currentActiveCell="currentActiveCell" />
            </el-collapse-item>
            <el-collapse-item v-if="currentActiveCell && currentActiveCell.cell_area_type == 'calcArea' && currentActiveCell.cell_area_type != 'quote'" name="4">
                <template slot="title">
                    <strong>参与计算的指标</strong>
                </template>
                <joinIndr :currentActiveCell="currentActiveCell" :joinedIndrs="joinedIndrs" />
            </el-collapse-item>
            <el-collapse-item v-if="currentActiveCell && currentActiveCell.cell_area_type == 'calcArea' && currentActiveCell.cell_area_type != 'quote'" name="5">
                <template slot="title">
                    <strong>设置计算公式</strong>
                </template>
                <setCalc :currentActiveCell="currentActiveCell" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import bindIndicator from './bindIndicator'
import inputType from './inputType'
import inputContentType from './inputContentType'
import joinIndr from './joinIndrs'
import setCalc from './setCalculation'
export default {
    props:{
        currentActiveCell:{type:Object,default(){
            return {};
        }}
    },
    data(){
        return {
            activeNames:['3','5','1'],
            joinedIndrs:[]
        }
    },
    components:{bindIndicator,inputType,inputContentType,joinIndr,setCalc},
    methods:{
        setJoinedIndrs(data){
            this.$set(this,'joinedIndrs',data)
        }
    },
    provide(){
        return {
            setJoinedIndrs:this.setJoinedIndrs
        }
    }
}
</script>
<style lang="less" scoped>
    .attr{
        padding: 20px;
        .settingTitle{
            color:#409EFF;
        }
    }
</style>
