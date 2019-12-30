import KMarkdown from './src/KMarkdown.vue'

KMarkdown.install = Vue=>{
    Vue.component(KMarkdown.name,KMarkdown)
}

export default KMarkdown;