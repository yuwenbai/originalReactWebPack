const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HappyPack = require("happypack");
const os = require("os");
const threads = os.cpus().length;

console.log(" aaaa __dirname is " + __dirname);
module.exports = {
  mode: "development", // 开发模式
  // entry: path.resolve(__dirname,'../src/main.js'),    // 入口文件
  entry: ["@babel/polyfill", path.resolve(__dirname, "../src/index.jsx")],
  output: {
    filename: "[name].[hash:8].js", // 打包后的文件名称
    path: path.resolve(__dirname, "../dist"), // 打包后的目录
  },
  devServer: {
    host: "127.0.0.1",
    port: 3000,
    hot: true,
    contentBase: "../dist",
  },
  resolve: {
    alias: {
      react: "react",
      "@": path.resolve(__dirname, "../src"),
      components: path.resolve(__dirname, "../src/components"),
      assets: path.resolve(__dirname, "../src/assets"),
    },
    extensions: ["*", ".js", ".json", ".jsx"],
  },
  plugins: [
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new CopyWebpackPlugin([ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
          {
            from:path.resolve(__dirname,'./static'),
            to:path.resolve(__dirname,'../dist/static')
          }
        ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].css",
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      id: "happyBabel", // 与Loader对应的id标识
      loaders: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
          cacheDirectory: true,
        },
      ],
      threads,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // 从右向左解析原则
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")],
            },
          },
          "less-loader",
        ], // 从右向左解析原则
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /(\.jsx|\.js)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /(\.jsx|\.js)/,
        use: "happypack/loader?id=happyBabel",
        exclude: /node_modules/,
      },
      {
        test: /(\.jsx|\.js)/,
        use: ["cache-loader","happypack/loader?id=happyBabel"],
        exclude:/node_modules/
       },
    ],
  },
};
