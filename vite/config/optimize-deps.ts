const elementPlusComponentNames = `affix,alert,anchor,anchor-link,aside,autocomplete,avatar,backtop,badge,base,breadcrumb,breadcrumb-item,button,button-group,calendar,card,carousel,carousel-item,cascader,cascader-panel,check-tag,checkbox,checkbox-button,checkbox-group,col,collapse,collapse-item,collapse-transition,color-picker,config-provider,container,countdown,date-picker,descriptions,descriptions-item,dialog,divider,drawer,dropdown,dropdown-item,dropdown-menu,empty,footer,form,form-item,header,icon,image,image-viewer,infinite-scroll,input,input-number,input-tag,link,loading,main,mention,menu,menu-item,menu-item-group,message,message-box,notification,option,option-group,overlay,page-header,pagination,popconfirm,popover,popper,progress,radio,radio-button,radio-group,rate,result,row,scrollbar,segmented,select,select-v2,skeleton,skeleton-item,slider,space,statistic,step,steps,sub-menu,switch,tab-pane,table,table-column,table-v2,tabs,tag,teleport,text,time-picker,time-select,timeline,timeline-item,tooltip,tour,tour-step,transfer,tree,tree-select,tree-v2,upload,virtual-list,watermark`
function generateElementPlusPaths(names: string): string[] {
  return names
    .split(',')
    .flatMap((name) => [
      `element-plus/es/components/${name}/style/css`,
      `element-plus/es/components/${name}/style/index`,
    ])
}

export const ViteConfigOptimizeDeps = {
  include: [
    'vue',
    'vue-router',
    'pinia',
    '@vueuse/core',
    'vue-i18n',
    'axios',

    'element-plus/es',
    ...generateElementPlusPaths(elementPlusComponentNames),
  ], // await vite to solve this bug,
}
