const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    // Define the entry point of the application.
    entry: './src/index.ts',

    // Define where and how to output the bundles.
    output: {
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Clean the output directory before emit.
    },

    // Determine how the different types of modules will be treated.
    module: {
      rules: [
        // All files with '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        // All files with a '.scss' or '.css' extension will be handled by 'sass-loader', 'css-loader' and 'style-loader'.
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader', // Injects styles into the DOM
            'css-loader',   // Translates CSS into CommonJS
            'sass-loader',  // Compiles Sass to CSS, using Node Sass by default
          ],
        },
      ],
    },

    // Configure how modules are resolved.
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },

    // Setup the dev server.
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      hot: false, // Enable/disable hot reloading
      liveReload: false, // ensure live reloading is also disabled
      open: true, // Open the browser after server had been started.
      port: 9000,
      
    },

    // Add plugins to the compiler.
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'), // Create a new index.html with injected script tag for the bundle
      }),
    ],

    // Set the mode to development or production.
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'source-map', 
  };
};
