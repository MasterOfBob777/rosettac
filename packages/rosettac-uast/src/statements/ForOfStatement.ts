import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * for (const element of iterable) {
 * 	// body
 * }
 * ```
 */
export class ForOfStatement extends Statement {
	type: "ForOfStatement" = "ForOfStatement";

	constructor(
		public readonly element: VariableDeclaration,
		public readonly iterable: Expression,
		source: SourceLocation,
	) {
		super(source);
	}
}
