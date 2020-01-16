import KTable from './src/KTable';

KTable.install = Vue=>{
    Vue.component(KTable.name,KTable);
};

export default KTable;