import glob from "glob";
import fs from "fs";
import * as acorn from "acorn";
import JSToKotlin from "./src/backend/JSToKotlin.js";

const files = glob.sync("./in/*.js");

const packageName = "com.bobvarioa.youtubei.parsers";

// await Promise.all(
// 	files.map(async (file) => {
	for (const file of files) {
		/*
		Basic template
		```js
		'use strict';

		const Foo = require('./Foo');
		// may be multiple requires

		class Bar extends Baz { // may not extend anything
			type = "Bar";

			constructor(data) {
				super(data); // wont call super if not extending anything

				this.field = data.fielda.fieldb[1].fieldc; //etc
			}
		}

		// may be multiple classes

		module.exports = Bar;
		```
		*/
		const content = await fs.promises.readFile(file, "utf8");
		const ast = acorn.parse(
			content,
			{ ecmaVersion: "latest", sourceType: "module" },
		);

		// TODO: transform the AST to only contain the relevant parts
		
		await fs.promises.writeFile(
			`./out/${file.replace("./in/", "").replace(".js", ".kt")}`,
			`package ${packageName};\n\n${new JSToKotlin(ast, file).toString()}`,
		);
	}
// 	},),
// );