const path = require("path");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  watch: false, // make it true only for dev, otherwise azure devops pipeline will not return
  entry: {
    orghub: "./src/orghub/orghub.tsx",
    qmshub: "./src/qmshub/qmshub.tsx",
  },
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.html$/,
        loader: "file-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "vss-web-extension-sdk": path.resolve(
        "node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js"
      ),
    },
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the output directory before each build
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "./"),
        watch: true,
      },
      {
        directory: path.join(__dirname, "dist"),
        watch: true,
      },
      {
        directory: path.join(__dirname, "src"),
        watch: true,
      },
    ],
    compress: true,
    https: true,
    port: 3000,
    liveReload: true,
  },
};
