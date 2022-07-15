import { SourceLocation } from "../unit/Node";
import { BlockStatement } from "./BlockStatement";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * do {
 * 	// body
 * }
 * ```
 */
export class DoStatement extends Statement {
	type: "DoStatement" = "DoStatement";

	constructor(public readonly body: BlockStatement, source: SourceLocation) {
		super(source);
	}
}
