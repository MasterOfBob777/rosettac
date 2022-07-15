import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * if (condition) {
 *  // thenBody
 * } else {
 * 	// elseBody
 * }
 */
export class IfStatement extends Statement {
	type: "IfStatement" = "IfStatement";

	constructor(
		public readonly condition: Expression,
		public readonly thenBody: Statement,
		public readonly elseBody: Statement | undefined,
		source: SourceLocation,
	) {
		super(source);
	}
}
