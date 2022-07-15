import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * continue;
 * ```
 */
export class ContinueStatement extends Statement {
	type: "ContinueStatement" = "ContinueStatement";

	constructor(source: SourceLocation) {
		super(source);
	}
}
