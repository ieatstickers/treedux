const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  target: "node",
  devtool: "source-map",
  plugins: [],
  mode:    process.env.ENV === "dev" ? "development" : "production",
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".json" ]
  },
  // Loaders
  module: {
    rules: [
      // TypeScript
      {
        test: /\.(ts|tsx)$/,
        exclude: /\.(test|testing)\.ts$/,
        use:  [ { loader: "ts-loader" } ]
      }
    ]
  }
};

module.exports = [
  // index.ts (cjs)
  {
    ...baseConfig,
    externals: [ nodeExternals() ],
    // Entry
    entry: "./index.ts",
    // Output
    output:  {
      filename: "index.cjs",
      path: `${__dirname}/dist`,
      library:      {
        type: "commonjs2"
      }
    },
  },
  // index.ts (esm)
  {
    ...baseConfig,
    externals: [ nodeExternals({ importType: "module" }) ],
    // Entry
    entry: "./index.ts",
    // Output
    output:  {
      filename: "index.mjs",
      path: `${__dirname}/dist`,
      library:      {
        type: "module"
      },
      chunkFormat: 'module'
    },
    experiments: {
      outputModule: true,
    },
  },
];
