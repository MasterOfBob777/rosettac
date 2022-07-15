import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * do {
 *  // body
 * } while (condition);
 */
export class DoWhileStatement extends Statement {
	type: "DoWhileStatement" = "DoWhileStatement";

	constructor(
		public readonly condition: Expression,
		public readonly body: Statement,
		source: SourceLocation,
	) {
		super(source);
	}
}
