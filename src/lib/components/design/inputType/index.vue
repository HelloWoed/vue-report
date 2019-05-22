<template>
    <div class="inputType">
        <el-row>
            <el-col v-for="(item,i) in typeData" :key="i">
                <el-radio v-model="typeValue" :label="item.label" @change="inputTypeChange(item)">{{item.text}}</el-radio>
            </el-col>
        </el-row>
        <p v-if="typeSelData.config" style="textAlign:center">
            <el-button type="primary" size="small" round @click="optionConf">配置选项</el-button>
        </p>
        <el-dialog
            title="配置选项"
            :visible.sync="confVisible"
            append-to-body
            width="48%">
            <div class="inputTypeConf">
                <TreeConf v-if="typeSelData.label == 'tree'" @resInputSelectionVal="inputTypeConfResVal"/>
                <SelectionConf v-else @resInputSelectionVal="inputTypeConfResVal" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitInputTypeConf">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TreeConf from './treeConf'
import SelectionConf from './selectionConf'
export default {
    name:'excel-input-type',
    data(){
        return {
            confVisible:false,
            typeValue:null,
            typeSelData:{},
            typeData:[
                {
                    label:'text',
                    text:'文本',
                    config:false
                },
                {
                    label:'radio',
                    text:'单选',
                    config:true
                },
                {
                    label:'checkbox',
                    text:'多选',
                    config:true
                },
                {
                    label:'tree',
                    text:'树形结构',
                    config:true
                },
                {
                    label:'fixed',
                    text:'固定值',
                    config:false
                }
            ],
            inputTypeConfChangeData:null
        }
    },
    components:{TreeConf,SelectionConf},
    inject:["inputTypeConfChange","getCurrentActiveCell"],
    mounted(){

    },
    methods:{
        inputTypeConfResVal(val){
            this.inputTypeConfChangeData = {
                type:this.typeSelData,
                options:val
            };
        },
        submitInputTypeConf(){
            this.inputTypeConfChange(this.getCurrentActiveCell(),this.inputTypeConfChangeData);
            this.confVisible = false;
        },
        optionConf(){
            this.confVisible = true;
        },
        inputTypeChange(data){
            this.typeSelData = data;
            if(!data.config){
                this.inputTypeConfChange(this.getCurrentActiveCell(),{
                    type:data
                });
            }
        }
    }
}
</script>
