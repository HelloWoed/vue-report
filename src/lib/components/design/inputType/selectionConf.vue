<template>
    <div class="selectionConf">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-divider><strong>选择列表</strong></el-divider>
                <el-input 
                placeholder="请输入内容" 
                v-model="selListSearchVal" 
                @input="filterSelList" 
                clearable 
                suffix-icon="el-icon-search"></el-input>   
                <p v-if="selectionListData.length > 0">
                    <el-row v-for="(item,i) in selectionListData" :key="i">
                        <el-radio @click.native="clearDefaultEvt($event)" v-model="selListVal" class="radioCheckitem" @change="selSelValChange(item)" :label="item.id">{{parseSelectRadioLabel(item)}}</el-radio>
                    </el-row>
                </p>
                <p class="noData" v-else>
                    <span>暂无数据</span>
                </p>
            </el-col>
            <el-col :span="12">
                <el-divider><strong>选择项</strong></el-divider>
                <p v-if="selectionData.length > 0">
                    <el-checkbox @click.native="clearDefaultEvt($event)" :indeterminate="isIndeterminate" v-model="checkAll" class="radioCheckitem" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedOptions" @change="selOptionValChange">
                        <el-row v-for="(option,i) in selectionData" :key="i">
                            <el-checkbox @click.native="clearDefaultEvt($event)" :label="option" class="radioCheckitem">{{parseSelectCheckBoxLabel(option)}}</el-checkbox>
                        </el-row>
                    </el-checkbox-group>
                </p>
                <p class="noData" v-else>
                    <span>暂无数据</span>
                </p>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {syncMethod} from '../../utils/excel'
export default {
    data(){
        let _this = this;
        return {
            parseSelectRadioLabel:(item)=>{
               return  _this.selectionRadioProp.bind(_this)(item)
            },
            parseSelectCheckBoxLabel:(item)=>{
               return  _this.selectionCheckBoxProp.bind(_this)(item)
            },
            selectionListData:[],
            selectionListDataCopy:[],
            selectionData:[],
            selListVal:null,
            selListSearchVal:null,
            selVal:null,
            isIndeterminate:false,
            checkAll: false,
            checkedOptions:[],
            resData:{}
        }
    },
    mounted(){
        this.getSelListData();
    },
    inject:["confSelectionData","confSelectionItemData","selectionRadioProp","selectionCheckBoxProp"],
    methods:{
        clearDefaultEvt(e){
            e.stopPropagation();
        },
        getSelListData(){
            syncMethod(this.confSelectionData).then((data)=>{
                this.selectionListData = data;
                this.selectionListDataCopy = this.selectionListData;
            })
            
        },
        filterSelList(){
            this.selectionListData = this.selectionListDataCopy.filter(list=>{
                return list.name.indexOf(this.selListSearchVal) != -1;
            });
        },
        selSelValChange(data){
            this.checkAll = false;
            this.checkedOptions = [];
            syncMethod(this.confSelectionItemData,data).then(data=>{
                this.selectionData = data;
            }); 
        },
        handleCheckAllChange(val){
            let checkedOptions = [];
            this.selectionData.forEach(option=>{
                checkedOptions.push(option);
            });
            this.checkedOptions = val ? checkedOptions : [];
            this.isIndeterminate = false;
            this.$emit('resInputSelectionVal',this.checkedOptions.length == 0 ? [] : this.selectionData);
        },
        selOptionValChange(value){
            this.checkAll = value.length == this.selectionData.length;
            this.isIndeterminate = value.length > 0 && value.length < this.selectionData.length;
            this.$emit('resInputSelectionVal',value);
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
