module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // Handle JavaScript/JSX files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/, // Handle CSS files
          use: ['style-loader', 'css-loader'], // Apply these loaders
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Resolve JavaScript/JSX extensions
    },
  };
  