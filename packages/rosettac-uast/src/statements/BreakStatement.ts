import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 * Breaks out of the current loop.
 * @example
 * ```ts
 * break;
 * ```
 */
export class BreakStatement extends Statement {
	type: "BreakStatement" = "BreakStatement";

	constructor(source: SourceLocation) {
		super(source);
	}
}
