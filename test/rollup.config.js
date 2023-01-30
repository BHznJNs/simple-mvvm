export default {
    input: "./src/index.js",
    output: {
        file: "bundle.js",
        name: "MvvmModule",
        format: "umd",
        exports: "named",
    }
}