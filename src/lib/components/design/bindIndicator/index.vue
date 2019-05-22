<template>
    <div class="bindIndicator">
        <el-button type="text" icon="el-icon-s-operation" @click="binIndicator">绑定指标</el-button>
        <el-dialog
            title="绑定指标"
            :visible.sync="dialogVisible"
            append-to-body
            width="60%">
            <indicator @selctedIndictorDataChange="selctedIndictorDataChange" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindCellIndicator">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import indicator from './indicator'
// const indicator = resolve => require(['./indicator'],resolve);
export default {
    name:'excel-bind-indr',
    data(){
        return {
            dialogVisible:false,
            resIndrVal:null
        }
    },
    inject:["cellBindIndr","getCurrentActiveCell"],
    components:{indicator},
    methods:{
        bindCellIndicator(){
            this.cellBindIndr(this.getCurrentActiveCell(),this.resIndrVal);
            this.dialogVisible = false;
        },
        selctedIndictorDataChange(val){
            this.$set(this,'resIndrVal',val);
        },
        binIndicator(){
            this.dialogVisible = true;
        }
    }
}
</script>
<style lang="less" scoped>
    .dialog-footer{
        text-align: center;
    }
</style>
