module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          precision: 8,
        },
      },
    },
    sourceMap: true,
  },
  pwa: {
    name: 'Pixelise',
    themeColor: '#fff',
    appleMobileWebAppCapable: 'yes',
    iconPaths: {
      appleTouchIcon: 'img/icons/apple-touch-icon-precomposed.png',
      msTileImage: 'img/icons/mstile-150x150.png',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/serviceWorker.js',
    },
    msTileColor: '#4400ff',
    manifestOptions: {
      background_color: '#fff',
      theme_color: 'transparent',
    },
  },
}
