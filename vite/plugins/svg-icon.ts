import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

export const vitePluginSvgIcons = (pathSrc: string) =>
  createSvgIconsPlugin({
    iconDirs: [`${pathSrc}/icons`],
    symbolId: 'icon-[dir]-[name]',
    inject: 'body-last',
    htmlMode: 'none',
    customDomId: '__svg__icons__dom__',
    // ng 的 baker 关闭了 removeUnknownsAndDefaults，会留下 fill="#000" / stroke="#000"。
    // 旧插件会剥掉默认黑，路径才能吃到 <use fill/stroke="currentColor">；这里补回 currentColor。
    bakerOptions: {
      svgoOptions: {
        plugins: [{ name: 'convertColors', params: { currentColor: true } }],
      },
    },
  })
