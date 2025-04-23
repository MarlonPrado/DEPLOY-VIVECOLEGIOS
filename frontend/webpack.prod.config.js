/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TersetJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[id].js',
    publicPath: 'auto',
    chunkFilename: 'js/[id].[chunkhash].js',
  },
  optimization: {
    //minimizer: [new TersetJSPlugin(), new OptimizeCSSAssetsPlugin()],
    concatenateModules: false,
    providedExports: false,
    usedExports: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        dependency: { not: ['url'] },
        test: /\.jpg|png|gif|woff|eot|ttf|svg|mp4|webm|jpeg$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production'),
        'PUBLIC_URL': JSON.stringify('http://vivecolegios.nortedesantander.gov.co'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
      chunkFilename: 'css/[id].[chunkhash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Vive Colegios 3.0',
      favicon:  path.resolve(__dirname, 'public/favicon.ico'),
      template: path.resolve(__dirname, 'public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'public/apple-icon-57x57.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-60x60.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-72x72.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-76x76.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-114x114.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-120x120.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-144x144.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-152x152.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/apple-icon-180x180.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-192x192.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-144x144.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-96x96.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-72x72.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-48x48.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/android-icon-36x36.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/favicon-32x32.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/favicon-96x96.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/favicon-16x16.png'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/meta.json'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/manifest.json'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'public/12AE5AFDD31FAF4E046C893C8A1E55AE.txt'), to: path.resolve(__dirname, 'dist/.well-known/pki-validation/') },
        { from: path.resolve(__dirname, 'public/C37DD54BE84B26F0027B9EB840D14002.txt'), to: path.resolve(__dirname, 'dist/.well-known/pki-validation/') },
        { from: path.resolve(__dirname, 'public/6B3D7EA45EF1FDCEE3F3D90DADAEF90B.txt'), to: path.resolve(__dirname, 'dist/.well-known/pki-validation/') },
      ],
    }),
    // new AddAssetHtmlPlugin({
    //   filepath: path.resolve(__dirname, 'dist/js/*.dll.js'),
    //   outputPath: 'js',
    //   publicPath: 'http://http://vivecolegios.vhmsoluciones.com:3000/js',
    // }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*/app.'],
    }),
  ],
};