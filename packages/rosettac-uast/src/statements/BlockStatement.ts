import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 * A collection of statements. Creates a new scope.
 * @example
 * ```ts
 * {
 * 	// statements
 * }
 * ```
 */
export class BlockStatement extends Statement {
	type: "BlockStatement" = "BlockStatement";

	constructor(public readonly statements: Statement[], source: SourceLocation) {
		super(source);
	}
}
