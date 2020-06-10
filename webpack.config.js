require("dotenv").config();

const path = require(`path`);

let mode = `development`;
if (process.env.NODE_ENV === "production") {
  mode = "production";
}

module.exports = {
  mode,
  entry: {
    index: `./front/js/index.js`,
    _sse: `./front/js/_sse.js`
  },
  output: {
    filename: `[name].js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`
  // devServer: {
  //   contentBase: path.join(__dirname, `public`),
  //   publicPath: `http://localhost:8080`,
  //   compress: true,
  //   watchContentBase: true
  // }
};
