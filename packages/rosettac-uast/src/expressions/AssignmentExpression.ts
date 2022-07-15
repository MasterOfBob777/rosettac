import { SourceLocation } from "../unit/Node";
import { Expression } from "./Expression";

export class AssignmentExpression extends Expression {
	type: "AssignmentExpression" = "AssignmentExpression";

	constructor(
		public readonly left: Identifier,
		public readonly right: Expression,
		source: SourceLocation,
	) {
		super(source);
	}
}
