/**
 * 生成列头名称
 */
export function getBaseColTitle(count){
    const baseColTitle = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let title = [];
    baseColTitle.forEach(val=>{
        title.push({
            value:val,
            style:{}
        })
    })
    for(let i = 0;i<26;i++){
        for(let j = 0;j<26;j++){
            title.push({
                value:`${baseColTitle[i]}${baseColTitle[j]}`,
                style:{}
            })
        }
    }
    return title.splice(0,count);
}  
/**
 * 获取行数据
 * @param {*} count 
 */
export function getRowData(count){
    let rowData = [];
    for(let i = 0; i < count;i++){
        rowData.push({
            value:i,
            style:{}
        })
    }
    return rowData;
} 
const getId = function(){
    var d = new Date().getTime();
    var uid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    return uid;
}
const getColTpl = function(type){
    if(!type)type = 'cell';
    return {
        cell_value:'',
        cell_rowspan:1,
        cell_colspan:1,
        cell_area_type:'inputArea',
        cell_render_type:'text',//单元格默认为text
        cell_type:type,
        cell_id:getId(),
        cell_style:{width:'200px'}
    }
}
export {getColTpl}
/**
 * 初始化数据
 * @param {*} rowCount 
 * @param {*} colCount 
 */
export function initTableData(rowCount,colCount){
    let tableData = [];
    let cllTitle = getBaseColTitle(colCount)
    for(let i=0;i<=rowCount;i++){
        let rowTpl = [];
        for(let j=0;j<=colCount;j++){
            let colTpl = null;
            if(i == 0 && j == 0){
                colTpl = getColTpl('cell-col-row-header');
                colTpl.cell_style.width = '60px';
                colTpl.cell_style.background = '#fff';
            }else{
                if(i == 0){
                    colTpl = getColTpl('cell-col-header');
                }else if( j == 0){
                    colTpl = getColTpl('cell-row-header');
                    colTpl.cell_style.width = '60px'
                }else{
                    colTpl = getColTpl();
                }
                
            }
            rowTpl.push(colTpl);
        }
        tableData.push(rowTpl);
    }
    return tableData;
}
/**
 * 生成插入行列数据
 * @param {*} row 
 * @param {*} col 
 */
export function getInsertTableData(rowCount,colCount){
    let tableData = [];
    for(let i = 0;i < rowCount; i++){
        let rowTpl = [];
        for(let j=0;j<=colCount;j++){
            let colTpl = null;
            if( j == 0){
                colTpl = getColTpl('cell-row-header');
            }else{
                colTpl = getColTpl();
            }
            rowTpl.push(colTpl);
        }
        tableData.push(rowTpl);
    }
    return tableData;
}
/**
 * 获取单元格属性
 * @param {*} target 
 */
export function getAttrs(target){
    const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = target;
    return {
        cellId: target.getAttribute('cell-id'),
        row: parseInt(target.getAttribute('row-index')),
        col: parseInt(target.getAttribute('col-index')),
        rowspan: parseInt(target.getAttribute('rowspan')),
        colspan: parseInt(target.getAttribute('colspan')),
        areatype: target.getAttribute('areatype'),
        left: offsetLeft,
        top: offsetTop,
        width: offsetWidth,
        height: offsetHeight
    }
}
/**
 * 删除行
 */
export function deleteRow(){
    this.attrDataConf.rowCount -= 1;
    let target = this.borderConf.startTarget;
    let tarAttr = getAttrs(target);
    let {tableData} = this;
    tableData.splice(tarAttr.row,1);
    this.$set(this,'tableData',tableData);
}
/**
 * 删除列
 */
export function deleteCol(){
    this.attrDataConf.colCount -= 1;
    let target = this.borderConf.startTarget;
    let tarAttr = getAttrs(target);
    let {tableData} = this;
    tableData.forEach(row =>{
        row.splice(tarAttr.col,1);
    });
    this.$set(this,'tableData',tableData);
}
/**
 * 插入行
 * @param {*} num 
 */
export function insertRow(num){
    this.attrDataConf.rowCount = this.attrDataConf.rowCount - 0 + num - 0;
    let {tableData} = this;
    let target = this.borderConf.startTarget;
    let tarAttr = getAttrs(target);
    let insertData = getInsertTableData(num,this.attrDataConf.colCount);
    insertData.forEach(rowData => {
        tableData.splice(tarAttr.row,0,rowData);
    })
    this.setTableData(tableData);
}
/**
 * 插入列
 * @param {*} num 
 */
export function insertCol(num){
    let {tableData} = this;
    let target = this.borderConf.startTarget;
    let tarAttr = getAttrs(target);
    this.attrDataConf.colCount = this.attrDataConf.colCount - 0 + num - 0;
    let tableHeaderData = getBaseColTitle(this.attrDataConf.colCount);
    this.$set(this,'tableHeaderData',tableHeaderData);
    tableData.forEach((row,r) => {
        for(let c = 0; c < num; c++){ 
            if(r == 0){
                row.splice(tarAttr.col,0,getColTpl('cell-col-header'))
            }else{
                row.splice(tarAttr.col,0,getColTpl())
            }
        }
    });
    this.setTableData(tableData);
}
/**
 * 指标默认数据
 * @param {*} node 
 * @param {*} resolve 
 */
