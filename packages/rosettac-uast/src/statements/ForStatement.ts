import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * for (let i = 0; i < 10; i++) {
 * 	// body
 * }
 */
export class ForStatement extends Statement {
	type: "ForStatement" = "ForStatement";

	constructor(
		public readonly init: Expression,
		public readonly condition: Expression,
		public readonly increment: Expression,
		public readonly body: Statement,
		source: SourceLocation,
	) {
		super(source);
	}
}
