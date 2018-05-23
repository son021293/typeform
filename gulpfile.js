const nodemon = require("gulp-nodemon");
const gulp = require("gulp");
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const startServer = () =>{
    nodemon({
        script:"src/index.js",
        ext:"js",
        exec: "babel-node",
        ignore:[
            ".idea/",
            ".git/",
            "gulpfile.js",
            "react/",
            "dev/assets",
            "node_modules/"
        ],
        env:{'NODE_ENV': 'development'}
    })
   // spawn('node', ["dev/server.js"], { stdio: 'inherit' });
};

const stylusCompiler =  {
    watch: (desk) =>{
        require("./compile-stylus").createCompiler(desk).watch();
    },
    compile: (desk) =>{
        return Promise.all([
            require("./compile-stylus").createCompiler(desk).compile(),
        ]);
    }
};



const packagingAssets = () =>{
    gulp.src(["./dev/**", "!./dev/assets/css/**","!./dev/assets/js/**"])
        .pipe(gulp.dest("./build"));
};

gulp.task("dev", ()=>{
    // startServer();
    stylusCompiler.watch("./dev/assets/css");
    if (!/^win/.test(process.platform)) { // linux
        spawn("webpack", ["--watch"], {stdio: "inherit"});
    } else {
        spawn('cmd', ['/s', "/c", "webpack", "--w"], {stdio: "inherit"});
    }
});
gulp.task("packaging-assets", packagingAssets);

// gulp.task("build-prod", () => {
//     packageAssets();
//     stylusCompiler.compile("./build/assets/css").then(() => {
//         let hash = makeid();
//         let html = fs.readFileSync("./build/index.html", {encoding: "utf8"});
//         html = html.replace(`"/assets/css/style.css"`, `"/assets/css/style.css?v=${hash}"`);
//         html = html.replace(`"/assets/js/client-loader.js"`, `"/assets/js/client-loader.js?v=${hash}"`);
//         fs.writeFileSync("./build/index.html", html);
//
//         let serverJS = fs.readFileSync("./build/server.js", {encoding: "utf8"});
//         serverJS = serverJS.replace(`const config = {host: "http://adteria.local:8888", port: 8888, mongodbURI: "mongodb://localhost:27017/adteria"};`, `const config = {host: "https://adteria-my.herokuapp.com", port: 8888, mongodbURI: "mongodb://localhost:27017/adteria"};`);
//         fs.writeFileSync("./build/server.js", serverJS);
//
//
//         console.log("Running Webpack");
//         run("webpack --config webpack.config.prod").exec(() => {
//             console.log("webpack done");
//         });
//     })
//
// });
//
//
// // git push heroku master
//
// gulp.task("deploy", () => {
//
//     packageAssets();
//     stylusCompiler.compile("./build/assets/css").then(() => {
//         let hash = makeid();
//         let html = fs.readFileSync("./build/index.html", {encoding: "utf8"});
//         html = html.replace(`"/assets/css/style.css"`, `"/assets/css/style.css?v=${hash}"`);
//         html = html.replace(`"/assets/js/client-loader.js"`, `"/assets/js/client-loader.js?v=${hash}"`);
//         fs.writeFileSync("./build/index.html", html);
//
//         let serverJS = fs.readFileSync("./build/server.js", {encoding: "utf8"});
//         serverJS = serverJS.replace(`const config = {host: "http://adteria.local:8888", port: 8888, mongodbURI: "mongodb://localhost:27017/adteria"};`, `const config = {host: "https://adteria-my.herokuapp.com", port: 8888, mongodbURI: "mongodb://localhost:27017/adteria"};`);
//         fs.writeFileSync("./build/server.js", serverJS);
//
//         console.log("Running Webpack");
//         run("webpack --config webpack.config.prod").exec(() => {
//             run("git commit -a -m 'Deploy to heroku'").exec(() => {
//                 console.log("Commited");
//                 run("git push heroku master").exec(() => {
//                     console.log("pushed");
//                 })
//             })
//         });
//     })
//
//
// });