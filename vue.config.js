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
        prependData: `
          @import "@/assets/scss/_util";
        `,
        sassOptions: {
          precision: 8,
        },
      },
    },
    sourceMap: true,
  },
}
