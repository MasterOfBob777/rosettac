import { SourceLocation } from "../unit/Node";
import { Expression } from "./Expression";

export class CallExpression extends Expression {
	type: "CallExpression" = "CallExpression";

	constructor(
		public readonly callee: Expression,
		public readonly typeArguments: Expression[],
		public readonly args: Expression[],
		public readonly kwargs: Expression[], // should be a map
		public readonly optional: boolean,
		source: SourceLocation
	) {
		super(source);
	}
}
