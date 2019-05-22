<template>
    <div class="e-borders">
        <div class="e-border border-top" :style="borderConf.topStyle"></div>
        <div class="e-border border-right" :style="borderConf.rightStyle"></div>
        <div class="e-border border-bottom" :style="borderConf.bottomStyle"></div>
        <div class="e-border border-left" :style="borderConf.leftStyle"></div>
        <div class="corner" :class="{cornerHover:cornerEvent}" 
        :style="borderConf.cornerStyle"
        @mousedown.stop="copyHandler"></div>
        <div class="ve-paint-border"
            :style="borderConf.paintStyle"
            ref="dashedBorder"
            :min-col="paint.minCol"
            :max-col="paint.maxCol"
            :min-row="paint.minRow"
            :max-row="paint.maxRow"
            v-if="visableDashedBorder">
        </div>
    </div>
</template>
<script>
import {bind, unbind, mouseMoveUp} from '../utils/event.js'
import {getColTpl, getAttrs} from '../utils/excel'
export default {
    name:'border',
    props: {
        cornerEvent:{type:Boolean,default(){return true;}},
        state:{type:String,default:'design'},
        color: { type: String, default: 'rgb(75, 137, 255)' },
        paintDash:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            paint:{},
            visableDashedBorder:false,
            mouseRightMenuStyle:{},
            borderConf:{},
            colActives: [],
            rowActives: [],   
            copyConf:{}
        }
    },
    inject:['getTableData','setTableData','getBorderConf','setBorderConf','setPaintDash'],
    watch:{
        borderConf:{
            handler(newVal,oldVal){
                this.setBorderConf(newVal);
            },deep:true
        },
        paintDash:{
            handler(nVal,oVal){
                this.renderPaint();
            },deep:true
        }
    },
    mounted(){
        // bind('mousedown',this.mousedownHandler);
        this.setBorderConf(this.borderConf);
        this.$on('updateBorder',()=>{
            this.updateBorders();
        })
    },
    methods:{
        updateBorders(){
            window.setTimeout(()=>{
                this.setBorderStyle();
                let attrs = getAttrs(this.borderConf.startTarget);
                let newpaintDashData = JSON.parse(JSON.stringify(this.paintDash));
                newpaintDashData.attrs = attrs;
                this.setPaintDash(newpaintDashData);
            },0);
        },
        renderPaint(){
            console.log('render paint');
            let {paintInfo,attrs} = this.paintDash;
            this.paint = paintInfo;
            this.$set(
                this.borderConf,
                'paintStyle',
                {left: `${attrs.left - 1}px`, top: `${attrs.top - 1}px`, width: `${attrs.width}px`, height: `${attrs.height}px`}
            );
            this.visableDashedBorder = true;
        },
        copyHandler(evt){
            if(!this.cornerEvent)return false;
            let _this = this;
            mouseMoveUp((moveEvt)=>{
                let {target} = moveEvt;
                while(target && target.nodeName != "TD"){
                    target = target.parentNode;
                }
                if(!target || target.getAttribute('type')!=='cell')return false;
                let rowIndex = target.getAttribute('row-index');
                let cowIndex = target.getAttribute('col-index');
                let {$refs} = this.$parent
                this.borderConf.endTarget = $refs[`cell_${rowIndex}_${cowIndex}`][0];
                let startCellAttr = getAttrs(this.borderConf.startTarget);
                let endCellAttr = getAttrs(this.borderConf.endTarget);
                if(!(startCellAttr.row == endCellAttr.row || startCellAttr.col == endCellAttr.col))return false;
                let minRow = endCellAttr.row < startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let maxRow = endCellAttr.row > startCellAttr.row ? endCellAttr.row : startCellAttr.row;
                let minCol = endCellAttr.col < startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let maxCol = endCellAttr.col > startCellAttr.col ? endCellAttr.col : startCellAttr.col;
                let startTarAttr = getAttrs($refs[`cell_${minRow}_${minCol}`][0]);
                let endTarAttr = getAttrs($refs[`cell_${maxRow}_${maxCol}`][0]);
                this.paint = {
                    minRow,
                    maxRow,
                    minCol,
                    maxCol
                }
                let attrs = {
                    height:endTarAttr.top - startTarAttr.top + endTarAttr.height,
                    width:endTarAttr.left - startTarAttr.left + endTarAttr.width,
                    left:startTarAttr.left,
                    top:startTarAttr.top
                }
                this.$set(
                    this.borderConf,
                    'paintStyle',
                    {left: `${attrs.left - 1}px`, top: `${attrs.top - 1}px`, width: `${attrs.width}px`, height: `${attrs.height}px`}
                );
                this.visableDashedBorder = true;
                this.copyConf.ctrl = moveEvt.ctrlKey;//是否按下ctrl键
            },(upEvt)=>{
                this.visableDashedBorder = false;
                let startTarAttr = getAttrs(this.borderConf.startTarget);
                let tableData = this.getTableData();
                let startTarStyle = tableData[startTarAttr.row][startTarAttr.col].cell_style;
                let startVal = tableData[startTarAttr.row][startTarAttr.col].cell_value;
                const {maxCol,maxRow,minCol,minRow} = this.paint;
                if(maxCol == minCol){
                    if(startVal - 0 == startVal){
                        if(this.copyConf.ctrl){
                            for(let i = minRow; i <= maxRow; i++){
                                tableData[i][maxCol].cell_value = startVal;
                                tableData[i][maxCol].cell_style = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(startTarStyle))));
                            }
                        }else{
                            if(startTarAttr.row == minRow){
                                for(let i = minRow + 1; i <= maxRow; i++){
                                    tableData[i][maxCol].cell_value = tableData[i-1][maxCol].cell_value - 0 + 1;
                                    tableData[i][maxCol].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                                }
                            }
                            if(startTarAttr.row == maxRow){
                                for(let j = maxRow - 1; j >= minRow; j--){
                                    tableData[j][maxCol].cell_value = tableData[j+1][maxCol].cell_value - 0 - 1;
                                    tableData[j][maxCol].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                                }
                            }
                        }
                    }else{
                        for(let i = minRow; i <= maxRow; i++){
                            tableData[i][maxCol].cell_value = startVal;
                            tableData[i][maxCol].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                        }
                    }
                }
                if(maxRow == minRow){
                    if(startVal - 0 == startVal){
                        if(this.copyConf.ctrl){
                            for(let j = minCol; j <= maxCol; j++){
                                tableData[maxRow][j].cell_value = startVal;
                                tableData[maxRow][j].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                            }
                        }else{
                            if(startTarAttr.col == minCol){
                                for(let i = minCol + 1; i <= maxCol; i++){
                                    tableData[maxRow][i].cell_value = tableData[maxRow][i -1].cell_value - 0 + 1;
                                    tableData[maxRow][i].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                                }
                            }
                            if(startTarAttr.col == maxCol){
                                for(let j = maxCol - 1; j >= minCol; j--){
                                    tableData[maxRow][j].cell_value = tableData[maxRow][j + 1].cell_value - 0 - 1;
                                    tableData[maxRow][j].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                                }
                            }
                        }
                    }else{
                        for(let j = minCol; j <= maxCol; j++){
                            tableData[maxRow][j].cell_value = startVal;
                            tableData[maxRow][j].cell_style = JSON.parse(JSON.stringify(startTarStyle));
                        }
                    }
                }
                this.$emit('copyCell',tableData);
            })
        },
        // mousedownHandler(evt){
        //     if(evt.button == 0){
        //         let {target} = evt;
        //         while(target && target.nodeName != "TD"){
        //             target = target.parentNode;
        //         }
        //         if (target && target.getAttribute('type') === 'cell') {
        //             this.visableDashedBorder = false;
        //             Object.assign(this.borderConf, {startTarget: target, endTarget: target});
        //             this.setBorderStyle();
        //         }
        //     }else if(evt.button == 2){
        //         //右键
        //     }
        // },
        setBorderStyle(){
            const attrs = getAttrs(this.borderConf.startTarget);
            Object.assign(this.borderConf, {...attrs});
            this.$set(
                this.borderConf,
                'topStyle',
                {background: this.color, left: `${this.borderConf.left - 1}px`, top: `${this.borderConf.top - 1}px`, width: `${this.borderConf.width + 1}px`, height: '2px'}
            )
            this.$set(
                this.borderConf,
                'rightStyle',
                {background: this.color, left: `${this.borderConf.left+this.borderConf.width}px`, top: `${this.borderConf.top - 1}px`, width: '2px', height: `${this.borderConf.height}px`}
            )
            this.$set(
                this.borderConf,
                'bottomStyle',
                {background: this.color, left: `${this.borderConf.left - 1}px`, top: `${this.borderConf.top+this.borderConf.height}px`, width: `${this.borderConf.width + 1}px`, height: '2px'}
            )
            this.$set(
                this.borderConf,
                'leftStyle',
                {background: this.color, left: `${this.borderConf.left-1}px`, top: `${this.borderConf.top}px`, width: '2px', height: `${this.borderConf.height}px`}
            )
            this.$set(
                this.borderConf,
                'cornerStyle',
                {background: this.color, left: `${this.borderConf.left + this.borderConf.width - 5}px`, top: `${this.borderConf.top + this.borderConf.height - 5}px`}
            )
        }
    },
    destroyed () {
        // unbind('mousedown', this.mousedownHandler)
        this.$off('copyCell');
        this.$off('updateBorder');
    }
}
</script>
<style lang="less" scoped>
    .e-borders {
        box-sizing: content-box;

        .e-border, .e-area-background {
            position: absolute;
            font-size: 0;
            pointer-events: none;
            z-index: 200;
        }

        .corner {
            font-size: 0;
            height: 5px;
            width: 5px;
            border: 2px solid rgb(255, 255, 255);
            position: absolute;
            bottom: -6px;
            right: -6px;
            z-index: 300;
        }
        .cornerHover{
            cursor: crosshair;
        }
        .ve-paint-border {
            position: absolute;
            pointer-events: none;
            border: 1px dashed rgb(75, 137, 255);
            background: rgba(75, 137, 255, .2);
        }
    }
    
</style>
