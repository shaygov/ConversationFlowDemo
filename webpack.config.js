const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

require('dotenv').config();

// const webpack = require('webpack');
// const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
// const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/images'), to: 'images' }
      ],
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new webpack.DefinePlugin({
        // 'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || ''),
        'process.env.REACT_APP_GET_STREAM_API_KEY': JSON.stringify(process.env.REACT_APP_GET_STREAM_API_KEY || ''),
        // 'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GOOGLE_CLIENT_ID || ''),
      })
    ] : []),
  ],
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, "src"),
    },
    port: 3001,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: process.env.REACT_APP_API_URL,
        changeOrigin: true,
        secure: true,
      }
    ]
  },
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env','@babel/preset-react'] }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /extend\.js$/,
        use: 'null-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: [".*",".js",".jsx", ".ts", ".tsx"],
    fallback: {
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "constants": require.resolve("constants-browserify"),
      "os": false,
      "fs": false,
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@vars": path.resolve(__dirname, "src/theme-variables"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@assets": path.resolve(__dirname, "assets"),
      "@services": path.resolve(__dirname, "src/services"),
      "@containers": path.resolve(__dirname, "src/containers"),
      "@components": path.resolve(__dirname, "src/components")
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
        lodashVendor: {
          test: /[\\/]node_modules[\\/](lodash)[\\/]/,
          name: 'vendor-lodash',
          chunks: 'all',
        },
      },
    },
  },
  // target: 'node',
  // node: {
  //   fs: false
  // }
};
