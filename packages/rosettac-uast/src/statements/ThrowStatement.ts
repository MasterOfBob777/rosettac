import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * throw expression;
 * ```
 */
export class ThrowStatement extends Statement {
	type: "ThrowStatement" = "ThrowStatement";

	constructor(public readonly expression: Expression, source: SourceLocation) {
		super(source);
	}
}
