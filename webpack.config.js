const path = require("path");
const HtmlWebpackPlugin = require("./node_modules/html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	mode: "production",
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "WebPage Name",
			template: "./src/index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: ["/node_modules/"],
				use: ["babel-loader"],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
	resolve: {
		alias: {
			config$: "./configs/app-config.js",
			react: "./vendor/react-master",
		},
		extensions: [".js", ".jsx"],
		modules: [
			"node_modules",
			"bower_components",
			"shared",
			"/shared/vendor/modules",
		],
	},
};
