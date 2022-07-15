import { SourceLocation } from "../unit/Node";
import { Expression } from "./Expression";

export class AwaitExpression extends Expression {
	type: "AwaitExpression" = "AwaitExpression";

	constructor(public readonly argument: Expression, source: SourceLocation) {
		super(source);
	}
}
