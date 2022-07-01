class Parser {
	static convert(input: string): string {
		const ast = acorn.parse(
			input,
			{ ecmaVersion: "latest", sourceType: "module" },
		);
		return ASTTranspiler.convert(TypeInferer.convert(ast));
	}
}