module.exports = {
    common: './src/theme/mixins/common.scss',   //global scss variables
    theme: ['default','light'],   //theme type
    output:{                       
        all:'./public/theme',
    },
    injectHtml:'./public/index.html',    //html template
    themeTagId:'theme',                 
}