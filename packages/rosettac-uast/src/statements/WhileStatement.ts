import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * while (condition) {
 *  // body
 * }
 * ```
 */
export class WhileStatement extends Statement {
	type: "WhileStatement" = "WhileStatement";

	constructor(
		public readonly condition: Expression,
		public readonly body: Statement,
		source: SourceLocation,
	) {
		super(source);
	}
}
