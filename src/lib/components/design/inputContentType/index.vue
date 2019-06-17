<template>
    <div class="inputContentType">
        <el-row>
             <el-radio v-model="typeValue" label="text" :disabled="true" @click.native="clearDefaultEvt($event)" @change="inputContentTypeChange">文本</el-radio>
             <div v-if="typeValue == 'text'">
                <p>
                     <span>最少允许输入长度</span>
                    <span>
                        <el-input type="number" v-model="stringType.minlength" autofocus @change="inputContentTypeChange" @input="inputHandle" class="input" min="1" size="mini"></el-input>
                    </span>
                    <span>个字符</span>
                </p>
                <p>
                     <span>最大允许输入长度</span>
                    <span>
                        <el-input type="number" v-model="stringType.maxlength" autofocus @change="inputContentTypeChange" @input="inputHandle" class="input" min="1" size="mini"></el-input>
                    </span>
                    <span>个字符</span>
                </p>
             </div>
        </el-row>
        <el-row>
            <el-radio v-model="typeValue" label="number" :disabled="true" @click.native="clearDefaultEvt($event)" @change="inputContentTypeChange">数字</el-radio>
            <div v-if="typeValue == 'number'">
                <p>
                    <!-- <span>值类型：</span>
                    <el-radio v-model="numberType.type" label="int" @click.native="clearDefaultEvt($event)" @change="inputContentTypeChange">整数</el-radio>
                    <el-radio v-model="numberType.type" label="float" @click.native="clearDefaultEvt($event)" @change="inputContentTypeChange">小数</el-radio> -->
                    <el-checkbox @click.native="clearDefaultEvt($event)" v-model="numberType.isAllowFloat" @change="inputContentTypeChange">是否允许小数</el-checkbox>
                </p>
                <p>
                    <span>最小值：</span>
                    <span>
                        <el-input type="number" v-model="numberType.min" @change="inputContentTypeChange" class="input" size="mini" autofocus ></el-input>
                    </span>
                </p>
                <p>
                    <span>最大值：</span>
                    <span>
                        <el-input type="number" v-model="numberType.max" @change="inputContentTypeChange" class="input" size="mini"></el-input>
                    </span>
                </p>
                <div class="floatSet">
                    <p>
                        <span>小数位：</span>
                        <span>
                            <el-input type="number" v-model="numberType.floatLenggth" @change="inputContentTypeChange" class="input" size="mini"></el-input>
                        </span>
                    </p>
                    <p>
                        <el-checkbox @click.native="clearDefaultEvt($event)" v-model="numberType.autoFloatLength" @change="inputContentTypeChange">是否自动补齐小数位数</el-checkbox>
                    </p>
                </div>
            </div>
        </el-row>
        <div class="subBtn">
            <el-button type="primary" size="mini" @click="submitData">保 存</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'excel-input-content-type',
    props:{
        currentActiveCell:{type:Object,default(){
            return null;
        }}
    },
    data(){
        return {
            result:null,
            typeValue:null,
            stringType:{
                maxlength:null,
                minlength:null,
            },
            numberType:{
                isAllowFloat:null,
                min:null,
                max:null,
                auto_float_length:null,
                auto_float_length:null,
                // type:null,
            }
        }
    },
    watch:{
        currentActiveCell:{
            handler(newVal,oldVal){
                if(newVal.cell_indr && newVal.cell_indr.data_type){
                    if(newVal.cell_indr.data_type.toLocaleLowerCase() == 'string'){
                        this.typeValue = 'text'
                    }
                    if(newVal.cell_indr.data_type.toLocaleLowerCase() == 'number'){
                        this.typeValue = 'number'
                    }
                }
            },deep:true
        }
    },
    inject:["cellInputContentSet","getCurrentActiveCell"],
    mounted(){
        
    },
    methods:{
        clearDefaultEvt(e){
            e.stopPropagation();
        },
        submitData(){
            if(!this.result){
                this.$message({
                    message:'请正确输入值后保存！@_@',
                    type:'warning'
                });
            }else{
                this.cellInputContentSet(this.getCurrentActiveCell(),this.result);
            }
            
        },
        inputHandle(val){
            // console.log(val)
        },
        inputContentTypeChange(){
            this.result = {
                type:this.typeValue
            }
            if(this.typeValue == 'text'){
                this.result.maxlength = this.stringType.maxlength ? this.stringType.maxlength - 0 : null;
                this.result.minlength = this.stringType.minlength ? this.stringType.minlength - 0 : null;
            }else if(this.typeValue == 'number'){
                this.result.max = this.numberType.max ? this.numberType.max - 0 : null;
                this.result.min = this.numberType.min ? this.numberType.min - 0 : null;
                // this.result.num_type = this.numberType.type;
                this.result.float_lenggth = this.numberType.floatLenggth ? this.numberType.floatLenggth - 0 : null;
                this.result.auto_float_length = this.numberType.autoFloatLength;
                this.result.isAllowFloat = this.numberType.isAllowFloat;
                // if(this.numberType.type == 'float'){
                //     this.result.float_lenggth = this.numberType.floatLenggth - 0;
                //     this.result.auto_float_length = this.numberType.autoFloatLength;
                // }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .input{
        width:40%;
    }
    .subBtn{
        text-align: center;
    }
</style>
