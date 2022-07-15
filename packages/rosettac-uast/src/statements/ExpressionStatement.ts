import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * // expression;
 * ```
 */
export class ExpressionStatement extends Statement {
	type: "ExpressionStatement" = "ExpressionStatement";

	constructor(public readonly expression: Expression, source: SourceLocation) {
		super(source);
	}
}
