<template>
    <div class="designStep">
        <excel-border ref="eborder" :paintDash="paintDash" @copyCell="copyCell" />
        <div class="mouseRightMenu" :style="rightMouseMenuStyle" v-if="visableRightMouseMenu">
            <RightMouseMenu @insertRow="insertRow" 
                @insertCol="insertCol" 
                @deleteCol="deleteCol"
                @deleteRow="deleteRow" /> 
        </div>
        <excel-resizer
            :target="rowResizer.target"
            :index="rowResizer.index"
            @change="rowChangeResizerHandler"
            v-if="rowResizer && rowResizer.target">
        </excel-resizer>
        <excel-cell-editr 
            :target="editData" 
            @cellEditUpdate="cellEditUpdate">
        </excel-cell-editr>
    </div>
</template>
