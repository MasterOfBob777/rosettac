export class FunctionExpression extends Expression {
	type: "FunctionExpression" = "FunctionExpression";

	constructor(
		public readonly name: Identifier,
		public readonly typeParams: TypeParameterDeclaration[],
		public readonly params: Pattern[],
		public readonly returnType: TypeAnnotation,
		public readonly body: BlockStatement,
		source: SourceLocation,
	) {
		super(source);
	}
}
