import DesignTable from './excelReport'

DesignTable.install = function(Vue){
    Vue.component(DesignTable.name,DesignTable);
}

export default DesignTable