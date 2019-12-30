module.exports = {
    common: './src/theme/mixins/common.scss',   //global scss variables
    theme: ['default','light'],   //theme type
    output:{                       
        all:'./public/theme',
        html:'./public'
    },
    injectHtml:'./src/index.html',    //html template
    themeTagId:'theme',                 
    // themeModuleBuild:true,      //default value: true
}