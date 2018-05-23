const path = require("path");

module.exports = {
    mode : "development",
    entry: {
        "client": ["babel-polyfill", "./react/loader.js"]
    },
    output: {
        path: path.join(__dirname, "dev/assets/js"),
        filename: '[name].js'
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["env", "stage-2", "react"]
                        }
                    }
                ],  
                exclude: /node_modules/
            },

            {
                test: /\.styl$/,
                use: [ //use if apply many loaders
                    "style-loader",
                    "css-loader",
                    "stylus-loader"
                ]
            }
        ]
    },
    devtool: "cheap-module-eval-source-map"
};
