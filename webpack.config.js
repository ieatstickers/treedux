module.exports = {
  plugins: [],
  mode:    'development',
  // Entry
  entry: {
    index: './index.ts'
  },
  // Output
  output:  {
    filename: 'entry/[name]/[name].min.js',
    path:     `${__dirname}/public`
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
