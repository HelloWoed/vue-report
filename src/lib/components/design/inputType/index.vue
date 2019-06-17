<template>
    <div class="inputType">
        <el-row>
            <el-col v-for="(item,i) in typeData" :key="i">
                <el-radio v-model="typeValue" :label="item.label" @click.native="clearDefaultEvt($event)" @change="inputTypeChange(item)">{{item.text}}</el-radio>
            </el-col>
        </el-row>
        <p v-if="typeSelData.config" style="textAlign:center">
            <el-button type="primary" size="small" round @click="optionConf">配置选项</el-button>
        </p>
        <el-dialog
            title="配置选项"
            v-if="confVisible"
            :visible.sync="confVisible"
            :modal="false"
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
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }}
    },
    watch:{
        currentActiveCell:{
            handler(newVal,oldVal){
                this.typeValue = newVal.cell_render_type;
                this.typeData.forEach(data=>{
                    if(data.label == this.typeValue){
                        this.$set(this,'typeSelData',data);
                    }
                });
            },deep:true
        }
    },
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
    inject:["inputTypeConfChange","getCurrentActiveCell","getTableData","setTableData"],
    mounted(){
        
    },
    methods:{
        clearDefaultEvt(e){
            e.stopPropagation();
        },
        inputTypeConfResVal(val){
            this.inputTypeConfChangeData = {
                type:this.typeSelData,
                options:val
            };
        },
        setCellInputType(){
            let tableData = this.getTableData();
            let cell = this.getCurrentActiveCell();
            let data = this.inputTypeConfChangeData;
            tableData[cell.row_index][cell.col_index].cell_render_type = data.type.label;
            if(data.options)tableData[cell.row_index][cell.col_index].cell_options = data.options;
            this.setTableData(tableData);
            this.inputTypeConfChange(this.getCurrentActiveCell(),this.inputTypeConfChangeData);
        },
        submitInputTypeConf(){
            this.setCellInputType();
            this.confVisible = false;
        },
        optionConf(){
            this.confVisible = true;
        },
        inputTypeChange(data){
            this.typeSelData = data;
            if(!data.config){
                this.$set(this,'inputTypeConfChangeData',{
                    type:data
                });
                this.setCellInputType();
            }
        }
    }
}
</script>
