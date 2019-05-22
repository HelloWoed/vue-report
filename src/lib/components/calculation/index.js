import Calculation from './calcul'

Calculation.install = function(Vue){
    Vue.component(Calculation.name,Calculation);
};
export default Calculation