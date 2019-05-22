import DesignTable from './components/design'
import EditTable from './components/edit'
import ShowTable from './components/show'
import Calculation from './components/calculation'

const components = [
    DesignTable,
    EditTable,
    ShowTable,
    Calculation
]
function install(Vue){
    components.forEach(component => {
        Vue.component(component.name,component)
    });
};

export {
    DesignTable,
    EditTable,
    ShowTable,
    Calculation,
    install
}

export default install