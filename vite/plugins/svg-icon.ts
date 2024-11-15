import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export const vitePluginSvgIcons = (pathSrc: string) =>
  createSvgIconsPlugin({
    iconDirs: [`${pathSrc}/icons`],
    symbolId: 'icon-[dir]-[name]',
    inject: 'body-last', // or body-first
    customDomId: '__svg__icons__dom__'
  })
