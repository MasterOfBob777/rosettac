import { SourceLocation } from "../unit/Node";
import { Expression } from "./Expression";

export class BinaryOperatorExpression extends Expression {
	type: "BinaryOperatorExpression" = "BinaryOperatorExpression";

	constructor(
		public readonly left: Expression,
		public readonly operator: string,
		public readonly right: Expression,
		source: SourceLocation,
	) {
		super(source);
	}
}
