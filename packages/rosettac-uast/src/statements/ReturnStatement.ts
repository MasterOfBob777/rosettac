import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * return expression;
 * ```
 */
export class ReturnStatement extends Statement {
	type: "ReturnStatement" = "ReturnStatement";

	constructor(public readonly expression: Expression, source: SourceLocation) {
		super(source);
	}
}
