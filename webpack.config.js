module.exports = {
  plugins: [],
  mode:    'development',
  // Entry
  entry: {
    index: './index.ts'
  },
  // Output
  output:  {
    filename: '[name].min.js',
    path:     `${__dirname}/dist`,
    library: {
      type: "umd"
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  // Loaders
  module: {
    rules: [
      // TypeScript
      {
        test: /\.(ts|tsx)$/,
        use:  [
          {
            loader:  'ts-loader',
            options: { allowTsInNodeModules: true }
          }
        ]
      }
    ]
  }
};
