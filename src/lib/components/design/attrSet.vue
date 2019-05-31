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
            <el-collapse-item name="2">
                <template slot="title">
                    <strong>输入内容类型</strong>
                </template>
                <inputContentType />
            </el-collapse-item>
            <el-collapse-item  name="3">
                <template slot="title">
                    <strong>输入方式</strong>
                </template>
                <inputType :currentActiveCell="currentActiveCell" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import bindIndicator from './bindIndicator'
import inputType from './inputType'
import inputContentType from './inputContentType'
export default {
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }}
    },
    data(){
        return {
            activeNames:['3']
        }
    },
    components:{bindIndicator,inputType,inputContentType}
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
