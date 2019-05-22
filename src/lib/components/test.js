var a = {
    cancel(){
            this.dialogConf.dialogShow = false
        },
    onSubmit:function(){
            console.log('提交成功');
        },
    unSubmit:function(){
            console.log('取消提交');
            this.dialogConf.dialogShow = false
        },
    mounted:function(){
     this.rootStore = this.GetRoot(this);
     this.rootStore.页面名称 = {};
    }
    }