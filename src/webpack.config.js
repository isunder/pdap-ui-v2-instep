const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // Entry file
  output: {
    filename: 'bundle.js', // Output bundle name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Match .js and .jsx files
        exclude: /node_modules/, // Exclude dependencies
        use: {
          loader: 'babel-loader', // Use Babel to transpile files
          options: {
            presets: [
              '@babel/preset-env', // Transpile modern JavaScript
              '@babel/preset-react', // Transpile JSX
            ],
          },
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Process CSS files
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Automatically resolve these extensions
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from 'dist'
    compress: true, // Enable gzip compression
    port: 3000, // Development server port
  },
};
