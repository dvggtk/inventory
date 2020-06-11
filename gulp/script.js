const rollup = require("rollup");
const svelte = require("rollup-plugin-svelte");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const {terser} = require("rollup-plugin-terser");
const path = require("path");

const production = process.env.NODE_ENV === "production";

const rollupPlugins = [
  svelte({
    // enable run-time checks when not in production
    dev: !production,
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css: (css) => {
      css.write("public/css/svelte.css");
    }
  }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs

  resolve.default({
    browser: true,
    dedupe: ["svelte"]
  }),

  commonjs()
];

if (production) {
  rollupPlugins.push(terser());
}

const BASE_INPUT = "front/js";
const BASE_OUTPUT = "public/js";

function build(entries) {
  return Promise.all(
    entries.map(({inputFile}) => {
      const inputOptions = {
        input: path.resolve(BASE_INPUT, inputFile),
        plugins: rollupPlugins
      };
      const outputOptions = {
        output: {
          name: "app",
          dir: path.resolve(BASE_OUTPUT),
          format: "cjs",
          sourcemap: true,
          plugins: rollupPlugins
        }
      };

      return (async () => {
        const bundle = await rollup.rollup(inputOptions);
        await bundle.write(outputOptions);
      })();
    })
  );
}

async function script() {
  try {
    const entries = [{inputFile: "index.js"}, {inputFile: "_sse.js"}];
    await build(entries);
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = script;
