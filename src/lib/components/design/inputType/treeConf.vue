<template>
    <div class="treeConf">
        <el-input placeholder="请输入内容" v-model="selSearchVal" @input="filterTreeOption" clearable>
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <p v-if="treeOption.length > 0">
            <el-row v-for="(item,i) in treeOption" :key="i">
                <el-radio v-model="treeOptionVal" class="radioCheckitem" @change="treeOptionValChange(item)" :label="item.id">{{item.name}}</el-radio>
            </el-row>
        </p>
        <p class="noData" v-else>
            <span>暂无数据</span>
        </p>
    </div>
</template>
<script>
export default {
    data(){
        return {
            selSearchVal:null,
            treeOption:[],
            treeOptionCopy:[],
            treeOptionVal:null,
        }
    },
    mounted(){
        this.getTreeOption();
    },
    methods:{
        filterTreeOption(){
            this.treeOption = this.treeOptionCopy.filter(option => {
                return option.name.indexOf(this.selSearchVal) != -1;
            });
        },
        getTreeOption(){
            this.treeOption = [
                {id:'001',name:'全国'},
                {id:'002',name:'北京'},
                {id:'003',name:'西安'}
            ];
            this.treeOptionCopy = this.treeOption;
        },
        treeOptionValChange(data){
            this.$emit('resInputSelectionVal',data);
        }
    }
}
</script>
<style lang="less" scoped>
    .radioCheckitem{
        margin: 5px 0;
    }
    .noData{
        text-align: center;
        color:#909399;
    }
</style>
