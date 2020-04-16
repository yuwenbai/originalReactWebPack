const Webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const WebpackMerge = require("webpack-merge");
module.exports = WebpackMerge(webpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    host: "127.0.0.1",
    port: 3000,
    hot: true,
    contentBase: "../dist",
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()],
});
