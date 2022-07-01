/*
Kotlin backend for ASTTranspiler.
*/

import StringBuilder from "node-stringbuilder";

export default class JSToKotlin {
	// sb: StringBuilder;
	// fileName: string;
	// indent: number;

	constructor(node, fileName, indent = 0) {
		this.sb = new StringBuilder();
		this.fileName = fileName;
		this.indent = indent;
		this.jsTopLevel(node);
	}

	append(str) {
		this.sb.append(str);
	}

	updateIndent() {
		this.sb.append("\t".repeat(this.indent));
	}

	appendLine(str) {
		this.updateIndent();
		this.sb.append(str);
		this.sb.append("\n");
	}

	toString() {
		return this.sb.toString();
	}

	jsTopLevel(node) {
		switch (node.type) {
			case "Program":
				for (const n of node.body) {
					this.jsStatement(n);
				}
				break;
			default:
				throw new Error(`Unhandled top level node type ${node.type}`);
		}
	}

	jsStatement(node) {
		switch (node.type) {
			case "BlockStatement":
				this.indent++;
				for (const n of node.body) {
					this.jsStatement(n);
				}
				this.indent--;
				break;
			case "BreakStatement":
				this.appendLine("break;");
				break;
			case "ContinueStatement":
				this.appendLine("continue;");
				break;
			case "DebuggerStatement":
				console.warn(
					`[${this.fileName} ${node.start}:${node.end}] Debugger statements are ignored`,
				);
				break;
			case "DoWhileStatement":
				this.appendLine("do {");
				this.indent++;
				this.jsStatement(node.body);
				this.indent--;
				this.append("} while (");
				this.jsExpression(node.test);
				this.appendLine(");");
				break;
			case "EmptyStatement":
				this.appendLine(";");
				break;
			case "ExpressionStatement":
				this.updateIndent();
				this.jsExpression(node.expression);
				this.append(";");
				this.append("\n");
				break;
			case "ForStatement":
				if (node.init) {
					this.jsStatement(node.init);
				}
				this.append("while (");
				if (node.test) {
					this.jsExpression(node.test);
				} else {
					this.append("true");
				}
				this.appendLine(") {");
				this.jsStatement(node.body);
				if (node.update) {
					this.indent++;
					this.updateIndent();
					this.jsExpression(node.update);
					this.append(";\n");
					this.indent--;
				}
				this.appendLine("}");
				break;
			case "ForInStatement":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] For in statements are not supported, ignoring`,
				);
				break;
			case "ForOfStatement":
				this.appendLine("for (");
				this.jsStatement(node.left);
				this.append(" in ");
				this.jsExpression(node.right);
				this.append(") {");
				this.indent++;
				this.jsStatement(node.body);
				this.indent--;
				this.appendLine("}");
				break;
			case "IfStatement":
				this.updateIndent();
				this.append("if (");
				this.jsExpression(node.test);
				this.append(") {");
				this.append("\n");
				this.indent++;
				this.jsStatement(node.consequent);
				this.indent--;
				this.updateIndent();
				this.append("}");
				if (node.alternate?.type == "IfStatement") {
					this.append(" else ");
					this.jsStatement(node.alternate);
				} else if (node.alternate) {
					this.append(" else {\n");
					this.indent++;
					this.jsStatement(node.alternate);
					this.indent--;
					this.appendLine("}");
				} else {
					this.append("\n");
				}
				break;
			case "LabeledStatement":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Labels are not supported, ignoring`,
				);
				break;
			case "ReturnStatement":
				this.updateIndent();
				this.append("return ");
				if (node.argument) {
					this.jsExpression(node.argument);
				}
				this.append(";");
				this.append("\n");
				break;
			case "SwitchStatement":
				/**
				 * @type {Array<{tests:Array<Object>, body: Array<Object}>}
				 */
				const cases = [];
				let currentCase = { tests: [], body: null };
				for (const n of node.cases) {
					if (currentCase.body != null) {
						cases.push(currentCase);
						currentCase = { tests: [], body: null };
					}
					if (n.test != null) {
						currentCase.tests.push(n.test);
					}
					if (n.consequent.length > 0) {
						currentCase.body = n.consequent;
					}
				}
				if (currentCase.body) {
					cases.push(currentCase);
				}
				this.updateIndent();
				this.append("when (");
				this.jsExpression(node.discriminant);
				this.append(") {");
				this.append("\n");
				this.indent++;
				for (const caseNode of cases) {
					// true if there is a break in the middle of the case
					const returnRequired = caseNode.body.some(
						(n, i) => n.type == "BreakStatement" && i != (caseNode.body.length - 1),
					);
					if (caseNode.tests.length === 0) {
						this.appendLine(`else ->${returnRequired ? " run" : ""} {`);
					} else {
						this.updateIndent();
						for (let i = 0; i < caseNode.tests.length; i++) {
							const test = caseNode.tests[i];
							this.jsExpression(test);
							if (i < (caseNode.tests.length - 1)) {
								this.append(", ");
							}
						}
						this.append(` ->${returnRequired ? " run" : ""} {`);
						this.append("\n");
					}
					this.indent++;
					for (let i = 0; i < caseNode.body.length; i++) {
						const line = caseNode.body[i];
						if (line.type === "BreakStatement") {
							if (returnRequired) {
								this.appendLine("return@run;");
							}
						} else {
							this.jsStatement(line);
						}
					}
					this.indent--;
					this.appendLine("}");
				}
				this.indent--;
				this.updateIndent();
				this.appendLine("}");
				break;
			case "ThrowStatement":
				this.updateIndent();
				this.append("throw ");
				this.jsExpression(node.argument);
				this.append(";");
				this.append("\n");
				break;
			case "TryStatement":
				this.appendLine("try {");
				this.indent++;
				this.jsStatement(node.block);
				this.indent--;
				this.updateIndent();
				this.append("}");
				if (node.handler) {
					this.append(" catch (");
					this.append(node.handler.param.name);
					this.append(") {");
					this.append("\n");
					this.indent++;
					this.jsStatement(node.handler.body);
					this.indent--;
					this.append("}");
				}
				if (node.finalizer) {
					this.append(" finally {");
					this.append("\n");
					this.indent++;
					this.jsStatement(node.finalizer);
					this.indent--;
					this.append("}");
				}
				this.append("\n");
				break;
			case "WhileStatement":
				this.updateIndent();
				this.append("while (");
				this.jsExpression(node.test);
				this.append(") {");
				this.append("\n");
				this.jsStatement(node.body);
				this.appendLine("}");
				break;
			case "WithStatement":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] With statements are not supported, ignoring`,
				);
				break;
			default:
				this.jsDeclarationToKotlin(node);
				break;
		}
	}

	jsDeclarationToKotlin(node) {
		switch (node.type) {
			case "ClassDeclaration":
				/** @type {Record<string, {private: boolean, value: Object, get: Object?, set: Object?}>} */
				const fields = {};
				/** @type {Record<string, {private: boolean, params: Array<Object>, body: Object}>} */
				const methods = {};
				/** @type {Record<string, {private: boolean, value: Object, get: Object?, set: Object?}>} */
				const staticFields = {};
				/** @type {Record<string, {private: boolean, params: Array<Object>, body: Object}>} */
				const staticMethods = {};
				/** @type {Array<{params: Array<Object>, body: Object}>} */
				const constructors = [];

				for (const member of node.body.body) {
					switch (member.type) {
						case "MethodDefinition":
							if (member.kind === "constructor") {
								constructors.push({
									params: member.value.params,
									body: member.value.body,
								},);
							} else if (member.kind === "method") {
								if (member.static) {
									staticMethods[member.key.name] =
										{
											private: member.key.type === "PrivateIdentifier",
											params: member.value.params,
											body: member.value.body,
										};
								} else {
									methods[member.key.name] =
										{
											private: member.key.type === "PrivateIdentifier",
											params: member.value.params,
											body: member.value.body,
										};
								}
							} else if (member.kind === "get") {
								if (member.static) {
									const field = staticFields[member.key.name];
									if (field) {
										field.get = member.value;
									} else {
										staticFields[member.key.name] =
											{
												private: member.key.type === "PrivateIdentifier",
												get: member.value,
											};
									}
								} else {
									const field = fields[member.key.name];
									if (field) {
										field.get = member.value;
									} else {
										fields[member.key.name] =
											{
												private: member.key.type === "PrivateIdentifier",
												get: member.value,
											};
									}
								}
							} else if (member.kind === "set") {
								if (member.static) {
									const field = staticFields[member.key.name];
									if (field) {
										field.set = member.value;
									} else {
										staticFields[member.key.name] =
											{
												private: member.key.type === "PrivateIdentifier",
												set: member.value,
											};
									}
								} else {
									const field = fields[member.key.name];
									if (field) {
										field.set = member.value;
									} else {
										fields[member.key.name] =
											{
												private: member.key.type === "PrivateIdentifier",
												set: member.value,
											};
									}
								}
							}
							break;
						case "ClassProperty":
							if (member.static) {
								const field = staticFields[member.key.name];
								if (field) {
									field.value = member.value;
								} else {
									staticFields[member.key.name] =
										({
											private: member.key.type === "PrivateIdentifier",
											value: member.value,
										});
								}
							} else {
								const field = fields[member.key.name];
								if (field) {
									field.value = member.value;
								} else {
									fields[member.key.name] =
										{
											private: member.key.type === "PrivateIdentifier",
											value: member.value,
										};
								}
							}
					}
				}

				this.updateIndent();
				this.append("open class ");
				this.append(node.id.name);
				if (node.superClass) {
					this.append(" : ");
					this.append(node.superClass.name);
				}
				this.append(" {");
				this.append("\n");
				function handleFields(source) {
					this.indent++;
					for (const [name, field] of Object.entries(source)) {
						this.updateIndent();
						if (field.private) {
							this.append("private ");
						}
						this.append("var ");
						this.append(name);
						this.append(": Any");
						if (field.value) {
							this.append(" = ");
							this.jsExpression(field.value);
							this.append(";");
							this.append("\n");
						}
						this.indent++;
						if (field.get) {
							this.appendLine("get() {");
							this.indent++;
							this.jsStatement(field.get.body);
							this.indent--;
							this.appendLine("}");
						}
						if (field.set) {
							this.append("set(");
							for (const param of field.set.params) {
								this.append(param.name);
								this.append(", ");
							}
							this.append(") {");
							this.indent++;
							this.jsStatement(field.set.body);
							this.indent--;
							this.appendLine("}");
						}
						this.indent--;
					}
					this.indent--;
				}
				function handleMethods(source) {
					this.indent++;
					for (const [name, method] of Object.entries(source)) {
						this.updateIndent();
						if (method.private) {
							this.append("private ");
						}
						this.append("fun ");
						this.append(name);
						this.append("(");
						for (const param of method.params) {
							this.append(param.name);
							this.append(": Any"); // TODO?
							this.append(", ");
						}
						this.append(") {");
						this.indent++;
						this.jsStatement(method.body);
						this.indent--;
						this.appendLine("}");
					}
					this.indent--;
				}
				handleFields.call(this, fields);
				handleMethods.call(this, methods);
				this.indent++;
				for (const structor of constructors) {
					this.updateIndent();
					this.append("constructor(");
					for (const param of structor.params) {
						this.append(param.name);
						this.append(": Any"); // TODO?
						this.append(", ");
					}
					this.append(") {");
					this.append("\n");
					this.jsStatement(structor.body);
					this.appendLine("}");
				}
				this.indent--;
				if (staticFields.length > 0 || staticMethods.length > 0) {
					this.append("\n");
					this.indent++;
					this.appendLine("companion object {");
					handleFields.call(this, staticFields);
					handleMethods.call(this, staticMethods);
					this.appendLine("}");
					this.indent--;
				}
				this.appendLine("}");
				break;
			case "FunctionDeclaration":
				this.updateIndent();
				this.append("fun ");
				this.append(node.id.name);
				this.append("(");
				this.jsParams(node.params);
				this.append(") {");
				this.append("\n");
				this.jsStatement(node.body);
				this.appendLine("}");
				break;
			case "VariableDeclaration":
				for (const decl of node.declarations) {
					this.updateIndent();
					switch (node.kind) {
						case "var":
						case "let":
							this.append("var");
							break;
						case "const":
							this.append("val");
							break;
					}
					this.append(" ");
					this.append(decl.id.name);
					if (decl.init) {
						this.append(" = ");
						this.jsExpression(decl.init);
					}
					this.append(";");
					this.append("\n");
				}
				break;
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ExportSpecifier":
				console.warn(
					`[${this.fileName} ${node.start}:${node.end}] Export statements are ignored`,
				);
				break;
			case "ImportDeclaration":
			case "ImportSpecifier":
			case "ImportDefaultSpecifier":
			case "ImportNamespaceSpecifier":
				// TODO: typealias?
				break;
		}
	}

	jsExpression(node) {
		if (!node) {
			debugger;
		}
		switch (node.type) {
			case "ArrayExpression":
				this.append("listOf(");
				for (let i = 0; i < node.elements.length; i++) {
					const elem = node.elements[i];
					this.jsExpression(elem);
					if (i < (node.elements.length - 1)) {
						this.append(", ");
					}
				}
				this.append(")");
				break;
			case "ArrowFunctionExpression":
				let shouldBeFunction = (() => {
					for (const param of node.params) {
						if (param.type === "AssignmentPattern") {
							return true;
						}
					}
					if (node.body.type === "BlockStatement") {
						for (const stmt of node.body.body) {
							if (stmt.type === "ReturnStatement") {
								return true;
							}
						}
					}
				})();
				if (shouldBeFunction) {
					this.append("fun(");
				} else {
					this.append("{");
				}
				this.jsParams(node.params);
				if (shouldBeFunction) {
					this.append(") {");
				} else if (node.params.length > 0) {
					this.append(" ->");
				}
				if (node.body.type === "BlockStatement") {
					if (node.body.body.length === 0) {
						this.append(" }");
					} else {
						this.append("\n");
						this.indent++;
						for (const stmt of node.body.body) {
							this.jsStatement(stmt);
						}
						this.indent--;
						this.append("}");
					}
				} else {
					if (shouldBeFunction) {
						this.append(" return ");
						this.jsExpression(node.body);
						this.append("; }");
					} else {
						this.append(" ");
						this.jsExpression(node.body);
						this.append(" }");
					}
				}
				break;
			case "AssignmentExpression":
				this.jsExpression(node.left);
				this.append(" = ");
				this.jsExpression(node.right);
				break;
			case "AwaitExpression":
				// TODO: implement
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Await expressions are not supported, ignoring`,
				);
				// currently just treat it as a normal expression
				this.jsExpression(node.argument);
				break;
			case "BinaryExpression":
				// TODO: operator precedence
				this.jsExpression(node.left);
				this.append(" ");
				this.append(node.operator);
				this.append(" ");
				this.jsExpression(node.right);
				break;
			case "CallExpression":
				this.jsExpression(node.callee);
				if (node.optional) {
					this.append("?.invoke");
				}
				this.append("(");
				for (let i = 0; i < node.arguments.length; i++) {
					const arg = node.arguments[i];
					this.jsExpression(arg);
					if (i < (node.arguments.length - 1)) {
						this.append(", ");
					}
				}
				this.append(")");
				break;
			case "ChainExpression":
				this.jsExpression(node.expression);
				break;
			case "ClassExpression":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Class expressions are not supported, ignoring`,
				);
				this.append("null");
				break;
			case "ConditionalExpression":
				this.append("if (");
				this.jsExpression(node.test);
				this.append(") ");
				this.jsExpression(node.consequent);
				this.append(" else ");
				this.jsExpression(node.alternate);
				break;
			case "FunctionExpression":
				this.append("fun(");
				this.jsParams(node.params);
				this.append(") {\n");
				this.jsStatement(node.body);
				this.updateIndent();
				this.append("}");
				break;
			case "Identifier":
				this.append(node.name);
				break;
			case "ImportExpression":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Import expressions are not supported, ignoring`,
				);
				this.append("null");
				break;
			case "Literal":
				this.jsLiteral(node);
				break;
			case "LogicalExpression":
				// TODO: operator precedence
				this.jsExpression(node.left);
				this.append(" ");
				this.append(node.operator);
				this.append(" ");
				this.jsExpression(node.right);
				break;
			case "MemberExpression":
				// TODO: currently only supports simple member expressions
				this.jsExpression(node.object);
				if (node.computed) {
					if (node.optional) {
						this.append("?.get(");
						this.jsExpression(node.property);
						this.append(")");
					} else {
						this.append("[");
						this.jsExpression(node.property);
						this.append("]");
					}
				} else {
					if (node.optional) {
						this.append("?");
					}
					this.append(".");
					this.append(node.property.name);
				}
				break;
			case "NewExpression":
				this.jsExpression(node.callee);
				this.append("(");
				for (let i = 0; i < node.arguments.length; i++) {
					const arg = node.arguments[i];
					this.jsExpression(arg);
					if (i < (node.arguments.length - 1)) {
						this.append(", ");
					}
				}
				this.append(")");
				break;
			case "ObjectExpression":
				const spreads = [];
				this.append("mapOf(");
				for (let i = 0; i < node.properties.length; i++) {
					const prop = node.properties[i];
					if (prop.type === "SpreadElement") {
						this.append("...");
						spreads.push(prop.argument);
						continue;
					}
					if (prop.computed) {
						this.append("(");
						this.jsExpression(prop.key);
						this.append(")");
					} else if (prop.key.type === "Identifier") {
						this.append('"');
						this.append(prop.key.name);
						this.append('"');
					} else if (prop.key.type === "Literal") {
						this.jsLiteral(prop.key);
					}
					this.append(" to ");
					this.jsExpression(prop.value);
					if (i < (node.properties.length - 1)) {
						this.append(", ");
					}
				}
				this.append(")");
				for (const spread of spreads) {
					this.append(" + ");
					this.jsExpression(spread);
				}
				break;
			case "SequenceExpression":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Sequence expressions are not supported, ignoring`,
				);
				this.append("null");
				break;
			case "TaggedTemplateExpression":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Tagged template expressions are not supported, ignoring`,
				);
				this.append("null");
				break;
			case "TemplateLiteral":
				this.append('"');
				for (let i = 0; i < node.quasis.length; i++) {
					this.append(node.quasis[i].value.raw);
					if (i < node.expressions.length) {
						this.append("${");
						this.jsExpression(node.expressions[i]);
						this.append("}");
					}
				}
				this.append('"');
				break;
			case "ThisExpression":
				this.append("this");
				break;
			case "UnaryExpression":
				this.append(node.operator);
				this.jsExpression(node.argument);
				break;
			case "UpdateExpression":
				if (node.prefix) {
					this.append(node.operator);
					this.jsExpression(node.argument);
					break;
				}
				this.jsExpression(node.argument);
				this.append(node.operator);
				break;
			case "YieldExpression":
				console.error(
					`[${this.fileName} ${node.start}:${node.end}] Yield expressions are not supported, ignoring`,
				);
				this.append("null");
				break;
		}
	}

	jsLiteral(node) {
		if (node.regex) {
			this.append('Regex("');
			this.append(node.regex.pattern);
			this.append('"');
			if (node.regex.flags) {
				this.append(', "');
				this.append(node.regex.flags); //this is wrong
				this.append('"');
			}
			this.append(")");
		} else {
			const raw = node.raw;
			if (raw.startsWith("'") && raw.endsWith("'")) {
				this.append('"');
				this.append(raw.slice(1, -1));
				this.append('"');
			} else {
				this.append(node.raw);
			}
		}
	}

	jsParams(params) {
		for (let i = 0; i < params.length; i++) {
			const param = params[i];
			if (param.type === "AssignmentPattern") {
				this.append(param.left.name);
				this.append(": dynamic"); // TODO?
				this.append(" = ");
				this.jsExpression(param.right);
			} else {
				this.append(param.name);
				this.append(": dynamic"); // TODO?
			}
			if (i < (params.length - 1)) {
				this.append(", ");
			}
		}
	}
}
