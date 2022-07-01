import JSToKotlin from "../../src/backend/JSToKotlin.js";
import glob from "glob";
import * as acorn from "acorn";
import fs from "fs";

function* testCases(name) {
	for (const file of glob.sync(`tests/parser/${name}/*.js`)) {
		yield {name, file: /^(.*)\/(.*)\.js$/.exec(file)[2]}
	}
}

function runFile(thing) {
	let _file = `./tests/parser/${thing.name}/${thing.file}.js`;
	const logs = [];
	console.log = (...args) => logs.push("LOG: " + args.toString());
	console.warn = (...args) => logs.push("WARN: " + args.toString());
	console.error = (...args) => logs.push("ERROR: " + args.toString());
	const content = fs.readFileSync(_file, "utf8");
	const ast = acorn.parse(
		content,
		{
			ecmaVersion: "latest",
			sourceType: "module",
			allowReturnOutsideFunction: true,
			allowAwaitOutsideFunction: true,
			allowHashBang: true,
			allowImportExportEverywhere: true,
			allowSuperOutsideMethod: true,
			allowUndeclaredExports: true,
		},
	);
	const jsToKotlin = new JSToKotlin(ast, _file);
	expect(jsToKotlin.toString() + logs.map((l) => `// ${l}`).join("\n")).toBe(
		fs.readFileSync(_file.replace(".js", ".kt"), "utf8"),
	);
}

describe(
	"Parser",
	() => {
		test.each([...testCases("statements")])("$name: $file", runFile);
		test.each([...testCases("expressions")])("$name: $file", runFile);
		test.each([...testCases("declarations")])("$name: $file", runFile);
	},
);