export function defaultLoadIndr(node, resolve){
    if (node.level === 0) {
        return resolve([{id:Math.ceil(Math.random()*100000) + new Date().getTime(), name: 'region' }]);
    }
    if (node.level >= 1) setTimeout(() => {
        const data = [{
            id:Math.ceil(Math.random()*100000) + new Date().getTime(),
            name: 'leaf',
            leaf: true
        }, {
            id:Math.ceil(Math.random()*100000) + new Date().getTime(),
            name: 'zone'
        }];
        return resolve(data);
    }, 500);
}
/**
 * 数据异步处理方法
 */
export function syncMethod(){
    let arg = [].slice.call(arguments);
    return new Promise((resolve,reject)=>{
        arg[0](resolve,...arg.slice(1))
    });
}
/**
 * 拆分单元格
 */
export function splitCell(){
    if(this.borderConf.startTarget != this.borderConf.endTarget)return false;
    this.paint = this.paintDash.paintInfo;
    let attrs = getAttrs(this.borderConf.startTarget);
    let tableData = this.getTableData();
    for(let r = this.paint.minRow; r < this.paint.minRow + attrs.rowspan; r++){
        for(let c = this.paint.minCol; c < this.paint.minCol + attrs.colspan; c++){
            tableData[r][c].cell_colspan = 1;
            tableData[r][c].cell_rowspan = 1;
            delete tableData[r][c].cell_style.display;
            if(r == this.paint.minRow && c == this.paint.minCol)continue;
            tableData[r][c].cell_value = '';
        };
    };
    this.setTableData(tableData);
    this.$refs.eborder.$emit('updateBorder');
    this.$emit('hideMenuBox');
}
export function getRowColMaxSpan(tableData,minRow,maxRow,minCol,maxCol,tarSpan){
    let rSpan = []
    for(let r = minRow; r < maxRow + 1; r++){
        let rSpans = []
        for(let c = minCol; c < maxCol + 1; c++){
            rSpans.push(tableData[r][c][tarSpan])
        }
        rSpans = rSpans.sort();
        rSpan.push(rSpans[rSpans.length - 1]);
    }
    let rowSpanRes = 0;
    rSpan.forEach(val=>{rowSpanRes += val});
    return rowSpanRes;
}
/**
 * 合并单元格前先拆分每个单元格
 * @param {*} tableData 
 * @param {*} r 
 * @param {*} c 
 * @param {*} $refs 
 */
export function splitCellItem(tableData,r,c,$refs){
    let item = $refs[`cell_${r}_${c}`][0];
    let itemAttr = getAttrs(item);
    for(let rIndex = itemAttr.row; rIndex < itemAttr.row + itemAttr.rowspan; rIndex++){
        for(let cIndex = itemAttr.col; cIndex < itemAttr.col + itemAttr.colspan; cIndex ++){
            tableData[rIndex][cIndex].cell_colspan = 1;
            tableData[rIndex][cIndex].cell_rowspan = 1;
            delete tableData[rIndex][cIndex].cell_style.display;
        }
    }
}
/**
 * 合并单元格
 */
export function  mergeCell(){
    if(this.borderConf.startTarget == this.borderConf.endTarget)return false;
    this.paint = this.paintDash.paintInfo;
    // let startTarAttr = getAttrs(this.borderConf.startTarget);
    // let endTarAttr = getAttrs(this.borderConf.endTarget);
    let tableData = this.getTableData();
    
    for(let r = this.paint.minRow; r <= this.paint.maxRow; r++){
        for(let c = this.paint.minCol; c <= this.paint.maxCol; c++){
            if(tableData[r][c].cell_colspan > 1 || tableData[r][c].cell_rowspan > 1){
                splitCellItem(tableData,r,c,this.$refs);
            }
            if(r == this.paint.minRow && c == this.paint.minCol)continue;
            tableData[r][c].cell_style.display = 'none';
            tableData[r][c].cell_value = '';
        };
    };
    let rowSpanCount = this.paint.maxRow - this.paint.minRow + 1;
    let colSpanCount = this.paint.maxCol - this.paint.minCol + 1;
    // let rowSpanCount = getRowColMaxSpan(tableData,this.paint.minRow,this.paint.maxRow,this.paint.minCol,this.paint.maxCol,'cell_rowspan');
    // let colSpanCount = getRowColMaxSpan(tableData,this.paint.minRow,this.paint.maxRow,this.paint.minCol,this.paint.maxRow,'cell_colspan');
    tableData[this.paint.minRow][this.paint.minCol].cell_rowspan = rowSpanCount;
    tableData[this.paint.minRow][this.paint.minCol].cell_colspan = colSpanCount;
    this.setTableData(tableData);
    this.$refs.eborder.$emit('updateBorder');
    this.$emit('hideMenuBox');
}