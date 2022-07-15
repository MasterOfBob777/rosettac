import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * break label;
 * ```
 */
export class JumpStatement extends Statement {
	type: "JumpStatement" = "JumpStatement";

	constructor(public readonly name: string, source: SourceLocation) {
		super(source);
	}
}
