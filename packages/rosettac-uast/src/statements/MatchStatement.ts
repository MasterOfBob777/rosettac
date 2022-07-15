import { Expression } from "../expressions/Expression";
import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * switch (expression) {
 *  case value:
 *   break;
 *  default:
 *   break;
 * }
 * ```
 */
export class MatchStatement extends Statement {
	type: "MatchStatement" = "MatchStatement";

	constructor(
		public readonly expression: Expression,
		public readonly cases: Case[],
		source: SourceLocation,
	) {
		super(source);
	}
}
